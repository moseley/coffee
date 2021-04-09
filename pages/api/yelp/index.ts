import type { NextApiRequest, NextApiResponse } from 'next'
import { setHeaders } from '@/utils/headers'
import axios from 'axios'

const apiKey = process.env.YELP_API_KEY

interface CategoryProps {
  alias: string
  title: string
}

interface CoordinatesProp {
  latitude: number
  longitude: number
}

interface LocationProps {
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
  location: LocationProps
  distance: number
  transactions: string[]
}

interface RegionProps {
  center: CoordinatesProp
}

interface DataProps {
  total: number
  businesses: BusinessProps[]
  region: RegionProps
}

export interface YelpProps {
  data: DataProps
  [key: string]: any
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const end = setHeaders(req, res)
  if (end) {
    return
  }
  // console.log(apiKey)
  await axios
    .get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      params: {
        // location: 'San Francisco',
        latitude: 37.76089938976322,
        longitude: -122.43644714355469,
        radius: 40000,
        categories: 'coffee',
        locale: 'en_US',
        limit: 10,
        offset: 0,
        sort_by: 'distance',
        open_now: true
      }
    })
    .then((yelpResponse: YelpProps) => {
      const { businesses, total } = yelpResponse.data
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ businesses, total }))
    })
    .catch((err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(err))
    })
}
