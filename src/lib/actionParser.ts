export type Action =
  | { type: "focusTab"; title: string; tabId: number }
  | { type: "openTabs"; title: string; urls: string[] }
  | { type: "closeTabs"; title: string; ids: number[] }
  | { type: "muteTabs"; title: string; ids: number[] }
  | { type: "unmuteTabs"; title: string; ids: number[] }
  | { type: "saveMedia"; title: string; urls: string[] }
  | { type: "compareTabs"; title: string; ids: number[] }
  | { type: "pinTabs"; title: string; ids: number[] }
  | { type: "unpinTabs"; title: string; ids: number[] }
  | { type: "discardTabs"; title: string; ids: number[] }
  | { type: "copyUrls"; title: string; urls: string[] };

const collectItems = <T>(
  lines: string[],
  startIndex: number,
  parser: (line: string) => T | null
): [T[], number] => {
  const items: T[] = [];
  let currentIndex = startIndex;

  while (
    currentIndex < lines.length &&
    !lines[currentIndex].trim().startsWith("type -")
  ) {
    const item = parser(lines[currentIndex].trim());
    if (item !== null) items.push(item);
    currentIndex++;
  }

  return [items, currentIndex];
};

const parseId = (line: string): number | null => {
  const id = parseInt(line, 10);
  return isNaN(id) ? null : id;
};

const parseUrl = (line: string): string | null => validateUrl(line);

const parseMediaUrl = (line: string): string | null => validateFileUrl(line);

function validateUrl(url: string) {
  try {
    new URL(url);
    return url;
  } catch (_) {
    return null;
  }
}

function validateFileUrl(url: string) {
  const validUrl = validateUrl(url);
  if (validUrl) {
    // Note: this is very basic check, but it's good enough for now
    const lastPathPart = url.split("/").pop();
    return lastPathPart && lastPathPart.indexOf(".") > -1 ? url : null;
  }
  return null;
}

const actionParsers = {
  focusTab: (lines: string[], currentIndex: number): Action | null => {
    const tabId = parseId(lines[currentIndex + 1]?.trim());
    return tabId ? { type: "focusTab", title: "Focus Tab", tabId } : null;
  },

  openTabs: (lines: string[], currentIndex: number): Action | null => {
    const [urls] = collectItems(lines, currentIndex + 1, parseUrl);
    return urls.length ? { type: "openTabs", title: "Open Tabs", urls } : null;
  },

  closeTabs: (lines: string[], currentIndex: number): Action | null => {
    const [ids] = collectItems(lines, currentIndex + 1, parseId);
    return ids.length ? { type: "closeTabs", title: "Close Tabs", ids } : null;
  },

  muteTabs: (lines: string[], currentIndex: number): Action | null => {
    const [ids] = collectItems(lines, currentIndex + 1, parseId);
    return ids.length ? { type: "muteTabs", title: "Mute Tabs", ids } : null;
  },

  unmuteTabs: (lines: string[], currentIndex: number): Action | null => {
    const [ids] = collectItems(lines, currentIndex + 1, parseId);
    return ids.length
      ? { type: "unmuteTabs", title: "Unmute Tabs", ids }
      : null;
  },

  saveMedia: (lines: string[], currentIndex: number): Action | null => {
    const [urls] = collectItems(lines, currentIndex + 1, parseMediaUrl);
    return urls.length
      ? { type: "saveMedia", title: "Save Media", urls }
      : null;
  },

  compareTabs: (lines: string[], currentIndex: number): Action | null => {
    const [ids] = collectItems(lines, currentIndex + 1, parseId);
    return ids.length
      ? { type: "compareTabs", title: "Compare Tabs", ids }
      : null;
  },

  pinTabs: (lines: string[], currentIndex: number): Action | null => {
    const [ids] = collectItems(lines, currentIndex + 1, parseId);
    return ids.length ? { type: "pinTabs", title: "Pin Tabs", ids } : null;
  },

  unpinTabs: (lines: string[], currentIndex: number): Action | null => {
    const [ids] = collectItems(lines, currentIndex + 1, parseId);
    return ids.length ? { type: "unpinTabs", title: "Unpin Tabs", ids } : null;
  },

  discardTabs: (lines: string[], currentIndex: number): Action | null => {
    const [ids] = collectItems(lines, currentIndex + 1, parseId);
    return ids.length
      ? { type: "discardTabs", title: "Discard Tabs", ids }
      : null;
  },

  copyUrls: (lines: string[], currentIndex: number): Action | null => {
    const [urls] = collectItems(lines, currentIndex + 1, parseUrl);
    return urls.length ? { type: "copyUrls", title: "Copy URLs", urls } : null;
  },
} as const;

