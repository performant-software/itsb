import { Outlet, useLoaderData } from 'react-router-dom';
import { Header, ITSBStore } from './components';
import Peripleo from '@peripleo/peripleo';

/**
 *
 */
export function Root() {
  const [authors, places, itineraries] = useLoaderData();
  return (
    <Peripleo>
      <Header />
      <section id="content-wrapper">
        <ITSBStore
          authors={authors.itemListElement}
          places={places.features}
          itineraries={itineraries.first.items}
        >
          <Outlet context={{ loaded: authors && places && itineraries }} />
        </ITSBStore>
      </section>
    </Peripleo>
  );
}
