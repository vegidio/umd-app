import { useEffect } from 'react';
import { fetch } from '../wailsjs/go/models';
import { EventsOn } from '../wailsjs/runtime';
import { useAppStore } from './stores/app';
import Response = fetch.Response;

const Events = () => {
    const store = useAppStore();

    useEffect(() => {
        const unbindOnExtractorFound = EventsOn('OnExtractorFound', (name: string) => {
            store.clear();
            store.setExtractorName(name);
        });

        const unbindOnExtractorTypeFound = EventsOn('OnExtractorTypeFound', (eType: string, name: string) =>
            store.setExtractorType(eType, name),
        );

        const unbindOnMediaQueried = EventsOn('OnMediaQueried', (amount: number) => {
            store.setAmountQuery(amount);
        });

        const unbindOnQueryCompleted = EventsOn('OnQueryCompleted', (_: number, isCached: boolean) => {
            store.setIsCached(isCached);
        });

        const unbindOnMediaDownloaded = EventsOn('OnMediaDownloaded', (amount: number, responses: Response[]) => {
            store.setDownloadedMedia(amount);
            store.setCurrentDownloads(responses);
        });

        return () => {
            unbindOnExtractorFound();
            unbindOnExtractorTypeFound();
            unbindOnMediaQueried();
            unbindOnQueryCompleted();
            unbindOnMediaDownloaded();
        };
    });

    return <></>;
};

export default Events;
