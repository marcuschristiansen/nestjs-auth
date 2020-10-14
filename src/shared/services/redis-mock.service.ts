import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisMockService {
    private _storage: any;
    // eslint-disable-next-line no-useless-escape
    private readonly regex: RegExp = /[^\]\["."]+/g;

    constructor() {
        this._storage = {};
    }

    get storage(): any {
        return this._storage;
    }

    init(value: any = {}): void {
        this._storage = value;
    }

    dump(): void {
        console.log(this._storage);
    }

    async get(key: string, path?: string): Promise<any> {
        return new Promise((resolve) => {
            try {
                resolve(this.getPropertyPath(`["${key}"]${path || ''}`, this._storage));
            } catch {
                resolve(null);
            }
        });
    }

    async set(
        key: string,
        value: string | number | boolean | any | Array<any>,
        path?: string
    ): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(this.setPropertyPath(`["${key}"]${path || ''}`, this._storage, value));
        });
    }

    async delete(key: string, path?: string): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(this.deletePropertyPath(`["${key}"]${path || ''}`, this._storage));
        });
    }

    private getPropertyPath(path: string, obj: any) {
        return path.match(this.regex).reduce(function (prev, curr) {
            return prev ? prev[curr] : null;
        }, obj);
    }

    private setPropertyPath(path: string, obj: any, value: any): boolean {
        const a = path.match(this.regex);
        let o = obj;
        while (a.length - 1) {
            const n = a.shift();
            if (!(n in o)) {
                o[n] = {};
            }
            o = o[n];
        }
        o[a[0]] = value;
        return true;
    }

    private deletePropertyPath(path: string, obj: any): boolean {
        const a = path.match(this.regex);
        let o = obj;
        while (a.length - 1) {
            const n = a.shift();
            if (!(n in o)) {
                return false;
            }
            o = o[n];
        }
        if (!o[a[0]]) {
            return false;
        }
        delete o[a[0]];
        return true;
    }
}
