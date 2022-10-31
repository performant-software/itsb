import { ArcLayer, GeoJsonLayer } from '@peripleo/peripleo/deck.gl';

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
 * Convenience function to get unique places across the list of itineraries.
 *
 * @param {Array<object>} resultItems A list of itinerary objects (author, waypoints)
 * @param {ITSBGraph} graph The graph used to lookup place geometries
 * @returns {Array<object>} Array of unique GeoJSON Features
 */
function getUniquePlaces(resultItems, graph) {
  const places = [];

  resultItems.forEach(({ waypoints }) => {
    waypoints.forEach((waypoint) => {
      if (!places.some((place) => place.id === waypoint.place)) {
        places.push(graph.getNode(waypoint.place));
      }
    });
  });

  return places;
}

/**
 * The task of the ItineraryLayer is to take a search result,
 * and turn the itinerary trajectories into DeckGL layers.
 *
 * @returns {Array<Layer>} Array of DeckGL layers to map
 */
export const ItinerariesLayer = (resultItems, graph) => {
  return [
    new GeoJsonLayer({
      id: 'trajectories-places',
      data: getUniquePlaces(resultItems, graph),
      pickable: true,
      filled: true,
      stroked: true,
      lineWidthScale: 10,
      lineWidthMinPixels: 2,
      getLineColor: [252, 176, 64, 200],
      getFillColor: [252, 176, 64, 100],
      getPointRadius: 10000,
      pointRadiusMinPixels: 6,
      getLineWidth: 10,
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
