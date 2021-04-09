import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import styled from 'styled-components'
import axios from 'axios'
import * as React from 'react'
import { svg } from './coffee'

interface LocationProps {
  latitude: number
  longitude: number
}

interface IPProps {
  lat: number
  lon: number
  [key: string]: any
}

interface AxiosIPProps {
  data: IPProps
  [key: string]: any
}

interface CategoryProps {
  alias: string
  title: string
}

interface CoordinatesProp {
  latitude: number
  longitude: number
}

interface BusinessLocationProps {
  address1: string
  address2: string
  address3: string
  city: string
  state: string
  zip_code: string
  country: string
}

interface BusinessProps {
  rating: number
  price: string
  phone: string
  id: string
  alias: string
  is_closed: boolean
  categories: CategoryProps[]
  review_count: number
  name: string
  url: string
  coordinates: CoordinatesProp
  image_url: string
  location: BusinessLocationProps
  distance: number
  transactions: string[]
}

interface YelpProps {
  businesses: BusinessProps[]
  total: number
}

interface AxiosYelpProps {
  data: YelpProps
  [key: string]: any
}

interface ViewportProps {
  width: string
  height: string
  latitude: number
  longitude: number
  zoom: number
}

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

const Mapbox = ReactMapboxGl({
  accessToken
})

const layoutLayer = { 'icon-image': 'coffee' }

const image: HTMLImageElement | undefined = new Image()
image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg)
const images: [string, HTMLImageElement] = ['coffee', image]

const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`

const Map = () => {
  const [viewport, setViewport] = React.useState<ViewportProps>({
    width: '100%',
    height: '100%',
    latitude: 37.3479,
    longitude: -122.0351,
    zoom: 10
  })
  const [location, setLocation] = React.useState<LocationProps | null>(null)
  const [businesses, setBusinesses] = React.useState<BusinessProps[]>([])
  const [business, setBusiness] = React.useState<BusinessProps | null>(null)
  React.useEffect(() => {
    axios.get('/api/ip').then((ipResponse: AxiosIPProps) => {
      const { data } = ipResponse
      setLocation({ latitude: data.lat, longitude: data.lon })
    })
  }, [])
  React.useEffect(() => {
    if (location) {
      axios
        .get(`/api/yelp/${location.latitude}/${location.longitude}`)
        .then((yelpResponse: AxiosYelpProps) => {
          const { data } = yelpResponse
          setBusinesses(data.businesses)
        })
    }
  }, [location])
  return location ? (
    <Mapbox
      style='mapbox://styles/mapbox/streets-v9'
      center={[location.longitude, location.latitude]}
      containerStyle={{
        flex: 1
      }}>
      <Layer type='symbol' id='marker' layout={layoutLayer} images={images}>
        {businesses.map((b) => (
          <Feature
            key={b.id}
            onClick={() => setBusiness(b)}
            coordinates={[b.coordinates.longitude, b.coordinates.latitude]}
          />
        ))}
      </Layer>
      {businesses.map((b) => (
        <Popup
          key={b.id}
          coordinates={[b.coordinates.longitude, b.coordinates.latitude]}>
          <StyledPopup>
            <div>{b.name}</div>
          </StyledPopup>
        </Popup>
      ))}
    </Mapbox>
  ) : (
    <p>Loading...</p>
  )
}

export default Map
