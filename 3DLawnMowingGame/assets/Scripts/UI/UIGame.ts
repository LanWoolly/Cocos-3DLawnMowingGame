import { _decorator, assetManager, Component, director, Node, ProgressBar, resources } from 'cc';
import { DialogDef, UIManager } from './UIManager';
import { AudioManager } from '../Level/Manager/AudioManager';
import { UIImageLabel } from './UIImageLabel';
import { ActorManager } from '../Level/Manager/ActorManager';
import { Events } from '../Events/Events';
import { ActorProperty } from '../Actor/ActorProperty';
const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends Component {
    @property(ProgressBar)
    expBar: ProgressBar = null;

    @property(UIImageLabel)
    expLabel: UIImageLabel = null;

    @property(ProgressBar)
    hpBar: ProgressBar = null;

    start() {
        let Player = ActorManager.instance.playActor;
        Player.node.on(Events.OnExpGain, this.onExpGain, this);
        Player.node.on(Events.OnPlayerUpgrade, this.onUpgrade, this);
        Player.node.on(Events.OnHurt, this.onHurt, this);

        this.onExpGain();
    }

    onDestroy() {
        let player = ActorManager.instance.playActor;
        player.node.off(Events.OnExpGain, this.onExpGain, this);
        player.node.off(Events.OnPlayerUpgrade, this.onUpgrade, this);
        player.node.off(Events.OnHurt, this.onHurt, this);
    }

    onExitGame() {
        resources.releaseAll();
        director.loadScene("StartUp");
    }

    onPauseGame() {
        if (director.isPaused()) {
            director.resume();
            AudioManager.instance.bgm.play();
        } else {
            director.pause();
            AudioManager.instance.pauseBgm();
            AudioManager.instance.pauseSfx();
        }
    }

    onOpenSetting() {
        UIManager.instance.openDialog(DialogDef.UISetting);
    }

    onUpgrade() {
        UIManager.instance.openDialog(DialogDef.UISkillUpGrade);
    }

    onExpGain() {
        if (ActorManager.instance.playActor) {
            let actorProperty = ActorManager.instance.playActor.actorProperty;
            this.expBar.progress = actorProperty.exp / actorProperty.maxExp;
            this.expLabel.string = actorProperty.exp + "/" + actorProperty.maxExp;
        }
    }

    onHurt(actorProperty: ActorProperty) {
        this.hpBar.progress = actorProperty.hpPercent;
    }
}


