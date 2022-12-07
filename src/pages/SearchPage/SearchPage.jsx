import { useState } from 'react';
import { useGraph } from '@peripleo/peripleo';
import { useOutletContext } from 'react-router-dom';
import { SearchResult } from './SearchResult';

// Minimum input length (chars) to trigger search
const MIN_LENGTH = 3;

import './SearchPage.css';

/**
 * Search page for ITSB, using Peripleo search and filtering.
 *
 * @returns {React.ReactElement} Search page React functional component
 */
export function SearchPage() {
  const { loaded } = useOutletContext();

  const graph = useGraph();

  const [results, setResults] = useState([]);

  /**
   * Event handler for the search field text box.
   *
   * @param {ChangeEvent} evt Event triggered by a change in the search field
   */
  const onChange = (evt) => {
    const { value } = evt.target;

    if (value.length > MIN_LENGTH) {
      const results = graph.search(value);

      // Waypoints matched by this text search
      const waypoints = results.filter((r) => r.type === 'waypoint');

      // Matched authors -> resolve to all waypoints for this author
      const authors = results.filter((r) => r['@type'] === 'Person');
      const authorWaypoints = authors.reduce(
        (wps, author) => [...wps, ...graph.getItineraryForAuthor(author.id)],
        []
      );

      // Matched places --> resolve to all waypoints at this place
      const places = results.filter((r) => r.type === 'Feature');
      const placeWaypoints = places.reduce(
        (wps, place) => [...wps, ...graph.getWaypointsAt(place.id)],
        []
      );

      // Now merge (and de-duplicate) the results
      const mergedWaypoints = [...waypoints, ...authorWaypoints, ...placeWaypoints].reduce(
        (merged, nextWP) => {
          const exists = merged.find((wp) => wp.id === nextWP.id);
          return exists ? merged : [...merged, nextWP];
        },
        []
      );

      setResults(mergedWaypoints);
    } else {
      setResults([]);
    }
  };

  return (
    loaded && (
      <main id="search">
        <div className="flex-spacer"></div>
        <section className="search-wrapper">
          <form action="#" name="search" onSubmit={(evt) => evt.preventDefault()}>
            <input
              type="text"
              placeholder="Search authors, cities, notes and citations."
              onChange={onChange}
            />
          </form>

          <div id="search-results">
            {results.length === 0 ? (
              <p>Begin typing above.</p>
            ) : (
              <ul>
                {results.map((result) => (
                  <li key={result.id}>
                    <SearchResult data={result} graph={graph} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    )
  );
}
