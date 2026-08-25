import { _decorator, Button, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIDead')
export class UIDead extends Component {

    ReStart() {
        director.loadScene('Game')
    }
}


