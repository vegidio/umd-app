import { immer } from 'zustand/middleware/immer'
import { create } from 'zustand/react'
import { model, shared } from '../wailsjs/go/models'
import Media = model.Media
import Download = shared.Download

type AppStore = {
    isQuerying: boolean
    isDownloading: boolean
    extractorName: string
    extractorType: string
    extractorTypeName: string
    amountQuery: number
    directory: string
    progress: number
    media: Media[]
    selectedMedia: Media[]
    downloadedMedia: Download[]

    clear: () => void
    setIsQuerying: (querying: boolean) => void
    setIsDownloading: (downloading: boolean) => void
    addAmountQuery: (amount: number) => void
    setExtractorName: (name: string) => void
    setExtractorType: (eType: string, name: string) => void
    setDirectory: (directory: string) => void
    setProgress: (percent: number) => void
    setMedia: (media: Media[]) => void
    setSelectedMedia: (media: Media[]) => void
    clearDownloads: () => void
    addDownloadList: (download: Download) => void
}

export const useAppStore = create(
    immer<AppStore>((set, get) => ({
        isQuerying: false,
        isDownloading: false,
        extractorName: '',
        extractorType: '',
        extractorTypeName: '',
        amountQuery: 0,
        directory: '.',
        progress: 0,
        media: [],
        selectedMedia: [],
        downloadedMedia: [],

        clear: () => {
            set(state => {
                state.extractorName = ''
                state.extractorType = ''
                state.extractorTypeName = ''
                state.amountQuery = 0
                state.progress = 0
                state.media = []
                state.selectedMedia = []
                state.downloadedMedia = []
            })
        },

        setIsQuerying: (querying: boolean) => {
            set(state => {
                state.isQuerying = querying
            })
        },

        setIsDownloading: (downloading: boolean) => {
            set(state => {
                state.isDownloading = downloading
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

        setDirectory: (directory: string) => {
            localStorage.setItem('lastDirectory', directory)

            set(state => {
                state.directory = directory
            })
        },

        setProgress: (percent: number) => {
            set(state => {
                state.progress = percent
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
        },

        clearDownloads: () => {
            set(state => {
                state.downloadedMedia = []
            })
        },

        addDownloadList: (download: Download) => {
            set(state => {
                state.downloadedMedia.push(download)
            })
        }
    }))
)
