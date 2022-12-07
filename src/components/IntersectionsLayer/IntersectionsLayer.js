import { ScatterplotLayer } from '@peripleo/peripleo/deck.gl';
import { scaleLinear } from 'd3-scale';
import { Presence } from './presence';

export const intersectionsScale = scaleLinear().domain([0, 10]).range([6, 36]);

/**
 * Convert a Presence object into a list of intersections: places (with more than
 * one presence) and their associated author presences and likelihoods.
 *
 * @param {Presence} p A Presence object
 * @param {ITSBGraph} graph The ITSB graph
 * @returns {Array<object>} An array of intersections
 */
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

/**
 * Get the number of people present at a given level of certainty (likelihood).
 *
 * @param {object} place A place object
 * @param {number} likelihood Certainty score from 1 to 3
 * @returns {number} Number of people present at that certainty level
 */
const countPresent = (place, likelihood) => {
  let count = 0;

  Object.values(place.present).forEach((likelihoods) => {
    if (likelihoods.has(likelihood)) count++;
  });

  return count;
};

/**
 * Renders three Deck.GL Scatterplot layers, one for each level of certainty, based on
 * presences of authors in the same place in the same timespan.
 *
 * @param {object} props destructured props parameter
 * @param {object} props.selected the currently selected place (GeoJSON)
 * @returns {Function} A curried function returning Deck.GL scatterplot layers
 */
export const IntersectionsLayer =
  ({ selected }) =>
  (itineraries, graph) => {
    const presence = new Presence(itineraries, graph);

    const data = toMapData(presence, graph);

    // three layers, one for each likelihood, starting with outermost (least likely)
    return [1, 2, 3].map(
      (idx) =>
        new ScatterplotLayer({
          id: `scatterplot-${idx}`,
          data,
          pickable: true,
          opacity: 0.8,
          stroked: true,
          filled: true,
          radiusUnits: 'pixels',
          lineWidthUnits: 'pixels',

          // eslint-disable-next-line jsdoc/require-jsdoc
          getPosition: (d) => d.geometry.coordinates,

          /**
           * Get the radius for a point on the map based on number of presences
           * for this likelihood. The smallest circle will be the most likely,
           * and outer rings are wider for increasingly unlikely presences.
           *
           * @param {object} d A place in the list of intersections
           * @returns {number} The radius of the circle
           */
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

            return intersectionsScale(count);
          },

          /**
           * Get the fill color for a point on the map based on number of presences
           * for this likelihood. The most likely points will be the most opaque,
           * and outer rings are more transparent for increasingly unlikely presences.
           *
           * @param {object} g A place on the intersections map
           * @returns {Array<number>} An array of 4 numbers in the format [r,g,b,a] with values
           * from 0 to 255 for each
           */
          getFillColor: (g) => {
            // lower opacity for lower likelihood
            let opacity = 255;

            if (idx == 2) {
              opacity = 0.5 * 255;
            } else if (idx == 1) {
              opacity = 0.25 * 255;
            }

            // blue for selected, orange for not selected
            return selected?.id === g.id ? [65, 105, 225, opacity] : [252, 176, 64, opacity];
          },

          /**
           * Get the outline color for a point on the map: blue if selected, orange if
           * not selected.
           *
           * @param {object} g A place on the intersections map
           * @returns {Array<number>} An array of 4 numbers in the format [r,g,b,a] with values
           * from 0 to 255 for each
           */
          getLineColor: (g) => (selected?.id === g.id ? [0, 0, 0, 144] : [200, 100, 0, 144]),
        })
    );
  };
