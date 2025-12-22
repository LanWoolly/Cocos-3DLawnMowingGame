import { _decorator, assetManager, Component, director, Node, resources } from 'cc';
import { DialogDef, UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends Component {
    onExitGame() {
        resources.releaseAll();
        director.loadScene("StartUp");
    }

    onPauseGame() {
        if (director.isPaused()) {
            director.resume();
            return;
        }

        director.pause();
    }

    onOpenSetting() {
        UIManager.instance.openDialog(DialogDef.UISetting);
    }
}


