import { NextApiRequest, NextApiResponse } from 'next'
import Stars from './stars.json'

type StarData = {
    id: number
    name: string
    x: number
    y: number
    z: number
    spectral: string
    size: string
}

export default async function(req: NextApiRequest, res: NextApiResponse<StarData[]>) {
    const count = parseInt(req.query.n as string) || Stars.length
    res.status(200).json(Stars.sort(() => 0.5 - Math.random()).slice(0, count)) // Sort by coord from center.
}