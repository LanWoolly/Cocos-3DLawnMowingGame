import { _decorator, Component, instantiate, Layout, Node, Prefab, resources, Sprite, SpriteFrame, Pool } from 'cc';
const { ccclass, property, requireComponent, } = _decorator;

const replace = new Map();
replace.set("/", "Slash");

@ccclass('UIImageLabel')
@requireComponent(Layout)
export class UIImageLabel extends Component {
    @property(Prefab) numberPrefab: Prefab = null;

    numberPool: Pool<Node> = null;
    layout: Layout = null;

    private _string: string = '';

    set string(val: string) {
        if (this._string == val)
            return;
        this._string = val;
        this.resetString();
    }

    get string(): string {
        return this._string;
    }

    start() {
        this.layout = this.node.getComponent(Layout);

        this.numberPool = new Pool<Node>((): Node => {
            let node = instantiate(this.numberPrefab);
            this.node.addChild(node);
            node.active = false;
            return node;
        }, 1, (node: Node) => {
            node.removeFromParent();
        })
    }

    protected onDestroy(): void {
        this.numberPool.destroy();
    }

    resetString() {
        this.clearString();

        let dir = "UI/art/num/";
        resources.loadDir(dir, () => {
            for (let i = 0; i < this.string.length; i++) {
                const char = this.string[i];

                let str = char.toString();
                if (replace.has(str)) {
                    str = replace.get(str);
                }

                const path = dir + str + "/spriteFrame";
                const spriteFrame = resources.get(path, SpriteFrame);

                let spriteNode = this.numberPool.alloc();
                spriteNode.active = true;
                spriteNode.setSiblingIndex(i);
                let sprite = spriteNode.getComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
            }
            this.layout.updateLayout();
        })
    }

    clearString() {
        for (let child of this.node.children) {
            child.active = false;
            this.numberPool.free(child);
        }
    }
}


