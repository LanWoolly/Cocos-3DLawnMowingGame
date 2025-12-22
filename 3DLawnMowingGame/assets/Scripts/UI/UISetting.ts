import { _decorator, Component, Node, ProgressBar, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UISetting')
export class UISetting extends Component {
    sliderBgmVolume: Slider = null;
    progressbarBgmVolume: ProgressBar = null;
    sliderSfxVolume: Slider = null;
    progressbarSfxVolume: ProgressBar = null;

    start() {
        this.sliderBgmVolume = this.node.getChildByPath("Bgm").getComponent(Slider);
        this.progressbarBgmVolume = this.node.getChildByPath("Bgm/ProgressBar").getComponent(ProgressBar);
        this.sliderBgmVolume.node.on('slide', this.onBgmVolumeChanged, this);

        this.sliderSfxVolume = this.node.getChildByPath("Sfx").getComponent(Slider);
        this.progressbarSfxVolume = this.node.getChildByPath("Sfx/ProgressBar").getComponent(ProgressBar);
        this.sliderSfxVolume.node.on('slide', this.onSfxVolumeChanged, this);
    }

    onBgmVolumeChanged(value: Slider) {
        this.progressbarBgmVolume.progress = value.progress;
        //TODO:存储数据

    }

    onSfxVolumeChanged(value: Slider) {
        this.progressbarSfxVolume.progress = value.progress;
        //TODO:存储数据

    }
}


