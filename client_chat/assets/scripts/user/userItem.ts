import { userMgr } from "./userMgr";
import UserNode from "../user/userNode";
import ChatNode from "../chat/chatNode";
import { UserModule, HistoryReq } from "../net/globalUtils";
import { user } from "./user";
import { tips } from "../common/tip";
import { Net } from "../net/net";
import { Router } from "../net/routers";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UserItem extends cc.Component {

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    lbcontent: cc.Label = null;

    public chatNode: ChatNode;
    private data: UserModule;

    onLoad() {
        this.initProperty();
    }

    private initProperty(): void {

    }

    setInfo(data: UserModule) {
        this.data = data;
        userMgr.addToList(data);

        this.userName.string = data.name;
        this.lbcontent.string = ""
    }

    handleTouch() {
        if (this.data.pid == user.data.pid) {
            tips.showTip("不能和自己聊天");
            return;
        }
        /* 请求历史消息 */
        let dt: HistoryReq = { userId: user.data.pid, friendId: this.data.pid }
        Net.sendMsg(dt, Router.rut_chat_history);

        this.chatNode.showUI(this.data);
    }
}
