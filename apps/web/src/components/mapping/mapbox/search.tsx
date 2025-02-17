import React from 'react'
import { useMap } from 'react-map-gl'
import { Geocoder, SearchBox } from '@mapbox/search-js-react'
import { useMapStore } from '@/components/providers/map-state-provider'

/**
 * Search bar for the map
 */
const Search = () => {
  const { current: map } = useMap()
  const { searchValue, setSearchValue } = useMapStore((store) => store)

  const handleSearchResult = (res: any) => {

  }

  // return (
  //     <>
      
  //     <SearchBox
  //       options={{
  //         proximity: {
  //           lng: -122.431297,
  //           lat: 37.773972,
  //         },
  
  //       }}
  //       value={searchValue || undefined}
  //       onChange={setSearchValue}
  //       accessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
  
  //       onRetrieve={(res) => {
  
  //       }}
  //     ></SearchBox>
  //     </>

  // )
}

export default Search
