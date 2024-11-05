import { model } from '../wailsjs/go/models'
import { create } from 'zustand/react'
import { immer } from 'zustand/middleware/immer'
import Media = model.Media

type AppStore = {
    isLoading: boolean
    extractorName: string
    extractorType: string
    amountQuery: number
    media: Media[]
    selectedMedia: Media[]

    clear: () => void
    setIsLoading: (loading: boolean) => void
    addAmountQuery: (amount: number) => void
    setExtractorName: (name: string) => void
    setExtractorType: (eType: string) => void

    setMedia: (media: Media[]) => void
    setSelectedMedia: (media: Media[]) => void
}

export const useAppStore = create(
    immer<AppStore>((set, get) => ({
        isLoading: false,
        extractorName: '',
        extractorType: '',
        amountQuery: 0,
        media: [],
        selectedMedia: [],

        clear: () => {
            set(state => {
                state.extractorName = ''
                state.extractorType = ''
                state.amountQuery = 0
                state.media = []
                state.selectedMedia = []
            })
        },

        setIsLoading: (loading: boolean) => {
            set(state => {
                state.isLoading = loading
            })
        },

        addAmountQuery: (amount: number) => {
            set(state => {
                state.amountQuery = get().amountQuery + amount
            })
        },

        setExtractorName: (name: string) => {
            set(state => {
                state.extractorName = name
            })
        },

        setExtractorType: (eType: string) => {
            set(state => {
                state.extractorType = eType
            })
        },

        setMedia: (media: Media[]) => {
            set(state => {
                state.media = media
            })
        },

        setSelectedMedia: (media: Media[]) => {
            set(state => {
                state.selectedMedia = media
            })
        }
    }))
)
