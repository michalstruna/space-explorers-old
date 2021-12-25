export interface Props {
    sizeX?: number
    sizeY?: number
}

const Map: React.FC<Props> = ({ 
    sizeX = 1000,
    sizeY = 1000
}) => {
    return (
        <canvas>
            
        </canvas>
    )
}

export default Map