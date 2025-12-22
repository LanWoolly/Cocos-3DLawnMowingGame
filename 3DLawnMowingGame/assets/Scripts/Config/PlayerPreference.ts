import { sys } from "cc";

export class PlayerPreference {
    static setFloat(key: string, value: number) {
        sys.localStorage.setItem(key, value.toString());
    }

    static getFloat(key: string): number {
        let str = sys.localStorage.getItem(key);
        return Number.parseFloat(str);
    }
}