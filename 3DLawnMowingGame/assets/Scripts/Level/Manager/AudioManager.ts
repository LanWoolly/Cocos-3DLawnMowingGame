import { AudioSource, Prefab, resources, instantiate, director, warn, Node, AudioClip } from "cc";
import { ResourcesDefine } from "../../Resources/ResourcesDefine";
import { Setting } from "../../Config/Setting";

export class AudioManager {
    private static _instance: AudioManager;
    static get instance(): AudioManager {
        if (this._instance == null) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }

    bgm: AudioSource = null;
    sfx: AudioSource = null;

    hitClip: AudioClip = null;
    shootClip: AudioClip = null;

    private _bgmNode: Node = null;
    private _sfxNode: Node = null;

    Init(onComplete?:()=>void) {
          let pending = 4;
        const checkDone = () => {
            pending--;
            if (pending <= 0 && onComplete) {
                onComplete();
            }
        };
        resources.load(ResourcesDefine.Bgm, Prefab, (err: Error, prefab: Prefab) => {
           if (err || !prefab) {
                warn(`[AudioManager] Failed to load Bgm prefab "${ResourcesDefine.Bgm}":`, err?.message ?? "prefab is null/undefined");
                checkDone();
                return;
            }
            const node = instantiate(prefab);
            director.getScene().addChild(node);
            this._bgmNode = node;
            this.bgm = node.getComponent(AudioSource);
            this.bgm.volume = Setting.instance.bgmVolume;
            checkDone();
        })

        resources.load(ResourcesDefine.Sfx, Prefab, (err: Error, prefab: Prefab) => {
            let node = instantiate(prefab);
            director.getScene().addChild(node);
            this.sfx = node.getComponent(AudioSource);
            this.sfx.volume = Setting.instance.sfxVolume;
            checkDone();

        })

        resources.load(ResourcesDefine.HitClip, AudioClip, (err: Error, clip: AudioClip) => {
            this.hitClip = clip;
            checkDone();


        })

        resources.load(ResourcesDefine.ShootClip, AudioClip, (err: Error, clip: AudioClip) => {
            this.shootClip = clip;
            checkDone();

        })

        
    }

    destroy() {

    }

    playSfx(clip: AudioClip) {
        this.sfx.volume = Setting.instance.sfxVolume;
        this.sfx.playOneShot(clip);
    }

    playHitSfx() {
        this.playSfx(this.hitClip);
    }

    playShootSfx() {
        this.playSfx(this.shootClip);
    }
}