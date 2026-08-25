import { math, EventTarget } from 'cc';
import { PlayerPreference } from './PlayerPreference';
import { Events } from '../Events/Events';

export class Setting extends EventTarget {
    private static _instance: Setting = null;
    static get instance(): Setting {
        if (this._instance == null) {
            this._instance = new Setting();
        }
        return this._instance;
    }

    private _bgmVolume: number = 1.0;

    set bgmVolume(value: number) {
        this._bgmVolume = math.clamp01(value);
        PlayerPreference.setFloat("bgmVolume", value);

        //派发事件
        this.emit(Events.OnBgmVolumeChanged, this._bgmVolume);

    }

    get bgmVolume(): number {
        return this._bgmVolume;
    }

    private _sfxVolume: number = 1.0;
    set sfxVolume(value: number) {
        this._sfxVolume = math.clamp01(value);
        PlayerPreference.setFloat("sfxVolume", this._sfxVolume);

        //派发事件
        this.emit(Events.OnSfxVolumeChanged, this._sfxVolume);
    }

    get sfxVolume(): number {
        return this._sfxVolume;
    }

    load() {
        this._bgmVolume = PlayerPreference.getFloat('bgmVolume');
        if (isNaN(this._bgmVolume)) {
            this._bgmVolume = 1.0;
        }
        this._sfxVolume = PlayerPreference.getFloat('sfxVolume');
        if (isNaN(this._sfxVolume)) {
            this._sfxVolume = 1.0;
        }
    }
}