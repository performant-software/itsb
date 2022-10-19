import { eachMonthOfInterval } from 'date-fns';
import { getTimeInterval } from './timeinterval';

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

  constructor(itineraries, graph) {
    this.graph = graph;

    this.presence = [];

    itineraries.forEach(({ author, waypoints }) =>
      this.addOneItinerary(author, waypoints));
  }

  addOneItinerary = (author, waypoints) => {
    // Get months and likelihoods for this author
    // being in a given place
    waypoints.forEach(waypoint => {
      const interval = getTimeInterval(waypoint, this.graph);
      if (interval) {
        const months = eachMonthOfInterval(interval);
        this.addToPresence(waypoint.place, author, months, interval.likelihood);
      } else {
        console.warn('No interval for waypoint', waypoint);
      }
    });
  }

  addToPresence = (place, author, months, likelihood) => {
    if(!this.presence[place])
      this.presence[place] = {};

    months.forEach(month => {
      if (this.presence[place][month]) {
        this.presence[place][month].push({ author, likelihood });
      } else {
        this.presence[place][month] = [{ author, likelihood }];
      }
    });
  }

}


