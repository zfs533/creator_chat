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

    sendContent(): void {
        let date = new Date();
        let time = date.getFullYear() + ":" + (date.getMonth() + 1) + ":" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        let str = time + "::=>" + this.editbox.string;

        let dt: ChatReq = {
            userId: user.data.pid,
            friendId: this.friendPid,
            content: str,
        }
        let content = str;
        this.scrollContent.addItem(dt, true);
        Net.sendMsg(dt, Router.rut_chat);
        this.editbox.string = "";
        this.loading.showLoading();
    }
}
