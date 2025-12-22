import { find, instantiate, Node, Prefab, resources } from "cc";

export enum DialogDef {
    UISetting = 'UISetting',
    UISkillUpGrade = 'UISkillUpGrade',
}

export class UIManager {
    public static _instance: UIManager = null;
    static get instance(): UIManager {
        if (this._instance == null) {
            this._instance = new UIManager;
        }
        return this._instance;
    }

    uiRoot: Node = null;

    panels: Map<string, Node> = new Map();

    openPanel(name: string, bringToTop: boolean = true) {
        //加载面板
        if (this.uiRoot == null)
            this.uiRoot = find("UIRoot");

        if (this.panels.has(name)) {
            let panel = this.panels.get(name);
            panel.active = true;

            if (bringToTop) {
                const index = panel.parent.children.length - 1;
                panel.setSiblingIndex(index);
            }
            return;
        }

        resources.load("UI/Prefab/" + name, Prefab, (err: Error, data: Prefab) => {
            let panel = instantiate(data);
            this.panels.set(name, panel);
            this.uiRoot.addChild(panel);

            if (bringToTop) {
                const index = panel.parent.children.length - 1;
                panel.setSiblingIndex(index);
            }
        })
    }

    closePanel(name: string, destory: boolean = false) {
        if (!this.panels.has(name)) {
            return;
        }

        let panel = this.panels.get(name);
        if (destory) {
            this.panels.delete(name);
            panel.removeFromParent();
            return;
        }

        panel.active = false;
    }

    openDialog(name: string) {
        for (let dialogDef in DialogDef) {
            if (dialogDef == name) {
                this.openPanel(name);
            } else {
                this.closePanel(dialogDef);
            }

        }
    }

    closeDialog(destory: boolean = false) {
        for (let dialogDef in DialogDef) {
            this.closePanel(dialogDef, destory);
        }
    }
}

