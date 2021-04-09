import type { NextApiRequest, NextApiResponse } from 'next'
import { setHeaders } from '@/utils/headers'
import axios from 'axios'
import { YelpProps } from '../../index'

const apiKey = process.env.YELP_API_KEY

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const end = setHeaders(req, res)
  if (end) {
    return
  }
  const {
    query: { lat, lon, offset }
  } = req
  await axios
    .get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      params: {
        latitude: lat,
        longitude: lon,
        radius: 10000,
        categories: 'coffee',
        locale: 'en_US',
        limit: 10,
        offset: offset,
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
