import { useEffect } from 'react'
import { EventsOn } from '../wailsjs/runtime'
import { useAppStore } from './store'

const Events = () => {
    const store = useAppStore()

    useEffect(() => {
        const unbindOnExtractorFound = EventsOn('OnExtractorFound', (name: string) => store.setExtractorName(name))

        const unbindOnExtractorTypeFound = EventsOn('OnExtractorTypeFound', (eType: string, _: string) =>
            store.setExtractorType(eType)
        )

        const unbindOnMediaQueried = EventsOn('OnMediaQueried', (amount: number) => {})

        const unbindOnQueryCompleted = EventsOn('OnQueryCompleted', (total: number) => {})

        return () => {
            unbindOnExtractorFound()
            unbindOnExtractorTypeFound()
            unbindOnMediaQueried()
            unbindOnQueryCompleted()
        }
    })

    return <></>
}

export default Events
