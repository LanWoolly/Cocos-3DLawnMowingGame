import { _decorator, CCFloat, Collider, Component, ICollisionEvent, Node, v3, Vec3, math, EffectAsset } from 'cc';
import { ProjectileProperty } from './ProjectileProperty';
import { Events } from '../Events/Events';
import { MathUtil } from '../Utils/MathUtil';
import { EffectManager } from '../Level/Manager/EffectManager';
import { ResourcesDefine } from '../Resources/ResourcesDefine';
import { AudioManager } from '../Level/Manager/AudioManager';
const { ccclass, property } = _decorator;

let tempPosition: Vec3 = v3();
let forward: Vec3 = v3();

@ccclass('Projectile')
export class Projectile extends Component {
    @property(CCFloat)
    linearSpeed: number = 3;

    @property(CCFloat)
    angularSpeed: number = 180;

    host: Node = null;

    projectileProperty: ProjectileProperty = new ProjectileProperty();

    collider: Collider = null;

    target: Node = null;

    startTime: number = 0;

    start() {
        this.collider = this.node.getComponent(Collider);
        this.collider.on("onTriggerEnter", this.onTriggerEnter, this);
    }

    update(deltaTime: number) {
        this.startTime += deltaTime;
        if (this.startTime > this.projectileProperty.lifeTime) {
            this.node.emit(Events.OnProjectileDead, this);
            return;
        }

        //移动
        Vec3.scaleAndAdd(tempPosition, this.node.worldPosition, this.node.forward, this.linearSpeed * deltaTime);
        this.node.worldPosition = tempPosition;

        //跟踪
        if (this.target != null) {
            Vec3.subtract(tempPosition, this.target.worldPosition, this.node.worldPosition);
            tempPosition.normalize();
            const angle = math.toRadian(this.angularSpeed) * deltaTime;
            MathUtil.rotateToward(forward, this.node.forward, tempPosition, angle);
            this.node.forward = forward;
        }
    }

    onDestroy() {

    }

    onTriggerEnter(event: ICollisionEvent) {
        this.projectileProperty.penetration--;
        if (this.projectileProperty.penetration <= 0) {
            this.node.emit(Events.OnProjectileDead, this);
        }

        EffectManager.instance.play(ResourcesDefine.EffExplore, event.otherCollider.node.worldPosition);
        AudioManager.instance.playHitSfx();
    }
}


