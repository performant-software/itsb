import { ArcLayer, GeoJsonLayer } from '@peripleo/peripleo/deck.gl';

const POINT_MIN_RADIUS = 6;
const POINT_MAX_RADIUS = 22;

const toArc = (waypoints, graph) => {
  const trajectory = [];

  for (let i = 1; i < waypoints.length; i++) {
    trajectory.push({
      from: graph.getNode(waypoints[i - 1].place).geometry,
      to: graph.getNode(waypoints[i].place).geometry,
    });
  }

  return trajectory;
};

/**
 * Convenience function to get unique places across the list of
 * itineraries and the waypoints on each place. Waypoint count is
 * included in-line into the GeoJSON properties of the result set,
 * so we can use it in `getPointRadius` function later.
 *
 * The function taks into account the current author list: only waypoints
 * for the authors in the current result set are counted.
 *
 * @param {Array<object>} resultItems A list of itinerary objects (author, waypoints)
 * @param {ITSBGraph} graph The graph used to lookup place geometries
 * @returns {Array<object>} Array of unique GeoJSON Features (with waypoint count included)
 */
function getUniquePlaces(resultItems, graph) {
  const places = [];

  // Unique authors in this result set
  const authors = new Set(resultItems.map((it) => it.author));

  resultItems.forEach(({ waypoints }) => {
    waypoints.forEach((waypoint) => {
      if (!places.some((place) => place.id === waypoint.place)) {
        places.push(graph.getNode(waypoint.place));
      }
    });
  });

  // Return each place, plus the number of waypoints here,
  // using the current author list as a filter
  return places.map((place) => {
    const waypoints = graph.getWaypointsAt(place.id);

    const filteredByAuthors = waypoints.filter((wp) => authors.has(wp.author));

    return {
      ...place,
      properties: {
        ...place.properties,
        wpCount: filteredByAuthors.length,
      },
    };
  });
}

/**
 * The task of the ItineraryLayer is to take a search result,
 * and turn the itinerary trajectories into DeckGL layers.
 *
 * @returns {Array<Layer>} Array of DeckGL layers to map
 */
export const ItinerariesLayer = () => (resultItems, graph) => {
  const places = getUniquePlaces(resultItems, graph);

  // The maximum number of waypoints at any place, for scaling
  const maxWaypointCount = places.reduce((max, next) => {
    const count = next.properties.wpCount;
    return max < count ? count : max;
  }, 0);

  // Scaling factor
  const k = (POINT_MAX_RADIUS - POINT_MIN_RADIUS) / (maxWaypointCount - 1);

  return [
    new GeoJsonLayer({
      id: 'trajectories-places',
      data: places,
      pickable: true,
      filled: true,
      stroked: true,
      lineWidthUnits: 'pixels',
      getLineColor: [252, 176, 64, 220],
      getFillColor: [252, 176, 64, 180],
      getPointRadius: (d) => {
        const { wpCount } = d.properties;
        return k * (wpCount - 1) + POINT_MIN_RADIUS;
      },
      pointRadiusUnits: 'pixels',
      getLineWidth: 2,
      pointType: 'circle',
    }),
    ...resultItems.map(({ author, waypoints }) => {
      const arc = toArc(waypoints, graph);

      const { color } = graph.getNode(author);

      return new ArcLayer({
        id: `${author}/trajectory`,
        data: arc,
        pickable: false,
        getWidth: 1.5,
        widthMinPixels: 1,
        getHeight: 1,
        getTilt: 10,
        greatCircle: false,
        getSourcePosition: (d) => d.from.coordinates,
        getTargetPosition: (d) => d.to.coordinates,
        getSourceColor: color,
        getTargetColor: color,
      });
    }),
  ];
};
