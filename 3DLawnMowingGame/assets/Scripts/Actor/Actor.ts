
import { Events } from '../Events/Events';
import { MathUtil } from '../Utils/MathUtil';
import { ActorProperty } from './ActorProperty';
import { Projectile } from './Projectile';
import { StateDefine } from './StateDefine';
import { _decorator, Component, Node, RigidBody, SkeletalAnimation, Collider, v3, CCFloat, Vec3, math, ICollisionEvent, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

let tempVelocity = v3();

@ccclass('Actor')
export class Actor extends Component {
    currState: StateDefine | string = StateDefine.Idle;

    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    @property(CCFloat)
    linearSpeed: number = 5;

    @property(CCFloat)
    angularSpeed: number = 10;

    rigidbody: RigidBody = null;
    collider: Collider = null;

    input: Vec3 = v3();

    actorProperty: ActorProperty = new ActorProperty();

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    update(deltaTime: number) {
        if (this.currState == StateDefine.Die) {
            return;
        }
        this.doRotate();
        switch (this.currState) {
            case StateDefine.Run:
                // this.doRotate();
                this.doMove();
                break;
        }
    }

    doRotate() {
        // tempVelocity.x = 0;
        // tempVelocity.y = 0;

        // //输入朝向和当前朝向的夹角
        // const angle = MathUtil.signAngle(this.node.forward, this.input, Vec3.UP);
        // tempVelocity.y = angle * this.angularSpeed;
        // this.rigidbody.setAngularVelocity(tempVelocity);
        let a = MathUtil.signAngle(this.node.forward, this.input, Vec3.UP);
        let as = v3(0, a * 20, 0);
        this.rigidbody.setAngularVelocity(as);
    }

    doMove() {
        //速度 = 方向 * 基础速度 *因子（摇杆输入（加速减速））
        const speed = this.input.length() * this.linearSpeed
        tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
        tempVelocity.y = 0;
        tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
        this.rigidbody.setLinearVelocity(tempVelocity);
    }

    stopMove() {
        this.rigidbody.setLinearVelocity(Vec3.ZERO);
    }

    changeState(destState: StateDefine | string) {
        if (destState == this.currState && destState != StateDefine.Hit) {
            return;
        }

        if (this.currState == StateDefine.Die) {
            return;
        }

        if (this.currState == StateDefine.Hit) {
            if (destState != StateDefine.Die && destState != StateDefine.Hit) {
                return;
            }
        }

        if (this.currState == StateDefine.Run) {
            this.stopMove();
        }

        this.skeletalAnimation.crossFade(destState, 0.1);
        this.currState = destState;
    }

    respawn() {
        if (this.skeletalAnimation == null) {
            this.skeletalAnimation = this.node.children[0].getComponent(SkeletalAnimation);
        }
        this.currState = StateDefine.Idle;
        this.skeletalAnimation.crossFade(this.currState, 0.3);
    }

    onTriggerEnter(event: ICollisionEvent) {
        if (event.otherCollider.getGroup() == PhysicsSystem.PhysicsGroup.DEFAULT) {
            return;
        }

        const projectile = event.otherCollider.getComponent(Projectile);
        const hostActor = projectile.host.getComponent(Actor);

        let hurtDirtion = v3();
        Vec3.subtract(hurtDirtion, this.node.worldPosition, projectile.node.worldPosition,);
        hurtDirtion.normalize();
        this.hurt(hostActor.actorProperty.attack, hurtDirtion, hostActor);
    }

    hurt(damage: number, hurtDirtion: Vec3, hurtSource: Actor) {

        this.changeState(StateDefine.Hit);
        this.node.emit(Events.OnHurt, this.actorProperty);

        if (this.currState != StateDefine.Die) {
            hurtDirtion.multiplyScalar(2.0);
            this.rigidbody.applyImpulse(hurtDirtion);
            this.actorProperty.hp -= damage;
            if (this.actorProperty.hp <= 0) {
                this.onDie();
                hurtSource.node.emit(Events.OnKill, this);
            }
        }
    }

    onDie() {
        if (this.currState == StateDefine.Die) {
            return;
        }
        this.changeState(StateDefine.Die);
        this.node.emit(Events.OnDie, this.node);
    }
}


