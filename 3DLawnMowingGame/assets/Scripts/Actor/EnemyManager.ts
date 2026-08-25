import { _decorator, ccenum, CCFloat, Component, game, macro, Node, v3, Vec3 } from 'cc';
import { ActorManager } from '../Level/Manager/ActorManager';
import { StateDefine } from './StateDefine';
import { Actor } from './Actor';
import { ProjectileEmitter } from './ProjectileEmitter';
import { Events } from '../Events/Events';
const { ccclass, property, requireComponent } = _decorator;

export enum Career {
    Melee = 0,//近战
    Range = 1,//远程
}
ccenum(Career);

@ccclass('EnemyManager')
@requireComponent(Actor)
export class EnemyManager extends Component {
    actor: Actor = null;

    @property(CCFloat)
    attackRange: number = 0.5;

    @property(CCFloat)
    attackInterval: number = 5;

    lastAttackTime: number = 0;

    destPosition: Vec3 = v3();

    @property({ type: Career })
    career: Career = Career.Melee;

    projectileEmitter: ProjectileEmitter = null;

    @property(Node)
    projectileStartNode: Node = null;

    start() {
        this.actor = this.node.getComponent(Actor);
        this.node.on(Events.OnFrameAttack, this.onFrameAttack, this);
        this.schedule(this.executeAI, 0.5, macro.REPEAT_FOREVER, 1.0);
        if (this.career == Career.Range) {
            this.projectileEmitter = this.node.getComponent(ProjectileEmitter);
        }
    }

    onDestroy() {
        this.node.off(Events.OnFrameAttack, this.onFrameAttack, this);
    }

    executeAI() {
        let target = ActorManager.instance.playActor;
        if (target == null)
            return;
        if (target.currState == StateDefine.Die)
            return;
        if (this.actor.currState == StateDefine.Hit || this.actor.currState == StateDefine.Die)
            return;
        // 不处于 Run/Idle 状态
        if (this.actor.currState != StateDefine.Idle && this.actor.currState != StateDefine.Run) {
            return;
        }

        const canAttack = game.totalTime - this.lastAttackTime >= this.attackInterval;
        // 目标已死或不能攻击
        if (target.currState == StateDefine.Die || !canAttack) {
            this.actor.changeState(StateDefine.Idle);
            return;
        }

        const distance = Vec3.distance(this.node.worldPosition, target.node.worldPosition);

        Vec3.subtract(this.actor.input, target.node.worldPosition, this.node.worldPosition);
        this.actor.input.normalize();
        this.actor.input.y = 0;

        if (distance > this.attackRange) {
            this.actor.changeState(StateDefine.Run);
            return;
        }

        this.actor.input.set(0, 0, 0);

        if (game.totalTime - this.lastAttackTime > this.attackInterval) {
            Vec3.subtract(this.actor.input, target.node.worldPosition, this.node.worldPosition);
            this.actor.input.normalize();
            this.actor.input.y = 0;
            this.actor.changeState(StateDefine.Attack);
            this.lastAttackTime = game.totalTime;
            return;
        }

        this.actor.changeState(StateDefine.Idle);
    }

    onFrameAttack() {
        let target = ActorManager.instance.playActor;
        if (target == null)
            return;
        let hurtDirection = v3();
        Vec3.subtract(hurtDirection, target.node.worldPosition, this.node.worldPosition);
        const distance = hurtDirection.length();
        hurtDirection.normalize();
        hurtDirection.y = 0;

        //1.近战造成伤害
        if (this.career == Career.Melee) {
            if (distance < this.attackRange) {
                const angle = Vec3.angle(hurtDirection, this.node.forward);
                if (angle < Math.PI) {
                    target.hurt(this.actor.actorProperty.attack, hurtDirection, this.actor);
                }
            }
            return;
        }

        //2.远程攻击
        if (this.career == Career.Range) {
            let projectile = this.projectileEmitter.create();
            projectile.node.worldPosition = this.projectileStartNode.worldPosition;
            projectile.host = this.node;
            projectile.node.forward = hurtDirection;
        }
    }
}


