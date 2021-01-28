let Mongoose = require('mongoose');
import { Schema, Model } from 'mongoose';
import MongodbUtil, { ModelAny } from '../mongodbUtil';


export interface GroupModule {
    pid: number,
    time?: string
}

export default class GroupScheme {
    private static _instance: GroupScheme;
    public static get Inst(): GroupScheme {
        if (!this._instance) {
            this._instance = new GroupScheme();
        }
        return this._instance;
    }
    public model: Model<any>;
    public async init(): Promise<any> {
        let groupSchema = new Schema({
            pid: { type: Number, default: 0, index: true },
            time: { type: String, default: new Date().getTime() + "" },
        }, { versionKey: false });

        this.model = Mongoose.model('groups', groupSchema);
        await MongodbUtil.Inst.createCollection(this.model, 'groups');
    }

    async insertOne(data: GroupModule): Promise<any> {
        data.time = new Date().getTime() + "";
        await MongodbUtil.Inst.insertMany(this.model, [data]);
    }

    async findMany(conditions: any): Promise<ModelAny> {
        return new Promise(async resolve => {
            let data: ModelAny = await MongodbUtil.Inst.findMany(this.model, conditions);
            resolve(data);
        });
    }
}