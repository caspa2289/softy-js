import { Camera } from './Camera'
import { FPCameraProps } from '../../common/types'

export class FPCamera extends Camera {
    constructor({ rotation, position }: FPCameraProps) {
        super({ rotation, position })
    }
}
