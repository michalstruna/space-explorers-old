import { NextApiRequest, NextApiResponse } from 'next'

import { GameData, GameOptions, StarData } from '../../modules/game/types'
import Stars from './stars.json'

const EDGE = 1

export default async function (req: NextApiRequest, res: NextApiResponse<GameData>) {
    if (req.method === 'POST') {
        const options: GameOptions = req.body
        let rawStars = Stars.slice(0, options.nStars)
        let sizeX = 0, sizeY = 0, offsetX = Infinity, offsetY = Infinity
    
        for (const star of rawStars) {
            sizeX = Math.max(star.x, sizeX)
            sizeY = Math.max(star.y, sizeY)
            offsetX = Math.min(star.x, offsetX)
            offsetY = Math.min(star.y, offsetY)
        }
    
        const stars: StarData[] = rawStars.map(({ x, y, id, ...star }) => ({
            ...star,
            id: id.toString(),
            position: { x: x - offsetX + EDGE, y: y - offsetY + EDGE },
            owner: null
        }))

        stars[0].owner = '0' // TODO: Remove
        stars[1].owner = '1'

        const size = {
            x: sizeX + EDGE * 2 - offsetX,
            y: sizeY + EDGE * 2 - offsetY
        }

        res.status(200).json({
            created: Date.now(),
            players: options.players.map((data, i) => ({
                ...data,
                id: i.toString(),
                ships: [],
                stars: [stars[i].id]
            })),
            size, stars
        })
    }
}