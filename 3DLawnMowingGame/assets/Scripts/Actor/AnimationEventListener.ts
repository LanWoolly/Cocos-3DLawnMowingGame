import { _decorator, Component, Node } from 'cc';
import { Events } from '../Events/Events';
const { ccclass, property } = _decorator;

@ccclass('AnimationEventListener')
export class AnimationEventListener extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    onFrameAttackLoose() {
        this.node.parent.emit(Events.OnFrameAttackLoose);
    }

    onFrameAttack() {
        this.node.parent.emit(Events.OnFrameAttack);
    }
}


