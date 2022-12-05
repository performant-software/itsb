import { Outlet, useLoaderData } from 'react-router-dom';
import { Header, ITSBStore } from './components';
import Peripleo from '@peripleo/peripleo';

/**
 * The root component of the application, defining the components that wrap (or appear
 * adjacent to) all subpage components.
 * The Outlet component will be replaced by subpage components as defined by
 * React Router routes.
 *
 * @returns {React.ReactElement} Root component of the application
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
