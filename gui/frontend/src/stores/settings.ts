import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand/react';

type SettingsStore = {
    deepSearch: boolean;
    ignoreCache: boolean;
    enableTelemetry: boolean;
    setDeepSearch: (deepSearch: boolean) => void;
    setIgnoreCache: (ignoreCache: boolean) => void;
    setEnableTelemetry: (enableTelemetry: boolean) => void;
};

export const useSettingsStore = create(
    persist(
        immer<SettingsStore>((set, get) => ({
            deepSearch: true,
            ignoreCache: false,
            enableTelemetry: true,

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

            setEnableTelemetry: (enableTelemetry: boolean) => {
                set((state) => {
                    state.enableTelemetry = enableTelemetry;
                });
            },
        })),
        {
            name: 'settings-storage',
        },
    ),
);
