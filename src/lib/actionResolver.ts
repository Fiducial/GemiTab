import { downloadZip } from "client-zip";
import { Action } from "./actionParser";

export const resolveAction = async (action: Action) => {
  switch (action.type) {
    case "focusTab":
      chrome.tabs.highlight({ tabs: action.tabId });
      break;
    case "openTabs":
      action.urls.forEach((url) => {
        chrome.tabs.create({ url });
      });
      break;
    case "closeTabs":
      action.ids.forEach((id) => {
        chrome.tabs.remove(id);
      });
      break;
    case "muteTabs":
      action.ids.forEach((id) => {
        chrome.tabs.update(id, { muted: true });
      });
      break;
    case "unmuteTabs":
      action.ids.forEach((id) => {
        chrome.tabs.update(id, { muted: false });
      });
      break;
    case "copyUrls":
      navigator.clipboard.writeText(action.urls.join("\n"));
      break;
    case "pinTabs":
      action.ids.forEach((id) => {
        chrome.tabs.update(id, { pinned: true });
      });
      break;
    case "unpinTabs":
      action.ids.forEach((id) => {
        chrome.tabs.update(id, { pinned: false });
      });
      break;
    case "discardTabs":
      action.ids.forEach((id) => {
        chrome.tabs.discard(id);
      });
      break;
    case "saveMedia":
      // TODO: Implement
      // Due to Gemini Nano not being able to parse page content yet, this feature is parked for later.
      // The current code is a stub to test downloading functionality
      const blob = await downloadZip([
        {
          name: "test1.txt",
          lastModified: new Date(),
          input: "0".repeat(1024 * 1024 * 26.24),
        },
        {
          name: "test2.txt",
          lastModified: new Date(),
          input: "0".repeat(1024 * 1024 * 26.24),
        },
      ]).blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "GreekMythologyImages.zip";
      link.click();
      link.remove();
      break;
    case "compareTabs":
      // TODO: Implement
      // Due to Gemini Nano not being able to parse page content yet, this feature is parked for later
      break;
    default:
      break;
  }
};
