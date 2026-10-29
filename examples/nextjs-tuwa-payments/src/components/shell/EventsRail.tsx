'use client';

import { BoltIcon } from '@heroicons/react/24/outline';

import { EventFeed, ListeningLine } from '@/components/events/EventFeed';
import { useShop } from '@/components/shell/ShopProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';

/** The live events beside the page from 1280 px: sticky under the header, scrolling inside. */
export function EventsRail() {
  return (
    <aside
      aria-labelledby="rail-title"
      className="sticky top-[80px] hidden max-h-[calc(100dvh-96px)] min-h-0 flex-col overflow-hidden rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] shadow-sm xl:flex"
    >
      <div className="flex flex-col gap-1.5 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-2">
          <h2 id="rail-title" className="m-0 flex items-center gap-2 text-[15px] font-bold tracking-tight">
            <BoltIcon className="h-4 w-4" aria-hidden />
            Live events
          </h2>
          <ButtonLink href="/events" variant="ghost" size="sm" className="-mr-2">
            All events
          </ButtonLink>
        </div>
        <ListeningLine />
      </div>
      <EventFeed className="min-h-0 flex-1" />
    </aside>
  );
}

/** The live events below 1280 px: a drawer from the right, a sheet from the bottom on phones. */
export function EventsDrawer() {
  const { eventsOpen, setEventsOpen } = useShop();
  return (
    <Drawer open={eventsOpen} onOpenChange={setEventsOpen} title="Live events" description={<ListeningLine />}>
      <div className="pt-3">
        <EventFeed />
      </div>
    </Drawer>
  );
}
