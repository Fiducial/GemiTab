import { writable } from "svelte/store";

export type Context = {
  openTabs: chrome.tabs.Tab[];
};

export const context = writable<Context>({ openTabs: [] });

export const reloadContext = async () => {
  const tabs = await chrome.tabs.query({});
  context.update((prev) => ({ openTabs: tabs }));
};
