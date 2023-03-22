import { useState } from 'react';
import { Map, Controls, ZoomControl } from '@peripleo/peripleo';
import {
  AuthorSelect,
  ITSBTooltip,
  ItinerariesLayer,
  IntersectionDetails,
  IntersectionsLayer,
  IntersectionsLegend,
  MonthRangeInput,
} from '../../components';
import { useMatch, useOutletContext } from 'react-router-dom';
import './MapPage.css';

/**
 * The page component for the map visualizations.
 *
 * @returns {React.ReactElement} React map functional component
 */
export function MapPage() {
  const { loaded } = useOutletContext();

  // if there is no entry in localStorage, show legend by default; otherwise hide
  const storedHidden = localStorage.getItem('itsb-legend');
  const [legendVisible, setLegendVisible] = useState(!storedHidden);
  /**
   * Set the react state to show or hide the legend. In addition, if there is
   * no entry in localStorage for the legend, create one.
   */
  const toggleLegend = () => {
    setLegendVisible((prev) => !prev);
    if (!storedHidden) {
      localStorage.setItem('itsb-legend', 'hidden');
    }
  };

  const [selectedIntersection, setSelectedIntersection] = useState();
  const isTrajectories = useMatch('trajectories');
  const layer = isTrajectories
    ? ItinerariesLayer()
    : IntersectionsLayer({ selected: selectedIntersection });

  /**
   * Event handler for clicking a city on the map
   *
   * @param {object} props destructured props parameter
   * @param {object} props.object The clicked city on the map
   * @returns {void}
   */
  const onClick = ({ object }) => setSelectedIntersection(object);

  return (
    loaded && (
      <>
        <aside id="map-control">
          <MonthRangeInput />
          <AuthorSelect />
        </aside>

        <main id="map">
          <Map.MapLibreDeckGL
            key={isTrajectories ? 'trajectories' : 'intersections'}
            mapStyle="https://api.maptiler.com/maps/streets-v2-light/style.json?key=ivsJw9naVbzcCpzJQ7HN"
            defaultBounds={[
              // [[minLon, minLat], [maxLon, maxLat]
              [-142, -52],
              [178, 72],
            ]}
            layers={[layer]}
            tooltip={ITSBTooltip}
            onClick={isTrajectories ? null : onClick}
          />

          <Controls>
            <ZoomControl />
          </Controls>
        </main>

        {!isTrajectories && (
          <>
            <aside id="intersection-details">
              <IntersectionDetails at={selectedIntersection} />
            </aside>
            <IntersectionsLegend onClick={toggleLegend} visible={legendVisible} />
          </>
        )}
      </>
    )
  );
}
