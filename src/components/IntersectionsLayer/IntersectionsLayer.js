import { ScatterplotLayer } from '@peripleo/peripleo/deck.gl';
import { scaleLinear } from 'd3-scale';
import { getPlacesAndCounts } from './intersections';

export const intersectionsScale = scaleLinear().domain([0, 10]).range([0, 36]);

export const IntersectionsLayer = (intersections, graph) => {

  const intersectionsForViz = getPlacesAndCounts({
    intersections,
    places: placesFiltered,
  });

  // three layers, one for each likelihood, starting with outermost (least likely)
  return [1, 2, 3].map(idx => {

    const data = Object.values(intersectionsForViz)
      .filter((place) => Object.keys(place.figures).length > 1)
      .sort((place) => Object.keys(place.figures).length);
      
    return new ScatterplotLayer({
      id: `scatterplot-${idx}`,
      data,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 4,
      radiusMaxPixels: 2000,
      lineWidthMinPixels: 1,
      getPosition: d => d?.geometry?.coordinates,
      getRadius: d => {
          // center circle = likelihood of 3
          let count = d.lists[3];
          if (idx < 3) {
              // middle circle += likelihood of 2
              count += d.lists[2];
          }
          if (idx === 1) {
              // outermost circle += likelihood of 1
              count += d.lists[1];
          }
          let radius = 1000;

          return intersectionsScale(count) * radius;
      },

      getFillColor: d => {
          // lower opacity for lower likelihood
          let opacity = 255;
          if (idx == 2) {
              opacity = 0.5 * 255;
          } else if (idx == 1) {
              opacity = 0.25 * 255;
          }
          return [252, 176, 64, opacity];
      },

      getLineColor: d => [200, 100, 0, 144],
    });
  });

}