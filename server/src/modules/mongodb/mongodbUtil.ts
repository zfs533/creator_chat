import ServerConfig from "../../config/config";
import TestScheme from "./module/testModel";
let Mongoose = require('mongoose');
import { Model } from 'mongoose';
import { resolve } from "dns";
import Logger from "../utils/logger";
import FriendScheme from "./module/friendsDao";
import UserScheme from "./module/userDao";
import ContentScheme from "./module/contentsDao";

export interface ModelAny {
    code?: number,
    msg?: any,
    err?: any,
}

export default class MongodbUtil {
    private static _instance: MongodbUtil;
    public static get Inst(): MongodbUtil {
        if (!this._instance) {
            this._instance = new MongodbUtil();
        }
        return this._instance;
    }

    public async init(): Promise<any> {
        return new Promise(async resolve => {
            await this.connectDb();
            resolve();
        });
    }

    private async connectDb(): Promise<any> {
        return new Promise(resolve => {
            let url = `mongodb://localhost:${ServerConfig.dbPort}/${ServerConfig.dbName}`;
            Mongoose.connect(url, { useNewUrlParser: true }, (err) => {
                if (!err) {
                    TestScheme.Inst.init();
                    UserScheme.Inst.init();
                    FriendScheme.Inst.init();
                    ContentScheme.Inst.init();
                    Logger.info("数据库连接成功:" + url);
                    resolve();
                }
                else {
                    console.log(err);
                }
            });
        });
    }

    /**
     * 创建一张表
     * @param model 
     * @param name 
     */
    public async createCollection(model: Model, name: string): Promise<any> {
        return new Promise(resolve => {
            model.createCollection().then(function (collection) {
                console.log(`Collection ${name} is created!`);
                resolve();
            });
        });
    }

    /**
     * 插入数据
     * @param model 
     * @param contents 
     * @param options 
     */
    public async insertMany(model: Model, contents: any[], options?: any): Promise<ModelAny> {
        return new Promise(resolve => {
            options = options ? options : {};
            model.insertMany(contents, options);
            let dt: ModelAny = {};
            dt.code = 200;
            resolve(dt);
        });
    }

    /**
     * 查寻一条数据
     * @param model 表对象
     * @param conditions 查询条件
     * @param sort 排序
     */
    public async findOne(model: Model, conditions: any, sort?: any): Promise<ModelAny> {
        return new Promise(resolve => {
            let data = model.findOne(conditions);
            data.exec((err, res) => {
                let dt: ModelAny = { msg: res, code: 200 }
                resolve(dt);
            });
        });
    }

    /**
     * 查询多条数据
     * @param model 表对象
     * @param conditions 查询条件
     * @param sort 排序
     */
    public async findMany(model: Model, conditions: any, sort?: any): Promise<ModelAny> {
        return new Promise(resolve => {
            let data = model.find(conditions);
            data.exec((err, res) => {
                let dt: ModelAny = { msg: res, code: 200 }
                resolve(dt);
            });
        });
    }

    /**
     * 删除一条数据
     * @param model 表对象
     * @param coditions 查询条件
     */
    public async deleteOne(model: Model, coditions: any): Promise<any> {
        return new Promise((resolve, reject) => {
            model.deleteOne(coditions);
            resolve();
        });
    }

    /**
     * 删除一组数据
     * @param model 表对象 
     * @param conditions 查询条件
     */
    public async deleteMany(model: Model, conditions: any): Promise<any> {
        return new Promise(resolve => {
            model.deleteMany(conditions);
            resolve();
        });
    }
}