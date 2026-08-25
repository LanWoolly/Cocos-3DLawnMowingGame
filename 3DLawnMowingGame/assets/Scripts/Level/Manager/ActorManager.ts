import { Pool, Prefab, resources, Node, randomRangeInt, instantiate, director, Animation, SkeletalAnimationState } from "cc";
import { Actor } from "../../Actor/Actor";
import { Events } from "../../Events/Events";
import { StateDefine } from "../../Actor/StateDefine";
import { EffectManager } from "./EffectManager";
import { ResourcesDefine } from "../../Resources/ResourcesDefine";

export class ActorManager {
    static _instance: ActorManager;
    static get instance(): ActorManager {
        if (this._instance == null) {
            this._instance = new ActorManager();
        }
        return this._instance;
    }

    //主角
    playActor: Actor = null;
    enemies: Array<Node> = [];
    enemyPool: Pool<Node> = null;

    init(onComplete: () => void) {
        resources.loadDir("Actor/Enemy", Prefab, (err: Error, prefabs: Prefab[]) => {
            if (err) {
                throw err;
            }
            this.enemyPool = new Pool<Node>(
                (): Node => {
                    let prefab = prefabs[randomRangeInt(0, prefabs.length)];
                    let node = instantiate(prefab);
                    // director.getScene().addChild(node);
                    node.active = false;
                    return node;
                }, 10,
                (node: Node) => {
                    node.removeFromParent();
                }
            )
            onComplete();
        })
    }

    destory() {
        this.enemyPool.destroy();
        this.enemyPool = null;
        this.enemies = [];
        ActorManager._instance = null;
    }

    createEnemy(): Node {
        let node = this.enemyPool.alloc();
        node.active = true;
        this.enemies.push(node);
        node.once(Events.OnDie, this.OnEnemyDie, this);
        return node;
    }

    OnEnemyDie(node: Node) {
        const index = this.enemies.indexOf(node);
        this.enemies.splice(index, 1);
        let actor = node.getComponent(Actor);
        actor.skeletalAnimation.on(Animation.EventType.FINISHED,
            (type: Animation.EventType, state: SkeletalAnimationState) => {
                if (state.name == StateDefine.Die) {
                    this.enemyPool.free(node);
                    node.active = false;
                }

                //死亡特效
                EffectManager.instance.play(ResourcesDefine.EffDie, node.worldPosition);
            })
    }

    get randomEnemy() {
           if (!this.enemies || this.enemies.length == 0) {
            return null;
        }
        return this.enemies[randomRangeInt(0, this.enemies.length)];
    }
}


