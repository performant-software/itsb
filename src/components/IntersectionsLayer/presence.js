import { eachMonthOfInterval } from 'date-fns';
import { estimateInterval } from '../ITSBStore';

/**
 * Presence is essentially a 3D array:
 * - Authors
 * - Months
 * - Places
 *
 * Or, in other words, presence is a data structure that
 * will allow you to query the likelihood that a given
 * author was present at a given place, in a given month.
 *
 * It also provides a function to query overlaps, i.e.
 * for each place the months where more than one author
 * was likely in a specific place.
 *
 * Internally, the datastructure is an object of the
 * following shape:
 *
 * {
 *   place: 'http://example.com/place/1234': {
 *     '2022-10': [{ author, likelihood }]
 *   }
 * }
 */
export class Presence {
  /**
   * Create a new Presence instance.
   *
   * @param {Array<object>} itineraries A list of itineraries (author and waypoints)
   * @param {ITSBGraph} graph The ITSB graph
   */
  constructor(itineraries, graph) {
    this.graph = graph;

    this.presence = [];

    itineraries.forEach(({ author, waypoints }) => this.addOneItinerary(author, waypoints));
  }

  /**
   * Adds one itinerary to this Presence object.
   *
   * @param {string} author the author ID
   * @param {Array<object>} waypoints the itinerary Waypoints
   */
  addOneItinerary = (author, waypoints) => {
    // Get months and likelihoods for this author
    // being in a given place
    waypoints.forEach((waypoint) => {
      const interval = estimateInterval(waypoint, this.graph);
      if (interval) {
        const months = eachMonthOfInterval(interval);
        this.addToPresence(waypoint.place, author, months, interval.likelihood);
      } else {
        console.warn('No interval for waypoint', waypoint);
      }
    });
  };

  /**
   * Adds one set of 'presence records' to this Presence object.
   *
   * @param {string} place the place ID
   * @param {string} author the author ID
   * @param {string[]} months the list months for which there is presence
   * @param {number} likelihood the likelihood for these months
   */
  addToPresence = (place, author, months, likelihood) => {
    if (!this.presence[place]) this.presence[place] = {};

    months.forEach((month) => {
      if (this.presence[place][month]) {
        this.presence[place][month].push({ author, likelihood });
      } else {
        this.presence[place][month] = [{ author, likelihood }];
      }
    });
  };
}
