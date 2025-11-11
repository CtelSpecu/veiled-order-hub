const memoryStore = new Map<string, string | null>();

const AsyncStorage = {
  async getItem(key: string) {
    return memoryStore.has(key) ? memoryStore.get(key)! : null;
  },
  async setItem(key: string, value: string) {
    memoryStore.set(key, value);
  },
  async removeItem(key: string) {
    memoryStore.delete(key);
  },
  async clear() {
    memoryStore.clear();
  },
  async getAllKeys() {
    return Array.from(memoryStore.keys());
  },
  async multiGet(keys: string[]) {
    return keys.map((key) => [key, memoryStore.get(key) ?? null] as const);
  },
  async multiSet(entries: readonly [string, string][]) {
    entries.forEach(([key, value]) => memoryStore.set(key, value));
  },
  async multiRemove(keys: string[]) {
    keys.forEach((key) => memoryStore.delete(key));
  },
};

export default AsyncStorage;
export const {
  getItem,
  setItem,
  removeItem,
  clear,
  getAllKeys,
  multiGet,
  multiSet,
  multiRemove,
} = AsyncStorage;
