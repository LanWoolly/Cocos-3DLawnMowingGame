import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIStartUp')
export class UIStartUp extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    onBtnStartupClicked() {
        console.log("开始游戏");
        director.loadScene('Game');
    }
}


