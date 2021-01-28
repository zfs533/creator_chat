let Mongoose = require('mongoose');
import { Schema, Model } from 'mongoose';
import MongodbUtil, { ModelAny } from '../mongodbUtil';

export interface FriendsModule {
    friendId: number,
    userId: number,
    uName: string,
    fName: string,
    /* 好友类型 */
    type?: number,
    /* 好友分组 */
    groupId?: number,
    time?: Date
}


export default class FriendScheme {
    private static _instance: FriendScheme;
    public model: Model<any>;
    public static get Inst(): FriendScheme {
        if (!this._instance) {
            this._instance = new FriendScheme();
        }
        return this._instance;
    }

    public async init(): Promise<any> {
        //_id:Number
        let friendSchema = new Schema({
            friendId: { type: Number, default: 0, index: true },
            userId: { type: Number, default: 0, index: true },
            uName: { type: String, required: true },
            fName: { type: String, required: true },
            /* 好友类型 */
            type: { type: Number, default: 0 },
            /* 好友分组 */
            groupId: { type: Number, default: 0 },
            time: { type: Date, default: new Date() },
        }, { versionKey: false });

        this.model = Mongoose.model('friends', friendSchema);
        await MongodbUtil.Inst.createCollection(this.model, 'friends');
    }
    async getFriendList(userId: number): Promise<ModelAny> {
        return await MongodbUtil.Inst.findMany(this.model, { userId: userId });
    }

    async insertOne(data: FriendsModule): Promise<ModelAny> {
        return await MongodbUtil.Inst.insertMany(this.model, [data]);
    }
}
