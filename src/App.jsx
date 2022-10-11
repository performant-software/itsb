import { useQuery } from "@tanstack/react-query";
import Peripleo, { Map } from "@peripleo/peripleo"
import { ITSBStore } from "./components"

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

        <Map.MapLibreDeckGL
          mapStyle="https://api.maptiler.com/maps/voyager/style.json?key=cqqmcLw28krG9Fl7V3kg">

        </Map.MapLibreDeckGL>

      </ITSBStore>
    </Peripleo>
  )

}