import { ReqGroups } from "../utils/globalUtils";
import { getRandPid } from "../utils/utils";
import MongodbUtil, { ModelAny } from "../mongodb/mongodbUtil";
import GroupScheme from "../mongodb/module/groupDao";

class GroupsApi {
    /**
     * 创建一个群
     */
    async createGroups(): Promise<number> {
        return new Promise(async resolve => {
            let data: ReqGroups = {
                pid: getRandPid(),
                time: new Date().getTime() + "",
            }
            await GroupScheme.Inst.insertOne(data);
            resolve(data.pid)
        });
    }

    /**
     * 获取群列表
     * @param conditions 
     */
    async getGroupList(): Promise<ModelAny> {
        return await GroupScheme.Inst.findMany({});
    }

    /**
     * 获取群列表
     * @param conditions 
     */
    async getGroupByPid(pid: number): Promise<ModelAny> {
        return await GroupScheme.Inst.findMany({ pid: pid });
    }


}

export const groupsApi = new GroupsApi();