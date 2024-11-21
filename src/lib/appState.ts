import { writable } from "svelte/store";

type AppScreens = "splash" | "chat" | "settings";

type AppState = {
  showSplash: boolean;
  currentScreen: AppScreens;
  temperature: number;
  topk: number;
};

export const appState = writable<AppState>({
  showSplash: true,
  currentScreen: "splash",
  temperature: 0,
  topk: 3,
});

const initAppState = async () => {
  const lsShowSplash = await chrome.storage.local.get("showSplash");
  appState.update((prev) => ({
    ...prev,
    showSplash: lsShowSplash["showSplash"] ?? true,
    currentScreen: "chat",
  }));
};

initAppState();

export const disableSplashScreen = () => {
  appState.update((prev) => ({
    ...prev,
    showSplash: false,
    currentScreen: "chat",
  }));
  chrome.storage.local.set({ showSplash: false });
};

export const routeTo = (screen: AppScreens) => {
  appState.update((prev) => ({
    ...prev,
    currentScreen: screen,
  }));
};

export const setTemperature = (temperature: number) => {
  appState.update((prev) => ({ ...prev, temperature }));
};

export const setTopK = (topk: number) => {
  appState.update((prev) => ({ ...prev, topk }));
};
