import { Outlet, useLoaderData } from 'react-router-dom';
import { Header, ITSBStore } from './components';
import Peripleo from '@peripleo/peripleo';

export function Root() {
  const [authors, places, itineraries] = useLoaderData();
  return (
    <>
      <Header />
      <Peripleo>
        <ITSBStore
          authors={authors.itemListElement}
          places={places.features}
          itineraries={itineraries.first.items}
        >
          <Outlet />
        </ITSBStore>
      </Peripleo>
    </>
  );
}
