import type { NextApiRequest, NextApiResponse } from 'next'
import { setHeaders } from '@/utils/headers'
import axios from 'axios'

interface DataProps {
  query: string
  status: string
  message: string
  lat: number
  lon: number
  timezone: string
}

interface IPAPIProps {
  data: DataProps
  [key: string]: any
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const end = setHeaders(req, res)
  if (end) {
    return
  }

  // const ip = '77.77.77.77'
  const sunnyvaleIp = '24.130.66.228'
  const rawIp = req.headers['x-real-ip'] || req.socket.remoteAddress
  const ip = rawIp === '::1' || '127.0.0.1' ? sunnyvaleIp : rawIp

  try {
    const response: IPAPIProps = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,message,lat,lon,timezone,query`
    )
    const data: DataProps = response.data
    res.status(200).json(data)
  } catch (e) {
    res.status(400).json(e)
  }
}
