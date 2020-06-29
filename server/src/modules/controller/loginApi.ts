import { resolve } from "dns";
import UserScheme, { UserModule } from "../mongodb/module/userDao";
import { LoginMap } from "../common/requestSchemaMap"
import { ModelAny } from "../mongodb/mongodbUtil";

class LoginApi {

    /**
     * 用户登录
     * @param act 
     * @param pwd 
     */
    async login(act: string, pwd: string): Promise<ModelAny> {
        let conditions = { name: act, pwd: pwd };
        return await UserScheme.Inst.findOne(conditions);
    }

    /**
     * 用户注册
     * @param act 
     * @param pwd 
     */
    async register(act: string, pwd: string): Promise<ModelAny> {
        return new Promise(async resolve => {
            let conditions: UserModule = { name: act, pwd: pwd };
            await UserScheme.Inst.insertOne(conditions);
            let data: ModelAny = await UserScheme.Inst.findOne(conditions);
            resolve(data);
        });
    }

    /**
     * 获取用户信息
     * @param pid 
     */
    async getUserInfo(pid: Number): Promise<ModelAny> {
        return await UserScheme.Inst.findOne({ pid: pid });
    }

    /**
     * 获取所有用户列表
     */
    async getUserList(): Promise<ModelAny> {
        return await UserScheme.Inst.findMany({});
    }
}

export const loginApi = new LoginApi();