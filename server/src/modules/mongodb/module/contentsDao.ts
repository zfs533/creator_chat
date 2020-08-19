let Mongoose = require('mongoose');
import { Schema, Model } from 'mongoose';
import MongodbUtil from '../mongodbUtil';
import Logger from '../../utils/logger';


export interface ContentsModule {
    userId: number,
    friendId: number,
    uName: string,
    fName: string,
    content: string,
    isGroup: number,
    groupId?: number,
    time?: string,
}

export default class ContentScheme {
    private static _instance: ContentScheme;
    public static get Inst(): ContentScheme {
        if (!this._instance) {
            this._instance = new ContentScheme();
        }
        return this._instance;
    }

    public model: Model;
    public async init(): Promise<any> {
        //_id:Number
        let contentSchema = new Schema({
            userId: { type: Number, default: 0, index: true },
            friendId: { type: Number, default: 0, index: true },
            uName: { type: String, required: true },
            fName: { type: String, required: true },
            content: String,
            isGroup: { type: Number, default: 0 },
            groupId: { type: Number, default: 0 },
            time: { type: String, default: new Date().getTime() + "" },
        }, { versionKey: false });

        this.model = Mongoose.model('contents', contentSchema);
        await MongodbUtil.Inst.createCollection(this.model, 'contents');
    }

    async insertOne(data: ContentsModule): Promise<any> {
        data.time = new Date().getTime() + "";
        await MongodbUtil.Inst.insertMany(this.model, [data]);
    }

    async findMany(userId: number, friendId: number): Promise<any> {
        let conditions: any = { "$or": [{ userId: userId, friendId: friendId, isGroup: 0 }, { userId: friendId, friendId: userId, isGroup: 0 }] }
        return await MongodbUtil.Inst.findMany(this.model, conditions);
    }
    async findManyGroup(pid: Number): Promise<any> {
        let conditions: any = { groupId: pid, isGroup: 1 }
        Logger.info(conditions);
        return await MongodbUtil.Inst.findMany(this.model, conditions);
    }
}
