import { AudioSource, Prefab, resources, instantiate, director, _decorator, warn, Node, AudioClip, CCClass, Component, settings } from "cc";
import { ResourcesDefine } from "../../Resources/ResourcesDefine";
import { Setting } from "../../Config/Setting";
import { Events } from "../../Events/Events";
const { ccclass, property } = _decorator;


@ccclass('AudioManager')
export class AudioManager extends Component {
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

    onLoad() {
        AudioManager._instance = this;
        Setting.instance.on(Events.OnBgmVolumeChanged, this.onBgmVolumeChanged, this);
        Setting.instance.on(Events.OnSfxVolumeChanged, this.onSfxVolumeChanged, this);
    }

    onDestroy() {
        this.cleanUp();
    }

    Init(onComplete?: () => void) {
        // 关键修复：onLoad 在“new 出来的单例”上不会被引擎调用，
        // 因此事件订阅必须放在一定会被调用的 Init 中，否则滑动音量条时
        // Setting 派发的事件无人监听，bgm/sfx 音量永远不变。
        // 采用 off-then-on 防止重复订阅（即便组件也作为场景节点存在、onLoad 也注册过）。
        Setting.instance.off(Events.OnBgmVolumeChanged, this.onBgmVolumeChanged, this);
        Setting.instance.off(Events.OnSfxVolumeChanged, this.onSfxVolumeChanged, this);
        Setting.instance.on(Events.OnBgmVolumeChanged, this.onBgmVolumeChanged, this);
        Setting.instance.on(Events.OnSfxVolumeChanged, this.onSfxVolumeChanged, this);

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

    pauseSfx() {
        this.sfx.pause();
    }

    pauseBgm() {
        this.bgm.pause();
    }

    onBgmVolumeChanged() {
        if (this.bgm) {
            this.bgm.volume = Setting.instance.bgmVolume;
        }
    }

    onSfxVolumeChanged() {
        if (this.sfx) {
            this.sfx.volume = Setting.instance.sfxVolume;
        }
    }

    cleanUp() {
        AudioManager._instance = null;
        Setting.instance.off(Events.OnSfxVolumeChanged, this.onSfxVolumeChanged, this);
        Setting.instance.off(Events.OnBgmVolumeChanged, this.onBgmVolumeChanged, this);
    }
}