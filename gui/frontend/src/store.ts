import { model } from '../wailsjs/go/models'
import { create } from 'zustand/react'
import { immer } from 'zustand/middleware/immer'
import Media = model.Media

type AppStore = {
    extractorName: string
    extractorType: string
    media: Media[]

    setExtractorName: (name: string) => void
    setExtractorType: (eType: string) => void
    setMedia: (media: Media[]) => void
}

export const useAppStore = create(
    immer<AppStore>((set, get) => ({
        extractorName: '',
        extractorType: '',
        media: [],

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
        }
    }))
)
