import { _decorator, Component, director, instantiate, Node, Pool, Prefab } from 'cc';
import { Projectile } from './Projectile';
import { Events } from '../Events/Events';
const { ccclass, property } = _decorator;

@ccclass('ProjectileEmitter')
export class ProjectileEmitter extends Component {
    @property(Prefab)
    arrowPrefab: Prefab = null;

    pool: Pool<Node> = null;

    start() {
        this.pool = new Pool(
            () => {
                return instantiate(this.arrowPrefab);
            },
            10,
            (node: Node) => {
                node.removeFromParent();
            }
        )
    }

    onDestroy() {
        this.pool.destroy();
    }

    create(): Projectile {
        let node = this.pool.alloc();
        if (node.parent == null) {
            director.getScene().addChild(node);
        }
        let projectile = node.getComponent(Projectile);
        node.active = true;
        node.once(Events.OnProjectileDead, this.onProjectileDead, this);

        //重置投射物状态
        projectile.reset();
        return projectile;
    }

    onProjectileDead(projectile: Projectile) {
        projectile.node.active = false;
        this.pool.free(projectile.node);
    }
}


