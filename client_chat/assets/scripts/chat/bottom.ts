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

        let dt: ChatReq = {
            userId: user.data.pid,
            friendId: this.friendPid,
            content: this.editbox.string,
        }
        let content = this.editbox.string;
        this.scrollContent.addItem(content, true);
        Net.sendMsg(dt, Router.rut_chat);
        this.loading.showLoading();
    }
}
