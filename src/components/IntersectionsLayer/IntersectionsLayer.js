import { ScatterplotLayer } from '@peripleo/peripleo/deck.gl';
import { scaleLinear } from 'd3-scale';
import { Presence } from './presence';

export const intersectionsScale = scaleLinear().domain([0, 10]).range([0, 36]);

const toMapData = (p, graph) => {
  const { presence } = p;

  const data = Object.entries(presence).map(([placeId, calendar]) => {
    const place = graph.getNode(placeId);

    const intersections = Object.entries(calendar).filter(([_month, present]) => {
      if (present.length < 2) return false; // Only one presence

      const presentAuthors = new Set(present.map((p) => p.author));

      // Multiple presences, but only one author?
      return presentAuthors.size > 1;
    });

    const groupedByAuthor = {};

    if (intersections.length > 0) {
      intersections.forEach(([, presence]) => {
        presence.forEach(({ author, likelihood }) => {
          if (groupedByAuthor[author]) {
            groupedByAuthor[author].add(likelihood);
          }
          groupedByAuthor[author] = new Set([likelihood]);
        });
      });
    }

    return { ...place, present: groupedByAuthor };
  });

  return data.filter((p) => Object.keys(p.present).length > 0);
};

const countPresent = (place, likelihood) => {
  let count = 0;

  Object.values(place.present).forEach((likelihoods) => {
    if (likelihoods.has(likelihood)) count++;
  });

  return count;
};

export const IntersectionsLayer = (config) => (itineraries, graph) => {
  const presence = new Presence(itineraries, graph);

  const data = toMapData(presence, graph);

  // three layers, one for each likelihood, starting with outermost (least likely)
  return [1, 2, 3].map(
    (idx) =>
      new ScatterplotLayer({
        id: `scatterplot-${idx}`,
        data,
        pickable: true,
        onClick: ({ object }) => config.onSelect(object),
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 4,
        radiusMaxPixels: 2000,
        lineWidthMinPixels: 1,
        getPosition: (d) => d.geometry.coordinates,
        getRadius: (d) => {
          // center circle = likelihood of 3
          let count = countPresent(d, 3);

          if (idx < 3) {
            // middle circle += likelihood of 2
            count += countPresent(d, 2);
          }

          if (idx === 1) {
            // outermost circle += likelihood of 1
            count += countPresent(d, 1);
          }

          const radius = 1000;
          return intersectionsScale(count) * radius;
        },

        getFillColor: () => {
          // lower opacity for lower likelihood
          let opacity = 255;

          if (idx == 2) {
            opacity = 0.5 * 255;
          } else if (idx == 1) {
            opacity = 0.25 * 255;
          }

          return [252, 176, 64, opacity];
        },

        getLineColor: () => [200, 100, 0, 144],
      })
  );
};
