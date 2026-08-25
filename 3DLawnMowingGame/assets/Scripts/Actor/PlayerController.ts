import { _decorator, CCFloat, Component, math, Node, Vec3, v3 } from 'cc';
import { Actor } from './Actor';
import { VirtualInput } from '../Input/VirtualInput';
import { StateDefine } from './StateDefine';
import { MathUtil } from '../Utils/MathUtil';
import { ProjectileEmitter } from './ProjectileEmitter';
import { ActorManager } from '../Level/Manager/ActorManager';
import { Events } from '../Events/Events';
import { Level } from '../Level/Level';
import { AudioManager } from '../Level/Manager/AudioManager';
const { ccclass, property, requireComponent } = _decorator;

let arrowForward: Vec3 = v3();


@ccclass('PlayerController')
@requireComponent(Actor)
export class PlayerController extends Component {
    actor: Actor = null;

    @property(Node)
    bowString: Node = null;

    @property(CCFloat)
    fireInterval: number = 0.5;
    @property(CCFloat)
    detectRadius: number = 10;;

    projectileEmitter: ProjectileEmitter;

    shootDirection: Vec3 = v3();

    private _splitAngle: number[] = [0];
    private _currentTarget: Node = null;

    onLoad() {
        this.actor = this.node.getComponent(Actor);
        this.actor.isPlayer = true;
        ActorManager.instance.playActor = this.actor;
    }

    start() {
        this.projectileEmitter = this.node.getComponent(ProjectileEmitter);
        this.node.on(Events.OnKill, this.onKill, this);
        this.node.on(Events.OnFrameAttackLoose, this.onFrameAttackLoose, this);
    }

    update(deltaTime: number) {
        // 场景切换过程中本组件可能被销毁，防止残留帧调用时报错
        if (!this.isValid || !this.actor || !this.actor.isValid) {
            return;
        }
        if (this.actor.currState == StateDefine.Die || this.actor.currState == StateDefine.Hit) {
            return;
        }
        // this.actor.input.x = VirtualInput.horizontal;
        // this.actor.input.z = -VirtualInput.vertical;

        const len = this.handleInput();

        if (len > 0.1) {
            this.actor.changeState(StateDefine.Run);
        } else {
            //     //有敌人：攻击；没有敌人：空闲
            let enemy = this.getNearEnemy();
            if (enemy == null) {
                this.actor.changeState(StateDefine.Idle);
            } else {
                Vec3.subtract(this.actor.input, enemy.worldPosition, this.node.worldPosition);
                this.actor.input.y = 0;
                this.actor.input.normalize();

                this.actor.changeState(StateDefine.Attack);
                this._currentTarget = enemy;
            }
        }
    }

    onDestroy() {
        ActorManager.instance.playActor = null;
        this.node.off(Events.OnKill, this.onKill, this);
        this.node.off(Events.OnFrameAttackLoose, this.onFrameAttackLoose, this);
    }

    handleInput(): number {
        let x = VirtualInput.horizontal;
        let y = VirtualInput.vertical;

        this.actor.input.x = x;
        this.actor.input.z = -y;
        this.actor.input.y = 0;
        this.actor.input.normalize();
        return this.actor.input.length();
    }

    onFrameAttackLoose() {
        let target = this._currentTarget;
        if (!this.isTargetValid(target)) {
            target = this.getNearEnemy();
            this._currentTarget = target;
        }
        if (target == null) {
            return;
        }

        // const distance = Vec3.distance(this.node.worldPosition, target.worldPosition);
        // if (distance > this.detectRadius) {
        //     return;
        // }
        // const targetActor = target.getComponent(Actor);
        // if (targetActor && targetActor.currState == StateDefine.Die) {
        //     return;
        // }

        //发射箭矢
        const arrowStartPos = this.bowString.worldPosition;

        Vec3.subtract(this.shootDirection, target.worldPosition, arrowStartPos);
        this.shootDirection.y = 0;
        this.shootDirection.normalize();

        for (let i = 0; i < this.actor.actorProperty.projectileCount; i++) {
            let projectile = this.projectileEmitter.create();
            MathUtil.rotateAround(arrowForward, this.shootDirection, Vec3.UP, this._splitAngle[i]);

            projectile.node.forward = arrowForward.clone();
            projectile.node.worldPosition = arrowStartPos;
            projectile.host = this.node;
        }
        AudioManager.instance.playShootSfx();
    }

    /**
       * 集中校验目标是否仍为有效攻击对象
       */
    private isTargetValid(target: Node): boolean {
        if (target == null || !target.isValid || !target.activeInHierarchy) {
            return false;
        }
        const distance = Vec3.distance(this.node.worldPosition, target.worldPosition);
        if (distance > this.detectRadius) {
            return false;
        }
        const targetActor = target.getComponent(Actor);
        if (targetActor && targetActor.currState == StateDefine.Die) {
            return false;
        }
        return true;
    }

    set projectileCount(count: number) {
        this._splitAngle = [];
        const rad = math.toRadian(10);
        const isOdd = count % 2 != 0;

        const len = Math.floor(count / 2);
        for (let i = 0; i < len; i++) {
            this._splitAngle.push(-rad * (i + 1));
            this._splitAngle.push(rad * (i + 1));
        }

        if (isOdd) {
            this._splitAngle.push(0);
        }
    }

    getNearEnemy(): Node {
        let enemies = ActorManager.instance.enemies;
        if (!enemies || enemies.length == 0) {
            return null;
        }

        let minDistance = this.detectRadius;
        let minNode: Node = null;
        for (let enemy of enemies) {
            const actor = enemy.getComponent(Actor);

            if (actor && actor.currState == StateDefine.Die) {
                continue;
            }
            let distance = Vec3.distance(this.node.worldPosition, enemy.worldPosition);
            if (distance < minDistance) {
                minDistance = distance;
                minNode = enemy;
            }
        }
        return minNode;
    }

    onKill() {
        let property = this.actor.actorProperty;
        property.exp++;
        this.node.emit(Events.OnExpGain, property.exp, property.maxExp);
        if (property.exp >= property.maxExp) {
            property.exp = 0;
            property.maxExp *= 1.5;
            property.level++;
            this.node.emit(Events.OnPlayerUpgrade, property.level);
        }
    }
}


