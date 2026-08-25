import { _decorator, Component, director, Node } from 'cc';
import { Actor } from '../Actor/Actor';
import { ActorManager } from '../Level/Manager/ActorManager';
const { ccclass, property } = _decorator;

@ccclass('UISkillUpgrade')
export class UISkillUpgrade extends Component {
    playerActor: Actor = null;

    onEnable() {
        this.playerActor = ActorManager.instance.playActor;
        director.pause();
    }

    onDisable() {
        director.resume()
    }

    onUpgradePenetration() {
        this.playerActor.actorProperty.peneration++;
        this.node.active = false;
    }

    onUpgradeProjectileCount() {
        this.playerActor.actorProperty.projectileCount++;
        this.node.active = false;
    }

    onUpgradeChaseRate() {
        this.playerActor.actorProperty.chaseRate++;
        this.node.active = false;
    }
}


