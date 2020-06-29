let Mongoose = require('mongoose');
import { Schema, Model } from 'mongoose';
import MongodbUtil from '../mongodbUtil';

export interface TestModule {
    name: string,
    mail: string,
    date: number,
}

export default class TestScheme {
    private static _instance: TestScheme;
    public static get Inst(): TestScheme {
        if (!this._instance) {
            this._instance = new TestScheme();
        }
        return this._instance;
    }

    public model: Model;

    public async init(): Promise<any> {
        //_id:Number
        let testSchema = new Schema({
            name: String,
            mail: String,
            date: String,
        }, { versionKey: false });

        this.model = Mongoose.model('testDao', testSchema);
        await MongodbUtil.Inst.createCollection(this.model, 'testDao');
        // let data: TestModule = {
        //     name: "156465",
        //     mail: "testmailsishljsdf@gmail.com",
        //     date: new Date().getTime()
        // }
        // await this.insertOne(data);
    }

    public async insertOne(contents: TestModule): Promise<any> {
        await MongodbUtil.Inst.insertMany(this.model, [contents]);
    }
}