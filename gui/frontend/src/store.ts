import { model } from '../wailsjs/go/models'
import { create } from 'zustand/react'
import { immer } from 'zustand/middleware/immer'
import Media = model.Media

type AppStore = {
    isLoading: boolean
    errorMessage: string
    extractorName: string
    extractorType: string
    extractorTypeName: string
    amountQuery: number
    media: Media[]
    selectedMedia: Media[]

    clear: () => void
    setIsLoading: (loading: boolean) => void
    showError: (message: string) => void
    addAmountQuery: (amount: number) => void
    setExtractorName: (name: string) => void
    setExtractorType: (eType: string, name: string) => void

    setMedia: (media: Media[]) => void
    setSelectedMedia: (media: Media[]) => void
}

export const useAppStore = create(
    immer<AppStore>((set, get) => ({
        isLoading: false,
        errorMessage: '',
        extractorName: '',
        extractorType: '',
        extractorTypeName: '',
        amountQuery: 0,
        media: [],
        selectedMedia: [],

        clear: () => {
            set(state => {
                state.extractorName = ''
                state.extractorType = ''
                state.extractorTypeName = ''
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

        showError: (message: string) => {
            const currentTime = new Date().toISOString()
            set(state => {
                state.errorMessage = currentTime + message
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

        setExtractorType: (eType: string, name: string) => {
            set(state => {
                state.extractorType = eType
                state.extractorTypeName = name
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
