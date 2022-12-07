import './InstructionsPage.css';

/**
 * Instructions page for ITSB (static content)
 *
 * @returns {React.ReactElement} Instructions page React functional component
 */
export function InstructionsPage() {
  return (
    <main id="instructions">
      <div className="flex-spacer"></div>
      <article>
        <h1>Instructions</h1>
        <section>
          <h2>Trajectories</h2>
          <p>
            This visualization presents an interactive narrative overview of one or more
            individuals’ movements through space over time. The date range filter allows for the
            researcher to consider specific periods or phases. You can select figures individually
            or you can compare them to others by selecting them.
          </p>
          <ol>
            <li>
              Select a range of time using the date range filter in the left column. You can click
              the up and down buttons to adjust the start and end date by month. You can also adjust
              the months by clicking on the text box containing each date and either typing the
              month and year, or using the up and down arrow keys on your keyboard. On certain
              browsers (Chrome, Edge) you may be able to click a calendar icon to choose each month
              and year on a calendar.
            </li>
            <li>Select one or more authors from the list in the left column.</li>
            <li>
              Once the map has been drawn, you can hover over any dot on the map to read a pop-up
              note about that particular moment in time for that particular author.
            </li>
          </ol>
        </section>

        <section>
          <h2>Intersections</h2>
          <p>
            This visualization presents an interactive snapshot overview of the world map that
            reflects the presence of Afro-Atlantic figures in particular geographical locations at
            particular points in time. Clicking on a given city reveals which figures were present
            in that place and when they were there. We have worked to preserve a sense of ambiguity
            when a range of time is not certain. This uncertainty is indicated via the transparent
            aura encircling each dot. The size of the aura indicates the level of ambiguity.
          </p>
          <ol>
            <li>Select a range of time by clicking on the date range in the left column.</li>
            <li>Select one or more authors from the list in the left column.</li>
            <li>
              Select a dot on the map to see what figures were at that spot in the same time range.
            </li>
          </ol>
        </section>

        <section>
          <h2>Search</h2>
          <p>
            In our search page you can search for authors, dates, keywords and more. Simply type in
            your search terms in the search box to see the results.
          </p>
        </section>

        <hr />

        <section>
          <h2>Get on the Map</h2>
          <p>
            Same Boats is a fundamentally collaborative venture&mdash;an invitation of sorts meant
            to provide our community with the opportunity to participate in the development of a
            unique platform and to imagine research projects and pedagogical initiatives that
            transgress the geo-political borders separating the various nations of the Americas. If
            you’re interested in being a part of this project by proposing an additional figure or
            in working with one of our existing figures/editors, please contact us at{' '}
            <a href="mailto:thesameboats@gmail.com">thesameboats@gmail.com</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
