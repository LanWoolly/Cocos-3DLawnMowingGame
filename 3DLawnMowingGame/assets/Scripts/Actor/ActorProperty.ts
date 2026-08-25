import { math } from "cc";

export class ActorProperty {
    projectileCount: number = 1;

    //穿透
    peneration: number = 0;
    //追踪几率
    chaseRate: number = 0;
    maxHp: number = 10;
    hp: number = this.maxHp;

    attack: number = 5;
    //经验
    exp: number = 0;
    //本级升级最大经验
    maxExp: number = 10;
    level: number = 1;

    //获取血量百分比
    get hpPercent(): number {
        return math.clamp01(this.hp / this.maxHp);
    }

    //获取经验百分比
    get expPercent(): number {
        return math.clamp01(this.exp / this.maxExp);
    }
}

