import { main, model } from '../wailsjs/go/models'
import { create } from 'zustand/react'
import { immer } from 'zustand/middleware/immer'
import Media = model.Media
import Download = main.Download

type AppStore = {
    isLoading: boolean
    message: string
    messageSeverity: 'error' | 'warning' | 'info' | 'success'
    extractorName: string
    extractorType: string
    extractorTypeName: string
    amountQuery: number
    directory: string
    media: Media[]
    selectedMedia: Media[]
    downloadedMedia: Download[]

    clear: () => void
    setIsLoading: (loading: boolean) => void
    showMessage: (message: string, severity: 'error' | 'warning' | 'info' | 'success') => void
    addAmountQuery: (amount: number) => void
    setExtractorName: (name: string) => void
    setExtractorType: (eType: string, name: string) => void
    setDirectory: (directory: string) => void
    setMedia: (media: Media[]) => void
    setSelectedMedia: (media: Media[]) => void
    clearDownloads: () => void
    addDownloadList: (download: Download) => void
}

export const useAppStore = create(
    immer<AppStore>((set, get) => ({
        isLoading: false,
        message: '',
        messageSeverity: 'success',
        extractorName: '',
        extractorType: '',
        extractorTypeName: '',
        amountQuery: 0,
        directory: '/Users/vegidio/Desktop',
        media: [],
        selectedMedia: [],
        downloadedMedia: [],

        clear: () => {
            set(state => {
                state.extractorName = ''
                state.extractorType = ''
                state.extractorTypeName = ''
                state.amountQuery = 0
                state.media = []
                state.selectedMedia = []
                state.downloadedMedia = []
            })
        },

        setIsLoading: (loading: boolean) => {
            set(state => {
                state.isLoading = loading
            })
        },

        showMessage: (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
            const currentTime = new Date().toISOString()
            set(state => {
                state.message = currentTime + message
                state.messageSeverity = severity
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
            set(state => {
                state.directory = directory
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
