import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const getItemFromLocalStorage = async (key: string): Promise<any | null> => {
  let res = null;
  if (Platform.OS === "web") {
    res = localStorage.getItem(key);
  } else {
    res = await SecureStore.getItemAsync(key);
  }

  if (res) return JSON.parse(res);
  return res;
};

export const setItemInLocalStorage = async (key: string, value: any): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }
};

export const delteItemInLocalStorage = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};
