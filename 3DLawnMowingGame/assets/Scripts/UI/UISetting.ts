import { _decorator, Component, Node, ProgressBar, Slider, Button, math, settings } from 'cc';
import { Setting } from '../Config/Setting';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('UISetting')
export class UISetting extends Component {
    sliderBgmVolume: Slider = null;
    progressbarBgmVolume: ProgressBar = null;
    sliderSfxVolume: Slider = null;
    progressbarSfxVolume: ProgressBar = null;
    btnClose: Node = null;

    start() {
        this.sliderBgmVolume = this.node.getChildByPath("Bgm").getComponent(Slider);
        this.progressbarBgmVolume = this.node.getChildByPath("Bgm/ProgressBar").getComponent(ProgressBar);
        this.sliderBgmVolume.node.on('slide', this.onBgmVolumeChanged, this);

        this.sliderSfxVolume = this.node.getChildByPath("Sfx").getComponent(Slider);
        this.progressbarSfxVolume = this.node.getChildByPath("Sfx/ProgressBar").getComponent(ProgressBar);
        this.sliderSfxVolume.node.on('slide', this.onSfxVolumeChanged, this);

        this.progressbarBgmVolume.progress = Setting.instance.bgmVolume;
        this.progressbarSfxVolume.progress = Setting.instance.sfxVolume;
        this.sliderBgmVolume.progress = Setting.instance.bgmVolume;
        this.sliderSfxVolume.progress = Setting.instance.sfxVolume;

        this.btnClose = this.node.getChildByName("Button");
        this.btnClose.on(Button.EventType.CLICK, this.onClose, this);
    }

    onDisable() {
        this.btnClose?.off(Button.EventType.CLICK, this.onClose, this);
    }

    onBgmVolumeChanged(value: Slider) {
        this.progressbarBgmVolume.progress = value.progress;
        //存储数据
        Setting.instance.bgmVolume = math.clamp01(value.progress);
    }

    onSfxVolumeChanged(value: Slider) {
        this.progressbarSfxVolume.progress = value.progress;
        //存储数据
        Setting.instance.sfxVolume = math.clamp01(value.progress);
    }

    onClose() {
        UIManager.instance.closePanel(this.node.name, false);
    }
}


