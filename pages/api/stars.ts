import { NextApiRequest, NextApiResponse } from 'next'

import { StarsArea } from '../../modules/game/types'
import Stars from './stars.json'

const EDGE = 1

export default async function (req: NextApiRequest, res: NextApiResponse<StarsArea>) {
    const count = parseInt(req.query.n as string) || Stars.length
    let stars = Stars.slice(0, count)
    let sizeX = 0, sizeY = 0, offsetX = Infinity, offsetY = Infinity

    for (const star of stars) {
        sizeX = Math.max(star.x, sizeX)
        sizeY = Math.max(star.y, sizeY)
        offsetX = Math.min(star.x, offsetX)
        offsetY = Math.min(star.y, offsetY)
    }

    stars = stars.map(star => ({ ...star, x: star.x - offsetX + EDGE, y: star.y - offsetY + EDGE }))

    res.status(200).json({
        stars, size: {
            x: sizeX + EDGE * 2 - offsetX,
            y: sizeY + EDGE * 2 - offsetY
        }
    }) // Sort by coord from center.
}