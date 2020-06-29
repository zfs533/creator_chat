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
        let fDt: ModelAny = await UserScheme.Inst.findOne({ pid: data.friendId });
        let cDt: ContentsModule = {
            userId: data.userId,
            friendId: data.friendId,
            uName: uDt.msg.name,
            fName: fDt.msg.name,
            content: data.content,
        }
        await ContentScheme.Inst.insertOne(cDt);
        /* 将聊天信息发送给对方 */
        let socket: ClientSocket = ClientManager.Instance.getClientSocketByPid(data.friendId);
        if (socket) {
            let reDate: ChatRes = {
                userId: data.userId,
                uName: uDt.msg.name,
                content: data.content,
                time: new Date(),
            }
            let dt: ModelAny = { code: 200, msg: reDate };
            socket.sendMsg(Router.rut_chat, dt);
            return;
        }
        Logger.info("------对方不在线------");
        Logger.info(cDt);
    }

    async getHistoryRecord(req: HistoryReq): Promise<ModelAny> {
        return await ContentScheme.Inst.findMany(req.userId, req.friendId);
    }
}

export const contentApi = new ContentsApi();