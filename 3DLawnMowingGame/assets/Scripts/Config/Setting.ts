import { math, EventTarget } from 'cc';
import { PlayerPreference } from './PlayerPreference';

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

        //TODO:派发事件
        this.emit('onBgmVolumeChanged', this._bgmVolume);

    }

    get bgmVolume(): number {
        return this._bgmVolume;
    }

    private _sfxVolume: number = 1.0;
    set sfxVolume(value: number) {
        this._sfxVolume = value;
        PlayerPreference.setFloat("sfxVolume", this._sfxVolume);

        //TODO:派发事件
        //this.emit(...);

    }

    get sfxVolume(): number {
        return this._sfxVolume;
    }

    load() {
        this._bgmVolume = PlayerPreference.getFloat('bgmVolume');
        this._sfxVolume = PlayerPreference.getFloat('sfxVolume');
    }
}