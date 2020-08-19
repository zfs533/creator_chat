import { userMgr } from "./userMgr";
import ChatNode from "../chat/chatNode";
import { UserModule, HistoryReq, GroupModule } from "../net/globalUtils";
import { user } from "./user";
import { tips } from "../common/tip";
import { Net } from "../net/net";
import { Router } from "../net/routers";
import { getAvatar } from "../net/util";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GroupItem extends cc.Component {

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    lbcontent: cc.Label = null;

    @property(cc.Sprite)
    head: cc.Sprite = null;

    public chatNode: ChatNode;
    private data: GroupModule;

    onLoad() {
        this.initProperty();
    }

    private initProperty(): void {

    }

    setInfo(data: GroupModule) {
        this.data = data;
        userMgr.addToList(data);

        this.userName.string = "Group:" + data.pid;
        this.lbcontent.string = ""
        this.head.spriteFrame = getAvatar(data.pid);
    }

    handleTouch() {
        /* 请求历史消息 */
        let dt: HistoryReq = { isGroup: 1, groupId: this.data.pid }
        Net.sendMsg(dt, Router.rut_chat_history);

        this.chatNode.botton.isGroup = 1;
        this.chatNode.botton.groupId = this.data.pid
        this.chatNode.showUI();
    }
}
