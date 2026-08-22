export class ActorProperty {
    projectileCount: number = 1;

    //穿透
    peneration: number = 0;
    //追踪几率
    chaseRate: number = 0;
    maxHp: number = 100;
    hp: number = this.maxHp;

    attack: number = 10;
    //经验
    exp: number = 0;
    //本级升级最大经验
    maxExp: number = 10;
    level: number = 1;
}

