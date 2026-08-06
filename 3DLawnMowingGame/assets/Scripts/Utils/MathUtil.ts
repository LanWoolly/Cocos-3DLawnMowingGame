import { Vec3, v3 } from "cc";

let tempVec: Vec3 = v3();
let tempVec2: Vec3 = v3();
let tempVec3: Vec3 = v3();

export class MathUtil {

    /**
     * 使forward绕axis轴旋转maxAngleDelta(弧度)  罗德里格斯公式
     * @param out 
     * @param forward 
     * @param axis 
     * @param maxAngleDelta 
     */
    static rotateAround(out: Vec3, forward: Vec3, axis: Vec3, maxAngleDelta: number) {
        //forward = v
        //axis = u
        //out = v*cos+ uxv*sin+(u*v)*u*(1-cos);    x=>叉乘
        const cos = Math.cos(maxAngleDelta);
        const sin = Math.sin(maxAngleDelta);
        //v*cos
        Vec3.multiplyScalar(tempVec, forward, cos);

        //u x v
        Vec3.cross(tempVec2, axis, forward);

        //v*cos +uxv*sin
        Vec3.scaleAndAdd(tempVec3, tempVec, tempVec2, sin);

        const dot = Vec3.dot(axis, forward);
        Vec3.scaleAndAdd(out, tempVec3, axis, dot * (1.0 - cos));
    }

    static rotateToward(out: Vec3, from: Vec3, to: Vec3, maxAngleDelta: number) {
        //up
        Vec3.cross(tempVec, from, to);

        this.rotateAround(out, from, tempVec, maxAngleDelta);
    }

    /**
     * 带符号的两个向量的夹角
     * @param from 
     * @param to 
     * @param axis 指定旋转轴
     * @returns 
     */
    static signAngle(from: Vec3, to: Vec3, axis: Vec3): number {
        const angle = Vec3.angle(from, to);

        let cross = v3();
        Vec3.cross(cross, from, to);

        const sign = Math.sign(cross.x * axis.x + cross.y * axis.y + cross.z * axis.z);
        return angle * sign;
    }
}


