let Mongoose = require('mongoose');
import { Schema, Model } from 'mongoose';
import MongodbUtil from '../mongodbUtil';


export interface ContentsModule {
    userId: number,
    friendId: number,
    uName: string,
    fName: string,
    content: string,
    time?: Date,
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
            time: { type: Date, default: new Date() },
        }, { versionKey: false });

        this.model = Mongoose.model('contents', contentSchema);
        await MongodbUtil.Inst.createCollection(this.model, 'contents');
    }

    async insertOne(data: ContentsModule): Promise<any> {
        await MongodbUtil.Inst.insertMany(this.model, [data]);
    }

    async findMany(userId: number, friendId: number): Promise<any> {
        let conditions: any = { "$or": [{ userId: userId, friendId: friendId }, { userId: friendId, friendId: userId }] }
        return await MongodbUtil.Inst.findMany(this.model, conditions);
    }
}
