import { useEffect } from 'react'
import { EventsOn } from '../wailsjs/runtime'
import { useAppStore } from './store'

const Events = () => {
    const store = useAppStore()

    useEffect(() => {
        const unbindOnExtractorFound = EventsOn('OnExtractorFound', (name: string) => {
            store.clear()
            store.setIsLoading(true)
            store.setExtractorName(name)
        })

        const unbindOnExtractorTypeFound = EventsOn('OnExtractorTypeFound', (_: string, name: string) =>
            store.setExtractorType(name)
        )

        const unbindOnMediaQueried = EventsOn('OnMediaQueried', (amount: number) => {
            store.addAmountQuery(amount)
        })

        const unbindOnQueryCompleted = EventsOn('OnQueryCompleted', (_: number) => {
            store.setIsLoading(false)
        })

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
