declare global {
  interface Window {
    ai: any;
  }
}

export enum Availability {
  CHECKING = "CHECKING",
  OK = "OK",
  NO_AI = "NO_AI",
  NOT_AVAILABLE = "NOT_AVAILABLE",
  DOWNLOADING = "DOWNLOADING",
}

import { writable } from "svelte/store";

export const summarizerAvailability = writable<Availability>(
  Availability.CHECKING
);
export const promptAvailability = writable<Availability>(Availability.CHECKING);

export const checkSummarizerAvailability = async (): Promise<void> => {
  if (!window.ai) {
    return summarizerAvailability.set(Availability.NO_AI);
  }
  const canSummarize = await window.ai.summarizer.capabilities();
  if (canSummarize && canSummarize.available !== "no") {
    if (canSummarize.available === "readily") {
      await window.ai.summarizer.create();
      return summarizerAvailability.set(Availability.OK);
    } else {
      const summarizer = await window.ai.summarizer.create();
      summarizerAvailability.set(Availability.DOWNLOADING);
      await summarizer.ready;
      return summarizerAvailability.set(Availability.OK);
    }
  } else {
    return summarizerAvailability.set(Availability.NOT_AVAILABLE);
  }
};

export const checkPromptAPIAvailability = async (): Promise<void> => {
  if (!window.ai) {
    return promptAvailability.set(Availability.NO_AI);
  }
  const { available } = await window.ai.languageModel.capabilities();
  if (available !== "no") {
    if (available === "readily") {
      await window.ai.languageModel.create();
      return promptAvailability.set(Availability.OK);
    } else {
      const promptApi = await window.ai.languageModel.create();
      promptAvailability.set(Availability.DOWNLOADING);
      await promptApi.ready;
      return promptAvailability.set(Availability.OK);
    }
  } else {
    promptAvailability.set(Availability.NOT_AVAILABLE);
  }
};
