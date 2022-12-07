import { describe, it, expect } from 'vitest';
import { ITSBGraph } from './itsbGraph';

import authors from '../../../public/data/authors.json';
import places from '../../../public/data/places.json';
import itineraries from '../../../public/data/itineraries.json';

// eslint-disable-next-line jsdoc/require-jsdoc
const initGraph = (authors, places, itineraries) => {
  const graph = new ITSBGraph();
  graph.init(authors, places, itineraries);
  return graph;
};

describe('ITSBGraph', () => {
  it('should load authors correctly', () => {
    const graph = initGraph(authors.itemListElement, [], []);
    const expected = graph.listAuthors();
    expect(expected.length).toBe(12);
  });

  it('should load places correctly', () => {
    const graph = initGraph([], places.features, []);
    const expected = graph.listPlaces();
    expect(expected.length).toBe(491);
  });

  it('should load itineraries correctly', () => {
    const graph = initGraph(authors.itemListElement, places.features, itineraries.first.items);
    const expected = graph.listItineraries();
    expect(expected.length).toBe(12);
  });

  it('should return the next waypoint correctly', () => {
    const graph = initGraph(authors.itemListElement, places.features, itineraries.first.items);

    const waypoints = graph.listItineraries()[3].waypoints;

    // https://sameboats.org/authors/acesaire/itineraries/1/wp/26
    const a = waypoints[26];

    // https://sameboats.org/authors/acesaire/itineraries/1/wp/177
    const b = waypoints[177]; // last in sequence

    const next = graph.getNextWaypoint(a);
    expect(next.id).toBe('https://sameboats.org/authors/acesaire/itineraries/1/wp/27');

    const undef = graph.getNextWaypoint(b);
    expect(undef).toBeUndefined();
  });

  it('should return the previous waypoint correctly', () => {
    const graph = initGraph(authors.itemListElement, places.features, itineraries.first.items);

    const waypoints = graph.listItineraries()[3].waypoints;

    // https://sameboats.org/authors/acesaire/itineraries/1/wp/26
    const a = waypoints[26];

    const b = graph.getNode('https://sameboats.org/authors/acesaire/itineraries/1/wp/0');

    const next = graph.getPreviousWaypoint(a);
    expect(next.id).toBe('https://sameboats.org/authors/acesaire/itineraries/1/wp/25');

    const undef = graph.getPreviousWaypoint(b);
    expect(undef).toBeUndefined();
  });
});
