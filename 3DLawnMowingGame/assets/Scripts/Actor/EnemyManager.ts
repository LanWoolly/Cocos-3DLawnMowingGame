import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {
    start() {
        this.node.on("onFrameAttack",this.onFrameAttack,this);

    }

    update(deltaTime: number) {
        
    }
    
    onFrameAttack(){

    }
}


