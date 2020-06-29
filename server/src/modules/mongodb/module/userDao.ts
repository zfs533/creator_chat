let Mongoose = require('mongoose');
import { Schema, Model } from 'mongoose';
import MongodbUtil, { ModelAny } from '../mongodbUtil';
import Logger from '../../utils/logger';

export interface UserModule {
    pid?: number,
    name: string,
    pwd: string,
    nickName?: string,
    email?: string,
    phone?: number,
    sex?: number,
    time?: Date,
}

export default class UserScheme {
    private static _instance: UserScheme;
    public static get Inst(): UserScheme {
        if (!this._instance) {
            this._instance = new UserScheme();
        }
        return this._instance;
    }

    public model: Model;
    public async init(): Promise<any> {
        //_id:Number
        let userSchema = new Schema({
            pid: { type: Number, default: 0, index: true, unique: true },
            name: { type: String, required: true },
            nickName: { type: String, default: "..." },
            pwd: { type: String, required: true },
            email: { type: String, default: "..." },
            phone: { type: Number, default: 0 },
            sex: { type: Number, default: 0 },
            time: { type: Date, default: new Date() },
        }, { versionKey: false });
        this.model = Mongoose.model('userDao', userSchema);
        await MongodbUtil.Inst.createCollection(this.model, 'userDao');
    }

    public async findOne(conditions: any): Promise<ModelAny> {
        return new Promise(async resolve => {
            let data: ModelAny = await MongodbUtil.Inst.findOne(this.model, conditions);
            resolve(data);
        });
    }

    public async findMany(conditions: any): Promise<ModelAny> {
        return new Promise(async resolve => {
            let data: ModelAny = await MongodbUtil.Inst.findMany(this.model, conditions);
            resolve(data);
        });
    }

    public async insertOne(obj: UserModule): Promise<any> {
        return new Promise(async resolve => {
            obj.pid = Math.floor(Math.random() * 100000);
            await MongodbUtil.Inst.insertMany(this.model, [obj]);
            resolve();
        });
    }
}