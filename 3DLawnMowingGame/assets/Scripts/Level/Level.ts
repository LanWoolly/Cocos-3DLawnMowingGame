import { _decorator, BoxCollider, Component, Node, Vec3, v3, macro, random, randomRange, RigidBody } from 'cc';
import { ActorManager } from './Manager/ActorManager';
import { Actor } from '../Actor/Actor';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {
    @property(BoxCollider)
    spawnCollider: BoxCollider = null;

    spawnPos: Vec3 = v3();

    baseHp: number = 100;

    count: number = 10;

    maxAlive: number = 50;

    start() {
        //1.加载资源
        ActorManager.instance.init(() => {
            //2.关卡逻辑（刷怪，数值向）
            this.schedule(() => {
                if (ActorManager.instance.enemies.length > this.maxAlive) {
                    return;
                }

                for (let i = 0; i < this.count; i++) {
                    this.randomSpawn();

                }
            }, 10, macro.REPEAT_FOREVER, 1.0);

            this.schedule(() => {
                this.baseHp *= 1.2;
            }, 20, macro.REPEAT_FOREVER, 1.0);
        });

    }

    update(deltaTime: number) {

    }

    randomSpawn() {
        this.spawnPos.x = randomRange(-this.spawnCollider.size.x,
            this.spawnCollider.size.x);
        this.spawnPos.z = randomRange(-this.spawnCollider.size.z,
            this.spawnCollider.size.z);
        this.doSpawn(this.spawnPos);


    }

    doSpawn(spawnPoint: Vec3) {
        let node = ActorManager.instance.createEnemy();
        node.worldPosition = spawnPoint;

        let actor = node.getComponent(Actor);
        actor.actorProperty.maxHp = this.baseHp;
        actor.actorProperty.hp = this.baseHp;
        let scale = randomRange(1.0, 2.0);
        node.setWorldScale(scale, scale, scale);

        let rigidbody = node.getComponent(RigidBody);
        rigidbody.mass = scale;
    }
}


