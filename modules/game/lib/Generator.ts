import * as Pixi from 'pixi.js'
import PoissonDiskSampling from 'poisson-disk-sampling'

type GeneratedPointOptions = {
    minX: number
    maxX: number
    minY: number
    maxY: number
}

type GeneratedPointsOptions = GeneratedPointOptions & {
    n: number
    minDistance?: number
    maxDistance?: number
}

export const getPoints = (options: GeneratedPointsOptions): Pixi.Point[] => {
    const sampling = new PoissonDiskSampling({
        shape: [options.maxX - options.minX, options.maxY - options.minY],
        minDistance: options.minDistance || 0,
        maxDistance: options.maxDistance
    })

    return sampling
        .fill()
        .sort(() => 0.5 - Math.random())
        .slice(0, options.n)
        .map(([x, y]) => new Pixi.Point(x + options.minX, y + options.minY))
}