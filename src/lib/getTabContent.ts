import { convertHtmlToMarkdown } from "dom-to-semantic-markdown";

export const getTabContent = async (tabId: number) => {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => document.body.innerHTML.toString(),
  });
  if (result.result) {
    const md = convertHtmlToMarkdown(result.result);
    return md;
  } else {
    return "Failed to retrieve tab content.";
  }
};
