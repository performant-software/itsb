import { useMemo } from 'react';
import Peripleo, { Map, Controls, ZoomControl } from '@peripleo/peripleo';
import {
  AuthorSelect,
  ITSBStore,
  ITSBTooltip,
  ItinerariesLayer,
  IntersectionsLayer,
  MonthRangeInput,
} from '../../components';
import { useLoaderData, useMatch } from 'react-router-dom';
import './MapPage.css';

const fetchData = (url) => fetch(url).then((res) => res.json());

export const mapLoader = async () =>
  await Promise.all([
    fetchData('data/authors.json'),
    fetchData('data/places.json'),
    fetchData('data/itineraries.json'),
  ]);

export function MapPage() {
  const [authors, places, itineraries] = useLoaderData();

  const loaded = authors && places && itineraries;

  const isTrajectories = useMatch('trajectories');

  const layer = useMemo(
    () => (isTrajectories ? ItinerariesLayer : IntersectionsLayer),
    [isTrajectories]
  );

  return (
    <Peripleo>
      {loaded && (
        <ITSBStore
          authors={authors.itemListElement}
          places={places.features}
          itineraries={itineraries.first.items}
        >
          <aside>
            <MonthRangeInput />
            <AuthorSelect />
          </aside>

          <main id="map">
            <Map.MapLibreDeckGL
              mapStyle="https://api.maptiler.com/maps/outdoor/style.json?key=cqqmcLw28krG9Fl7V3kg"
              defaultBounds={[
                [-15.764914, 33.847608],
                [35.240991, 58.156214],
              ]}
              layers={[layer]}
              tooltip={ITSBTooltip}
            />

            <Controls>
              <ZoomControl />
            </Controls>
          </main>
        </ITSBStore>
      )}
    </Peripleo>
  );
}
