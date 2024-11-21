import { writable } from "svelte/store";
import { Context } from "./context";
import { initSystemPrompt } from "./systemPrompt";
import { MockModel } from "./mockModel";
import { Action, parseActions } from "./actionParser";
import { getTabContent } from "./getTabContent";

let CURRENT_MODEL: "GeminiNano" | "MockModel" = "GeminiNano";

export type Message = {
  id: string;
  isUser: boolean; // Whether this message is from user or from AI
  timestamp: number;
  content: string;
  actions?: Action[];
  debug?: {
    systemPrompt?: string;
  };
};

export type Conversation = {
  id: string;
  title: string;
  startedAt: number;
  isCurrent: boolean;
  messages: Message[];
};

type AIOptions = {
  temperature: number;
  topk: number;
};

export const conversationHistory = writable<Conversation[]>([]);

const prmoptWithGeminiNano = async (
  userPrompt: string,
  context: Context,
  previousMessages: Message[],
  aiOpts: AIOptions
): Promise<string> => {
  try {
    const session = await window.ai.languageModel.create({
      systemPrompt: initSystemPrompt(context.openTabs, previousMessages),
      temperature: aiOpts.temperature,
      topK: aiOpts.topk,
    });
    const promptResult: string = await session.prompt(userPrompt);
    if (promptResult.startsWith("TAB_CONTENT:")) {
      const [, ids] = promptResult.split(":");
      if (ids && ids !== "") {
        const idArray = ids
          .split(",")
          .map((id) => parseInt(id, 10))
          .filter((id) => !isNaN(id));
        const promises = idArray.map((id) => getTabContent(id));
        const tabContents = await Promise.all(promises);
        const tabContentContext = tabContents.reduce((acc, cur, curIdx) => {
          return `${acc}\nContent of a tab with id ${idArray[curIdx]}:\n${cur}`;
        }, "");
        const promptResult: string = await session.prompt(
          `${userPrompt}\nTAB_CONTENT\n${tabContentContext}`
        );
        return promptResult;
      }
      return "Failed to retrieve tab content";
    }
    return promptResult;
  } catch (error) {
    throw error;
  }
};

const promptWithMockModel = async () => {
  await new Promise((r) => setTimeout(r, 1500));
  return MockModel.responseWithActions();
};

const promptModel = async (
  userPrompt: string,
  context: Context,
  previousMessages: Message[],
  aiOpts: AIOptions
): Promise<string> => {
  try {
    if (CURRENT_MODEL === "GeminiNano") {
      const response = await prmoptWithGeminiNano(
        userPrompt,
        context,
        previousMessages,
        aiOpts
      );
      return response;
    }
    const response = await promptWithMockModel();
    return response;
  } catch (error) {
    throw error;
  }
};

const getAiErrorResponse = (): Message => ({
  id: `ai-${Date.now()}`,
  isUser: false,
  timestamp: Date.now(),
  content: "Something went wrong, please try another prompt.",
});

export const updateStorageHistory = (history: Conversation[]) => {
  chrome.storage.local.set({ history });
};

export const loadHistoryFromStorage = async () => {
  const lsHistory = await chrome.storage.local.get("history");
  if (lsHistory.history) {
    conversationHistory.set(lsHistory.history as Conversation[]);
  }
};

const addMessageToConversation = (
  message: Message,
  conversation: Conversation
) => ({
  ...conversation,
  messages: [...conversation.messages, message],
});

export const startConversation = async (
  userPrompt: string,
  context: Context,
  aiOpts: AIOptions
) => {
  const timestamp = Date.now();
  const conversation = {
    id: `conv-${timestamp}`,
    title: userPrompt.split(" ").slice(0, 4).join(" "),
    startedAt: timestamp,
    isCurrent: true,
    messages: [
      {
        id: `user-${timestamp}`,
        isUser: true,
        timestamp: timestamp,
        content: userPrompt,
        debug: {
          systemPrompt: initSystemPrompt(context.openTabs, []),
        },
      },
    ],
  };
  try {
    conversationHistory.update((prev) => [conversation, ...prev]);
    await executeAndAppendMessage(
      userPrompt,
      conversation.id,
      context,
      [],
      aiOpts
    );
  } catch (error) {
    console.error("startConversation error", error);
    conversationHistory.update((prev) => [
      addMessageToConversation(getAiErrorResponse(), conversation),
      ...prev,
    ]);
  }
};

export const continueConversation = async (
  userPrompt: string,
  context: Context,
  conversation: Conversation,
  aiOpts: AIOptions
) => {
  const timestamp = Date.now();
  try {
    conversationHistory.update((prev) => [
      addMessageToConversation(
        {
          id: `user-${timestamp}`,
          isUser: true,
          timestamp: timestamp,
          content: userPrompt,
          debug: {
            systemPrompt: initSystemPrompt(
              context.openTabs,
              conversation.messages
            ),
          },
        },
        conversation
      ),
      ...prev.filter((chat) => chat.id !== conversation.id),
    ]);
    await executeAndAppendMessage(
      userPrompt,
      conversation.id,
      context,
      conversation.messages,
      aiOpts
    );
  } catch (error) {
    console.error("continueConversation error", error);
    conversationHistory.update((prev) => [
      addMessageToConversation(getAiErrorResponse(), conversation),
      ...prev,
    ]);
  }
};

export const stopConversation = () => {
  conversationHistory.update((prev) => {
    const currentConversation = prev.find((c) => c.isCurrent);
    if (currentConversation) {
      currentConversation.isCurrent = false;
      return [
        currentConversation,
        ...prev.filter((c) => c.id !== currentConversation.id),
      ];
    }
    return prev;
  });
};

export const resumeConversation = (conversation: Conversation) => {
  conversationHistory.update((prev) => {
    conversation.isCurrent = true;
    return [conversation, ...prev.filter((c) => c.id !== conversation.id)];
  });
};

const executeAndAppendMessage = async (
  userPrompt: string,
  conversationId: string,
  context: Context,
  previousMessages: Message[] = [],
  aiOpts: AIOptions
) => {
  const timestamp = Date.now();
  try {
    const promptResult = await promptModel(
      userPrompt,
      context,
      previousMessages,
      aiOpts
    );
    conversationHistory.update((prev) => {
      const thisChat = prev.find((chat) => chat.id === conversationId);
      if (thisChat) {
        return [
          addMessageToConversation(
            {
              id: `ai-${timestamp}`,
              isUser: false,
              timestamp,
              content: parseActions(promptResult).response,
              actions: parseActions(promptResult).actions,
            },
            thisChat
          ),
          ...prev.filter((chat) => chat.id !== conversationId),
        ];
      }
      return prev;
    });
  } catch (error) {
    console.error("executeAndAppendMessage error", error);
    throw error;
  }
};
