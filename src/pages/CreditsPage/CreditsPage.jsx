import './CreditsPage.css';

/**
 * Credits page for ITSB (static content)
 *
 * @returns {React.ReactElement} Credits page React functional component
 */
export function CreditsPage() {
  return (
    <main id="credits">
      <div className="flex-spacer"></div>
      <article>
        <h1>Credits</h1>
        <section>
          <h2>Project Wranglers</h2>
          <dl>
            <dt>Kaiama L. Glover</dt>
            <dd>Barnard College, Columbia University</dd>
            <dt>Alex Gil</dt>
            <dd>Columbia University Libraries</dd>
          </dl>
        </section>
        <section>
          <h2>Contributors</h2>
          <h3>Dusé Mohamed Ali</h3>
          <dl>
            <dt>Marina Bilbija</dt>
            <dd>Williams College</dd>
          </dl>
          <h3>Kamau Brathwaite</h3>
          <dl>
            <dt>Kelly Baker Josephs</dt>
            <dd>York College, CUNY</dd>
            <dt>Clara Pomi</dt>
            <dd>Williams College</dd>
          </dl>
          <h3>Aimé Césaire</h3>
          <dl>
            <dt>Alex Gil</dt>
            <dd>Columbia University</dd>
            <dt>Kora Véron Leblé</dt>
            <dd>Institut de Textes et Manuscrits, CNRS</dd>
          </dl>
          <h3>Maryse Condé</h3>
          <dl>
            <dt>Soraya Limare</dt>
            <dd>Columbia University</dd>
          </dl>
          <h3>René Depestre</h3>
          <dl>
            <dt>Kaiama L. Glover</dt>
            <dd>Barnard College, Columbia University</dd>
          </dl>
          <h3>W.E.B. Du Bois</h3>
          <dl>
            <dt>Roopika Risam</dt>
            <dd>Salem State University</dd>
          </dl>
          <h3>Katherine Dunham</h3>
          <dl>
            <dt>Joanna Dee Das</dt>
            <dd>Washington University in St. Louis</dd>
            <dt>Laurent Dubois</dt>
            <dd>Duke University</dd>
          </dl>
          <h3>C.L.R. James</h3>
          <dl>
            <dt>Amanda Perry</dt>
            <dd>Champlain College-Saint Lambert</dd>
          </dl>
          <h3>Wifredo Lam</h3>
          <dl>
            <dt>Tao Goffe</dt>
            <dd>Cornell University</dd>
          </dl>
          <h3>George Lamming</h3>
          <dl>
            <dt>Amanda Perry</dt>
            <dd>Champlain College-Saint Lambert</dd>
          </dl>
          <h3>Claude McKay</h3>
          <dl>
            <dt>Raphael Dalleo</dt>
            <dd>Bucknell University</dd>
          </dl>
          <h3>Eslanda Goode Robeson</h3>
          <dl>
            <dt>Annette Joseph-Gabriel</dt>
            <dd>University of Michigan</dd>
          </dl>
        </section>
        <section>
          <h2>Designers</h2>
          <dl>
            <dt>Buck Wanner</dt>
            <dd>Columbia University</dd>
            <dd>Visualization Design</dd>
            <dt>Emily Fuhrman</dt>
            <dd>Columbia University</dd>
            <dd>Visualization & Project Design</dd>
            <dt>Alyssa Van</dt>
            <dd>Stanford University</dd>
            <dd>Data Analyst</dd>
            <dt>Dean Irvine</dt>
            <dd>Agile Humanities Agency</dd>
            <dd>Project Consultant</dd>
            <dt>Bill Kennedy</dt>
            <dd>Agile Humanities Agency</dd>
            <dd>Visualization, UI/UX and Production Design</dd>
            <dd>System Design</dd>
          </dl>
        </section>
        <section>
          <h2>Developers</h2>
          <dl>
            <dt>Rainer Simon</dt>
            <dd>Freelance software developer</dd>
          </dl>
          <dl>
            <dt>Jamie Folsom</dt>
            <dt>Ben Silverman</dt>
            <dd>Performant Software</dd>
          </dl>
        </section>
        <section>
          <h2>Acknowledgements</h2>
          <p className="acknowledgements">
            <strong>In the Same Boats</strong> has received generous support from the Barnard
            College Digital Humanities Center, the Columbia University Graduate School of Arts and
            Sciences, the Duke University Forum for Scholars and Publics, the Schomburg Center for
            Research in Black Culture, the University of Virginia.
          </p>
        </section>
        <hr />
        <small>
          N.B. Affiliations listed on our credits page reflect the contributor&apos;s affiliation at
          the moment of their contribution.
        </small>
      </article>
    </main>
  );
}
