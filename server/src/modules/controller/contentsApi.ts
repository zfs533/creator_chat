import { ChatReq, ChatRes, HistoryReq } from "../utils/globalUtils";
import ContentScheme, { ContentsModule } from "../mongodb/module/contentsDao";
import { ModelAny } from "../mongodb/mongodbUtil";
import UserScheme from "../mongodb/module/userDao";
import FriendScheme from "../mongodb/module/friendsDao";
import ClientSocket from "../net/clientSocket";
import ClientManager from "../common/clientManager";
import { Router } from "./routers";
import Logger from "../utils/logger";

class ContentsApi {
    async handleChat(data: ChatReq) {
        let uDt: ModelAny = await UserScheme.Inst.findOne({ pid: data.userId });
        let fDt: ModelAny;
        if (data.isGroup > 0) {
            fDt = await UserScheme.Inst.findOne({ pid: data.userId });
        }
        else {
            fDt = await UserScheme.Inst.findOne({ pid: data.friendId });
        }
        let cDt: ContentsModule = {
            userId: data.userId,
            friendId: data.friendId,
            uName: uDt.msg.name,
            fName: fDt.msg.name,
            content: data.content,
            isGroup: data.isGroup,
            groupId: data.groupId,
        }
        await ContentScheme.Inst.insertOne(cDt);
        if (data.isGroup > 0) {
            //消息群发
            let socketList: ClientSocket[] = ClientManager.Instance.getAllClientSocket(data.userId);
            let reDate: ChatRes = {
                userId: data.userId,
                uName: uDt.msg.name,
                content: data.content,
                time: new Date().getTime() + "",
                groupId: data.groupId,
            }
            let dt: ModelAny = { code: 200, msg: reDate };
            for (let i = 0; i < socketList.length; i++) {
                socketList[i].sendMsg(Router.rut_chat, dt);
            }
        }
        else {
            /* 将聊天信息发送给对方 */
            let socket: ClientSocket = ClientManager.Instance.getClientSocketByPid(data.friendId);
            if (socket) {
                let reDate: ChatRes = {
                    userId: data.userId,
                    uName: uDt.msg.name,
                    content: data.content,
                    time: new Date().getTime() + "",
                    groupId: 0,
                }
                let dt: ModelAny = { code: 200, msg: reDate };
                socket.sendMsg(Router.rut_chat, dt);
                return;
            }
            Logger.info("------对方不在线------");
            Logger.info(cDt);
        }
    }

    async getHistoryRecord(req: HistoryReq): Promise<ModelAny> {
        if (req.isGroup > 0) {
            return await ContentScheme.Inst.findManyGroup(req.groupId);
        }
        else {
            console.log(req.userId, req.friendId);
            return await ContentScheme.Inst.findMany(req.userId, req.friendId);
        }
    }
}

export const contentApi = new ContentsApi();