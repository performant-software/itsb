import { useState } from 'react';
import { Map, Controls, ZoomControl } from '@peripleo/peripleo';
import {
  AuthorSelect,
  ITSBTooltip,
  ItinerariesLayer,
  IntersectionDetails,
  IntersectionsLayer,
  MonthRangeInput,
} from '../../components';
import { useMatch, useOutletContext } from 'react-router-dom';
import './MapPage.css';

/**
 *
 */
export function MapPage() {
  const { loaded } = useOutletContext();

  const [selectedIntersection, setSelectedIntersection] = useState();

  const isTrajectories = useMatch('trajectories');

  const onSelectIntersection = (place) => setSelectedIntersection(place);

  const layer = isTrajectories
    ? ItinerariesLayer()
    : IntersectionsLayer({ onSelect: onSelectIntersection });

  return (
    loaded && (
      <>
        <aside id="map-control">
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

        {!isTrajectories && (
          <aside id="intersection-details">
            <IntersectionDetails at={selectedIntersection} />
          </aside>
        )}
      </>
    )
  );
}
