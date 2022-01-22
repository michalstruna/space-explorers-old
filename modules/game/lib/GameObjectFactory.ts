import BuildingType from '../data/BuildingType'
import CrystalStore from './buildings/CrystalStore'
import MetalStore from './buildings/MetalStore'

export const getBuildingClass = (type: BuildingType) => {
    switch (type) {
        case BuildingType.METAL_STORE: return MetalStore
        case BuildingType.CRYSTAL_STORE: return CrystalStore
    }
}