/**
 * Gets as input a response from AI with possible actions to complete by the app (upon user interaction with a button).
 * The response must contain a section (generated by AI) denoted with TAB_ACTIONS text, followed by actions to perform.
 * If there are no such section present - it is assumed the response implies no possible actions and this function will return an empty array.
 *
 * --------------------------------------------------
 * Some response text for user to read.
 *
 * TAB_ACTIONS
 * type - nameOfTheActionType
 * url1
 * url2
 * url3
 *
 * type - nameOfTheActionType
 * url1
 * url2
 * --------------------------------------------------
 *
 * ***** Action Type - focusTab *****
 * Focuses an already open tab.
 * Can only be followed by 1 argument line afterwards, which is the tab id to focus.
 * If there is more than one argument following it - use the first valid one and ignore the rest
 * The following will focus the tab with id 12
 * --------------------------------------------------
 * type - focusTab
 * 12
 * --------------------------------------------------
 *
 * ***** Action Type - openTabs *****
 * Opens new tabs with provided urls.
 * Can be followed by any number of urls, one per line.
 * The following will open 2 new tabs with example.com and google.com
 * --------------------------------------------------
 * type - openTabs
 * https://example.com
 * https://google.com
 * --------------------------------------------------
 * ***** Action Type - closeTabs *****
 * Closes tabs with provided ids.
 * Can be followed by any number of ids, one per line.
 * Id in this context is a unique tab id, not index of the tab in the browser.
 * The following will close 2 tabs with id of 14 and 15
 * --------------------------------------------------
 * type - closeTabs
 * 14
 * 15
 * --------------------------------------------------
 * ***** Action Type - muteTabs *****
 * Mutes tabs with provided ids.
 * Can be followed by any number of ids, one per line.
 * Id in this context is a unique tab id, not index of the tab in the browser.
 * The following will mute 2 tabs with id of 14 and 15
 * --------------------------------------------------
 * type - muteTabs
 * 14
 * 15
 * --------------------------------------------------
 * ***** Action Type - unmuteTabs *****
 * Unmutes tabs with provided ids.
 * Can be followed by any number of ids, one per line.
 * Id in this context is a unique tab id, not index of the tab in the browser.
 * The following will unmute 2 tabs with id of 14 and 15
 * --------------------------------------------------
 * type - unmuteTabs
 * 14
 * 15
 * --------------------------------------------------
 * ***** Action Type - saveMedia *****
 * Package various media files (images, videos, etc) using client-zip and prompt user to download the archive.
 * Can be followed by any number of media urls, one per line.
 * The following package and prompt to download image.png and video.mp4
 * --------------------------------------------------
 * type - saveMedia
 * https://example.com/image.png
 * https://example.com/video.mp4
 * --------------------------------------------------
 * ***** Action Type - pinTabs *****
 * Pins tabs with provided ids.
 * Can be followed by any number of ids, one per line.
 * Id in this context is a unique tab id, not index of the tab in the browser.
 * The following will pin 2 tabs with id of 14 and 15
 * --------------------------------------------------
 * type - pinTabs
 * 14
 * 15
 * --------------------------------------------------
 *  * ***** Action Type - unpinTabs *****
 * Unpins tabs with provided ids.
 * Can be followed by any number of ids, one per line.
 * Id in this context is a unique tab id, not index of the tab in the browser.
 * The following will unpin 2 tabs with id of 14 and 15
 * --------------------------------------------------
 * type - unpinTabs
 * 14
 * 15
 * --------------------------------------------------
 * ***** Action Type - discardTabs *****
 * Discards tabs with provided ids.
 * Can be followed by any number of ids, one per line.
 * Id in this context is a unique tab id, not index of the tab in the browser.
 * The following will discard 2 tabs with id of 14 and 15
 * --------------------------------------------------
 * type - discardTabs
 * 14
 * 15
 * --------------------------------------------------
 * ***** Action Type - copyUrls *****
 * Copy provided urls into clipboard.
 * Can be followed by any number of urls, one per line.
 * The following will copy 2 urls into clipboard: example.com and google.com
 * --------------------------------------------------
 * type - copyUrls
 * https://example.com
 * https://google.com
 * --------------------------------------------------
 */
export const parseActions = (
  response: string
): { response: string; actions: Action[] } => {
  if (!response.includes("TAB_ACTIONS")) return { response, actions: [] };

  const lines = response.split("\n");
  const startIndex = lines.findIndex((line) => line.trim() === "TAB_ACTIONS");
  if (startIndex === -1) return { response, actions: [] };

  const actions: Action[] = [];
  let currentIndex = startIndex + 1;

  while (currentIndex < lines.length) {
    const line = lines[currentIndex].trim();

    if (line.startsWith("type - ")) {
      const actionType = line.substring(7).trim() as keyof typeof actionParsers;
      const parser = actionParsers[actionType];

      if (parser) {
        const action = parser(lines, currentIndex);
        if (action) actions.push(action);
        currentIndex = collectItems(lines, currentIndex + 1, () => null)[1];
      } else {
        currentIndex++;
      }
    } else {
      currentIndex++;
    }
  }

  const textBeforeActions = lines.slice(0, startIndex).join("\n").trim();
  return {
    response: textBeforeActions,
    actions,
  };
};
