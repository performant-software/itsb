import { describe, it, expect } from 'vitest';
import { ITSBGraph } from './itsbGraph';

import authors from '../../../data/authors.json';
import places from '../../../data/places.json';
import itineraries from '../../../data/itineraries.json';

const initGraph = (authors, places, itineraries) => {
  const graph = new ITSBGraph()
  graph.init(authors, places, itineraries)
  return graph;
}

describe('ITSBGraph', () => {

  it('should load authors correctly', () => {
    const graph = initGraph(authors.itemListElement, [], [])
    const expected = graph.listAuthors();
    expect(expected.length).toBe(12);
  });

  it('should load places correctly', () => {
    const graph = initGraph([], places.features, []);
    const expected = graph.listPlaces();
    expect(expected.length).toBe(488);
  });

  it('should load itineraries correctly', () => {
    const graph = initGraph([], [], itineraries.first.items);
    const expected = graph.listItineraries();
    expect(expected.length).toBe(12);
  });

});