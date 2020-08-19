import Bottom from "./bottom";
import { UserModule } from "../net/globalUtils";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ChatNode extends cc.Component {

    @property(cc.Node)
    userNode: cc.Node = null;

    @property(Bottom)
    botton: Bottom = null;

    @property(cc.Label)
    fName: cc.Label = null;

    public friendId: number = 0;
    private data: UserModule = null;
    onLoad() {
        this.initProperty();
    }
    start() { }

    private initProperty(): void {

    }

    showUI(data?: UserModule) {
        if (data) {
            this.data = data;
        }
        this.setInfo();
        cc.tween(this.node).to(0.3, { x: 0 }).start();
        cc.tween(this.userNode).to(0.3, { x: -650 }).start();
    }

    setInfo() {
        if (this.botton.isGroup) {
            this.fName.string = "群聊";
        }
        else {
            this.fName.string = this.data.name;
            this.botton.friendPid = this.data.pid;
        }
    }

    hideNode() {
        cc.tween(this.node).to(0.3, { x: 650 }).start();
        cc.tween(this.userNode).to(0.3, { x: 0 }).start();
        this.botton.isGroup = 0;
        this.botton.groupId = 0;
    }
}
