import { useEffect } from 'react'
import { EventsOn } from '../wailsjs/runtime'
import { main } from '../wailsjs/go/models'
import { useAppStore } from './store'
import Download = main.Download

const Events = () => {
    const store = useAppStore()

    useEffect(() => {
        const unbindOnExtractorFound = EventsOn('OnExtractorFound', (name: string) => {
            store.clear()
            store.setExtractorName(name)
        })

        const unbindOnExtractorTypeFound = EventsOn('OnExtractorTypeFound', (eType: string, name: string) =>
            store.setExtractorType(eType, name)
        )

        const unbindOnMediaQueried = EventsOn('OnMediaQueried', (amount: number) => {
            store.addAmountQuery(amount)
        })

        const unbindOnQueryCompleted = EventsOn('OnQueryCompleted', (_: number) => {
            // Empty
        })

        const unbindOnMediaDownloaded = EventsOn('OnMediaDownloaded', (download: Download) => {
            store.addDownloadList(download)
        })

        return () => {
            unbindOnExtractorFound()
            unbindOnExtractorTypeFound()
            unbindOnMediaQueried()
            unbindOnQueryCompleted()
            unbindOnMediaDownloaded()
        }
    })

    return <></>
}

export default Events
