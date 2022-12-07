import { Link } from 'react-router-dom';
import './HomePage.css';

/**
 * Home page for ITSB (static content)
 *
 * @returns {React.ReactElement} Home page React functional component
 */
export function HomePage() {
  return (
    <main id="home">
      <div className="flex-spacer"></div>
      <article>
        <h1>Welcome</h1>
        <aside>
          <section className="vis-info">
            <h2>Trajectories</h2>
            <p>
              This visualization presents an interactive narrative overview of one or more
              individuals&apos; movements through space over time. The timeline function allows for
              the researcher to consider specific periods or phases, individually or in comparison
              with other figures.
            </p>
            <Link className="btn" to="/trajectories">
              View trajectories
            </Link>
          </section>

          <section className="vis-info">
            <h2>Intersections</h2>
            <p>
              This visualization presents an interactive snapshot overview of the world map that
              reflects the presence of Afro-Atlantic figures in particular geographical locations at
              particular points in time. Clicking on a given city which figures were present in that
              place and when they were there.
            </p>
            <Link className="btn" to="/intersections">
              View intersections
            </Link>
          </section>
        </aside>
        <p>
          <strong>In the Same Boats</strong> is a work of multimodal scholarship designed to
          encourage the collaborative production of humanistic knowledge within scholarly
          communities. The platform comprises two interactive visualizations that trace the
          movements of significant cultural actors from the Caribbean and wider Americas, Africa,
          and Europe within the 20th century Afro-Atlantic world. It presents opportunities for
          unearthing the extent to which Caribbean, Latin American, African, European, and
          Afro-American intellectuals have been in both punctual and sustained conversation with one
          another: attending the same conferences, publishing in the same journals and presses,
          active in the same political groups, perhaps even elbow-to-elbow in the same Parisian
          cafés and on the same transatlantic crossings&mdash;literally and metaphorically{' '}
          <strong>in the same boats</strong>&mdash;as they circulate throughout the Americas,
          Africa, Europe, and beyond.
        </p>
        <p>
          One of the greatest challenges for postcolonial scholars of Africa and its diasporas is
          that of navigating nation-language frontiers that are the legacies of colonialism. The
          partitioning of the postcolonial into anglophone, francophone, hispanophone, and lusophone
          spaces persists&mdash;despite being in so many ways at odds with the shared socio-cultural
          and historical realities of the Afro-Atlantic. Same Boats pushes back against the academic
          balkanization of black Atlantic intellectual production, retracing limits and contours
          largely determined by imperial metropoles.
        </p>

        <p>
          In presenting a series of individual maps produced on a common template by specialists of
          the different linguistic regions of the western Atlantic, Same Boats seeks to counter the
          Euro-lingual constraints and attendant border-drawing that too often keep Caribbeanist,
          Latin-Americanist, Africanist, Afro-Europeanist, and Afro-Americanist scholars from
          engaging in deeply transnational and transcolonial dialogue, hindering us from seeing
          connections or from fully imagining a networked Afro-intellectual world. Literally mapping
          the network of Afro-diasporic intellectual, political, and aesthetic figures in the 20th
          century, Same Boats offers visual corroboration of the work of scholars who have long
          committed to thinking about the Afro-Atlantic as an integrally networked chronotope. This
          platform aims to facilitate a physical tracing of hemispheric black studies&mdash;to
          provide a point of departure from which to highlight the various sites wherein
          Afro-Atlantic intellectual traditions may have been born and/or shepherded into the world.
        </p>
        <p>
          The platform&apos;s visualizations sketch a &ldquo;big picture&rdquo; narrative of Black
          intellectual and artistic migration, revealing what were the potential points and periods
          of encounter (&ldquo;Trajectories&rdquo;). Upon drilling down into the maps&apos;
          spatio-temporal intersections, specific nodes of confluence emerge, calling&mdash;we
          hope&mdash;for further scholarly exploration (&ldquo;Intersections&rdquo;). Indeed, Same
          Boats is meant to serve above all as an invitation for our community of researchers,
          students, and educators to flesh out and enrich the scholarly record toward the
          constitution of a 20th century Afro-Atlantic Republic of Arts and Letters.
        </p>
        <p>
          <Link className="btn" to="instructions">
            Learn how it works…
          </Link>
        </p>
      </article>
    </main>
  );
}
