import { _decorator, CCFloat, Component, EventTouch, Input, input, math, Node, v3, Vec3 } from 'cc';
import { VirtualInput } from '../Input/VirtualInput';
const { ccclass, property } = _decorator;

@ccclass('UIJoyStick')
export class UIJoyStick extends Component {
    @property(Node) stickBg: Node = null;
    @property(Node) thumbnail: Node = null;
    @property({ type: CCFloat }) radius: number = 0;

    initPosition: Vec3 = v3();

    protected start(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.initPosition = this.stickBg.worldPosition.clone();
    }

    //鼠标、手指按下
    onTouchStart(eventTouch: EventTouch) {
        //将stick bg挪到鼠标按下的位置
        let x = eventTouch.touch.getUILocationX();
        let y = eventTouch.touch.getUILocationY();

        this.stickBg.setWorldPosition(x, y, 0);
    }

    //鼠标、手指滑动
    onTouchMove(eventTouch: EventTouch) {
        //移动thumbnail并限定位置
        let x = eventTouch.touch.getUILocationX();
        let y = eventTouch.touch.getUILocationY();

        let worldPosition = v3(x, y, 0);
        let localPosition = v3();

        this.stickBg.inverseTransformPoint(localPosition, worldPosition);
        let len = localPosition.length();
        localPosition.normalize();

        localPosition.multiplyScalar(math.clamp(len, 0, this.radius));
        this.thumbnail.setPosition(localPosition);

        VirtualInput.horizontal = this.thumbnail.position.x / this.radius;
        VirtualInput.vertical = this.thumbnail.position.y / this.radius;


    }

    //取消或者停止滑动
    onTouchEnd() {
        this.stickBg.setWorldPosition(this.initPosition);
        this.thumbnail.setPosition(Vec3.ZERO);

        VirtualInput.horizontal = 0;
        VirtualInput.vertical = 0;
    }
}


