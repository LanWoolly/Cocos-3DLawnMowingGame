import { _decorator, Component, } from 'cc';
import { UIImageLabel } from './UIImageLabel';
import { ActorManager } from '../Level/Manager/ActorManager';
import { Events } from '../Events/Events';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UIPlayerLevel')
@requireComponent(UIImageLabel)
export class UIPlayerLevel extends Component {
    level: UIImageLabel;

    start() {
        this.level = this.node.getComponent(UIImageLabel);

        let player = ActorManager.instance.playActor;
        player.node.on(Events.OnPlayerUpgrade, this.onPlayerUpgrade, this);
        this.level.string = player.actorProperty.level.toString();
    }

    onPlayerUpgrade() {
        this.level.string = ActorManager.instance.playActor.actorProperty.level.toString();
    }
}


