import { find, instantiate, Node, Prefab, resources,warn } from "cc";

export enum DialogDef {
    UISetting = 'UISetting',
    UISkillUpGrade = 'UISkillUpGrade',
    UIDead = 'UIDead',
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
        if (this.uiRoot == null || !this.uiRoot.isValid)
            this.uiRoot = find("UIRoot");

        if (this.panels.has(name)) {
            let panel = this.panels.get(name);
           if (panel && panel.isValid){
                panel.active = true;

            if (bringToTop) {
                const index = panel.parent.children.length - 1;
                panel.setSiblingIndex(index);
            }
            return;
        }else{
            this.panels.delete(name);
        }
        }

        resources.load("UI/Prefab/" + name, Prefab, (err: Error, data: Prefab) => {
   // 防御性校验：资源加载失败或uiRoot失效时不能继续
    const loadPath = "UI/Prefab/" + name;
            if (err || !data) {
                warn(`[UIManager] Failed to load UI prefab at "${loadPath}":`,
                    err ? (err as Error).message : "prefab is null/undefined");
                return;
            }

   // 重新获取 uiRoot（场景可能已切换）
            if (this.uiRoot == null || !this.uiRoot.isValid) {
                this.uiRoot = find("UIRoot");
            }
            if (this.uiRoot == null || !this.uiRoot.isValid) {
                warn(`[UIManager] uiRoot is null or invalid, cannot attach panel "${name}".`);
                return;
            }

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
          // 失效节点直接从缓存清除
        if (panel && !panel.isValid) {
            this.panels.delete(name);
            return;
        }
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

    cleanUp() {
        // 不主动销毁面板节点（场景销毁会统一处理），只清缓存
        this.panels.clear();
        this.uiRoot = null;
        UIManager._instance = null;
    }
}

