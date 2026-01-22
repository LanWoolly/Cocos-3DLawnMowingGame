
import { MathUtil } from '../Utils/MathUtil';
import { StateDefine } from './StateDefine';
import { _decorator, Component, Node, RigidBody, SkeletalAnimation, Collider, v3, CCFloat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

let tempVelocity = v3();

@ccclass('Actor')
export class Actor extends Component {
    currState: StateDefine = StateDefine.Idle;

    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    @property(CCFloat)
    linearSpeed: number = 5;

    @property(CCFloat)
    angularSpeed: number = 10;

    rigidbody: RigidBody = null;
    collider: Collider = null;

    input: Vec3 = v3();

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);
    }

    update(deltaTime: number) {

        switch (this.currState) {
            case StateDefine.Run:
                this.doRotate();
                this.doMove();
                break;
        }
    }

    doRotate() {
        tempVelocity.x = 0;
        tempVelocity.y = 0;

        //输入朝向和当前朝向的夹角
        const angle = MathUtil.signAngle(this.node.forward, this.input, Vec3.UP);
        tempVelocity.y = angle * this.angularSpeed;
        this.rigidbody.setAngularVelocity(tempVelocity);
    }

    doMove() {
        //速度 = 方向 * 基础速度 *因子（摇杆输入（加速减速））
        const speed = this.input.length() * this.linearSpeed
        tempVelocity.x = this.node.forward.x * speed;
        tempVelocity.y = 0;
        tempVelocity.z = this.node.forward.z * speed;
        this.rigidbody.setLinearVelocity(tempVelocity);
    }

    stopMove() {
        this.rigidbody.setLinearVelocity(Vec3.ZERO);
    }

    changeState(destState: StateDefine) {
        if (this.currState == StateDefine.Die) {
            return;
        }

        if (this.currState == StateDefine.Hit) {
            if (destState != StateDefine.Die && destState != StateDefine.Hit) {
                return;
            }
        }

        if (this.currState != StateDefine.Run) {
            this.stopMove();
        }

        this.currState = destState;
        this.skeletalAnimation.crossFade(destState, 0.3);
    }

    respawn() {
        this.currState = StateDefine.Idle;
        this.skeletalAnimation.crossFade(this.currState, 0.3);
    }
}


