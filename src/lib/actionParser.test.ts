import { expect, test } from "vitest";
import { parseActions } from "./actionParser.js";

test("parses actions properly", () => {
  const testResponse = `
  Some response text for user to read.
  
  TAB_ACTIONS
  type - focusTab
  12
  
  type - openTabs
  https://example.com
  https://google.com
  
  type - closeTabs
  14
  15

  type - muteTabs
  18
  8
  type - saveMedia
  https://example.com/image.png
  https://example.com/video.mp4

  type - unknownActionType
  55
  http://example.com
  
  type - compareTabs
  33
  22
  66
  
  type - unmuteTabs
  44
  55
  
  type - pinTabs
  77
  88
  
  type - discardTabs
  775
  838
  
  type - copyUrls
  https://example.com
  https://github.com`;
  const expectedActions = [
    { type: "focusTab", title: "Focus Tab", tabId: 12 },
    {
      type: "openTabs",
      title: "Open Tabs",
      urls: ["https://example.com", "https://google.com"],
    },
    {
      type: "closeTabs",
      title: "Close Tabs",
      ids: [14, 15],
    },
    {
      type: "muteTabs",
      title: "Mute Tabs",
      ids: [18, 8],
    },
    {
      type: "saveMedia",
      title: "Save Media",
      urls: ["https://example.com/image.png", "https://example.com/video.mp4"],
    },
    {
      type: "compareTabs",
      title: "Compare Tabs",
      ids: [33, 22, 66],
    },
    {
      type: "unmuteTabs",
      title: "Unmute Tabs",
      ids: [44, 55],
    },
    {
      type: "pinTabs",
      title: "Pin Tabs", 
      ids: [77, 88],
    },
    {
      type: "discardTabs",
      title: "Discard Tabs", 
      ids: [775, 838],
    },
    {
      type: "copyUrls",
      title: "Copy URLs", 
      urls: ["https://example.com", "https://github.com"],
    },
  ];
  expect(parseActions(testResponse).actions).toStrictEqual(expectedActions);
});

test("returns empty array if there are no actions", () => {
  const testResponse = `
    Some response text for user to read.
    There are no actions to do.`;
  expect(parseActions(testResponse).actions).toStrictEqual([]);
});
