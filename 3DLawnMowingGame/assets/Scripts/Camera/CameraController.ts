import { _decorator, Component, Node, v3, Vec3 } from 'cc';
import { ActorManager } from '../Level/Manager/ActorManager';
const { ccclass, property } = _decorator;

let temp = v3();

@ccclass('CameraController')
export class CameraController extends Component {
    initDirection: Vec3 = null;

    start() {

    }

    update(deltaTime: number) {
        let target = ActorManager.instance.playActor;
        if (target == null) {
            return;
        }
        if (this.initDirection == null) {
            this.initDirection = v3();
            Vec3.subtract(this.initDirection, this.node.worldPosition, target.node.worldPosition);
        } else {
            // this.node.worldPosition = target.node.worldPosition + this.initDirection;
            Vec3.add(temp, target.node.worldPosition, this.initDirection);
            this.node.worldPosition = temp;
        }
    }
}


