import { useQuery } from "@tanstack/react-query";
import Peripleo, { Map, Controls, ZoomControl } from "@peripleo/peripleo"
import { AuthorSelect, ITSBStore, ItinerariesLayer } from "./components"

const fetchData = url => () => fetch(url).then(res => res.json());

export function App() {

  const authorQuery = useQuery(['authors'], fetchData('../data/authors.json'));

  const placesQuery = useQuery(['places'], fetchData('../data/places.json'));

  const itinerariesQuery = useQuery(['itineraries'], fetchData('../data/itineraries.json'));

  return (
    <Peripleo>
      <ITSBStore
        authors={authorQuery.data?.itemListElement}
        places={placesQuery.data?.features}
        itineraries={itinerariesQuery.data?.first.items}>

        <aside>
          <AuthorSelect />
        </aside>

        <main>
          <Map.MapLibreDeckGL
            mapStyle="https://api.maptiler.com/maps/voyager/style.json?key=cqqmcLw28krG9Fl7V3kg"
            defaultBounds={[[-15.764914, 33.847608], [35.240991, 58.156214]]}
            layers={[ ItinerariesLayer ]} />

          <Controls>
            <ZoomControl />
          </Controls>
        </main>

      </ITSBStore>
    </Peripleo>
  )

}