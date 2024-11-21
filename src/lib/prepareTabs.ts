// Returns summary of open tabs for the system prompt
export const prepareTabs = (openTabs: chrome.tabs.Tab[]) => {
  const tabMap = openTabs
    .filter((tab) => tab.url !== undefined && !tab.url.startsWith("chrome:"))
    .map((tab) => ({
      index: tab.index,
      id: tab.id,
      url: tab.url,
      muted: tab.mutedInfo?.muted,
      domainName: new URL(tab.url!).hostname,
    }));
  const domainMap = tabMap.reduce<Record<string, number>>((acc, cur) => {
    if (acc[cur.domainName]) {
      return { ...acc, [cur.domainName]: acc[cur.domainName] + 1 };
    }
    return { ...acc, [cur.domainName]: 1 };
  }, {});
  const domainSummary = Object.keys(domainMap).reduce((acc, cur) => {
    return `${acc}\n${cur}: ${domainMap[cur]}`;
  }, "");
  const tabSummary = JSON.stringify(tabMap, null, 2);
  return { domainSummary, tabSummary };
};
