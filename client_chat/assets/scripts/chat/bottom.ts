import ScrollContent from "./scrollContent";
import { ChatReq } from "../net/globalUtils";
import { user } from "../user/user";
import { Net } from "../net/net";
import { Router } from "../net/routers";
import Loading from "../common/loading";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Bottom extends cc.Component {

    @property(cc.EditBox)
    editbox: cc.EditBox = null;

    @property(cc.Button)
    sendBtn: cc.Button = null;

    @property(ScrollContent)
    scrollContent: ScrollContent = null;

    @property(Loading)
    loading: Loading = null;

    public friendPid: number = 0;
    /* 是否为群聊  */
    public isGroup: number = 0;
    public groupId: number = 0;

    sendContent(): void {
        let date = new Date();
        let time = date.getFullYear() + ":" + (date.getMonth() + 1) + ":" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        let str = "--------" + time + "--------\n" + this.editbox.string;

        let dt: ChatReq = {
            userId: user.data.pid,
            content: str,
            isGroup: this.isGroup,
            groupId: this.groupId,
        }
        if (this.isGroup > 0) {
            dt.friendId = 0;
        }
        else {
            dt.friendId = this.friendPid;
        }
        let content = str;
        this.scrollContent.addItem(dt, true);
        Net.sendMsg(dt, Router.rut_chat);
        this.editbox.string = "";
        this.loading.showLoading();
    }

    sendPhotos() {

    }
}
