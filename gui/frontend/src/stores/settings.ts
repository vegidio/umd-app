import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand/react';

type SettingsStore = {
    deepSearch: boolean;
    ignoreCache: boolean;
    setDeepSearch: (deepSearch: boolean) => void;
    setIgnoreCache: (ignoreCache: boolean) => void;
};

export const useSettingsStore = create(
    persist(
        immer<SettingsStore>((set, get) => ({
            deepSearch: true,
            ignoreCache: false,

            setDeepSearch: (deepSearch: boolean) => {
                set((state) => {
                    state.deepSearch = deepSearch;
                });
            },

            setIgnoreCache: (ignoreCache: boolean) => {
                set((state) => {
                    state.ignoreCache = ignoreCache;
                });
            },
        })),
        {
            name: 'settings-storage',
        },
    ),
);
