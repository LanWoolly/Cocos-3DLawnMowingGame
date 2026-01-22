import { Vec3, v3 } from "cc";

export class MathUtil {
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


