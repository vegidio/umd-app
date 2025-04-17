import { useEffect } from 'react';
import { shared } from '../wailsjs/go/models';
import { EventsOn } from '../wailsjs/runtime';
import Download = shared.Download;
import { useAppStore } from './stores/app';

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
            store.addAmountQuery(amount);
        });

        const unbindOnQueryCompleted = EventsOn('OnQueryCompleted', (_: number, isCached: boolean) => {
            store.setIsCached(isCached);
        });

        const unbindOnMediaDownloaded = EventsOn('OnMediaDownloaded', (download: Download) => {
            store.addDownloadList(download);
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
