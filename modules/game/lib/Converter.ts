const PC_TO_PX = 300

export const pcToPx = (pc: number) => {
    return pc * PC_TO_PX
}

export const pxToPc = (px: number) => {
    return Math.floor(px / PC_TO_PX)
}