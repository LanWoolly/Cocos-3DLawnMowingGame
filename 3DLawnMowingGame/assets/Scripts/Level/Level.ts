import { _decorator, BoxCollider, CCFloat, Component, Rect, Size, Node, Vec3, v3, v2, macro, random, randomRange, RigidBody, director } from 'cc';
import { ActorManager } from './Manager/ActorManager';
import { Actor } from '../Actor/Actor';
import { EffectManager } from './Manager/EffectManager';
import { AudioManager } from './Manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {

    private static _instance: Level;
    static get instance() {
        return this._instance;
    }

    @property(BoxCollider)
    spawnCollider: BoxCollider = null;

    /** 
     * 出生范围 
    */
    private spawnRect: Rect = new Rect()

    spawnPos: Vec3 = v3();

    baseHp: number = 10;

    count: number = 10;

    maxAlive: number = 10;

    @property(CCFloat)
    minSpawnDistance: number = 5;

    start() {
        Level._instance = this;

        const wp = this.spawnCollider.node.worldPosition;
        const size = this.spawnCollider.size;
        this.spawnRect.size = new Size(size.x, size.z);
        this.spawnRect.center = v2(wp.x, wp.z);

        //1.加载资源
        ActorManager.instance.init(() => {
            EffectManager.instance.init(() => {
                //TODO:UI动态加载起来
                //加载特效和音频
                AudioManager.instance.Init(() => {
                    this.startSpawnTimer();
                });

            })
        });

    }

    onDestory() {
        Level._instance = null;
        ActorManager.instance.destory();
        EffectManager.instance.destory();
        AudioManager.instance.destroy();
        this.unscheduleAllCallbacks();
    }


    startSpawnTimer() {
        this.schedule(() => {
            this.randomSpawn()
        }, 1.0, macro.REPEAT_FOREVER, 3)

        this.schedule(() => {
            this.baseHp *= 1.2;
        }, 20, macro.REPEAT_FOREVER);
    }

    randomSpawn() {
        if (ActorManager.instance.enemies.length >= this.maxAlive) {
            return;
        }

        // if (ActorManager.instance.playActor.dead) {
        //     return;
        // }

        // this.spawnPos.x = randomRange(this.spawnRect.xMin,
        //     this.spawnRect.xMax);
        // this.spawnPos.z = randomRange(this.spawnRect.yMin,
        //     this.spawnRect.yMax);
        const player = ActorManager.instance.playActor;
        let attempts = 10;
        do {
            this.spawnPos.x = randomRange(this.spawnRect.xMin, this.spawnRect.xMax);
            this.spawnPos.z = randomRange(this.spawnRect.yMin, this.spawnRect.yMax);
            attempts--;
            if (player == null) {
                break;
            }
            const dx = this.spawnPos.x - player.node.worldPosition.x;
            const dz = this.spawnPos.z - player.node.worldPosition.z;
            if (dx * dx + dz * dz >= this.minSpawnDistance * this.minSpawnDistance) {
                break;
            }
        } while (attempts > 0);
        this.doSpawn(this.spawnPos);
    }

    doSpawn(spawnPoint: Vec3) {
        let node = ActorManager.instance.createEnemy();
        node.worldPosition = spawnPoint;
        director.getScene()?.addChild(node);


        let actor = node.getComponent(Actor);
        actor.actorProperty.maxHp = this.baseHp;
        actor.actorProperty.hp = this.baseHp;
        actor.respawn();
        let scale = randomRange(1.0, 2.0);
        node.setWorldScale(scale, scale, scale);

        let rigidbody = node.getComponent(RigidBody);
        rigidbody.mass = scale;
    }
}


