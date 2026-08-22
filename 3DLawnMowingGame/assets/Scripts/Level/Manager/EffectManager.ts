import { Prefab, resources, Vec3, instantiate, director, Node, ParticleSystem } from "cc";
import { Pools } from "../../Utils/Pools";

export class EffectManager {
    static _instance: EffectManager;
    static get instance(): EffectManager {
        if (this._instance == null) {
            this._instance = new EffectManager();
        }
        return this._instance;
    }

    //数据
    pools: Pools<string, Node> = new Pools();

    init(onComplete: () => void) {
        resources.loadDir('effect/prefab', Prefab, (err: Error, prefabs: Prefab[]) => {
            for (let prefab of prefabs) {
                this.pools.newPool(prefab.name, (): Node => {
                    let node = instantiate(prefab);
                    director.getScene().addChild(node);
                    node.active = false;
                    return node;
                }, 10, (node: Node) => {
                    node.removeFromParent();
                })
            }
            onComplete();
        })
    }

    destory() {
        EffectManager._instance = null;
        this.pools.destroyAll();
    }

    play(key: string, position: Vec3) {
        let node = this.pools.allocc(key);
        node.active = true;
        node.worldPosition = position;

        let particleSyetem = node.getComponent(ParticleSystem);
        particleSyetem.play();

        particleSyetem.schedule(() => {
            this.pools.free(key, node);
        }, particleSyetem.duration);
    }
}