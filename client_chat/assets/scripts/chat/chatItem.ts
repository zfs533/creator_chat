import { getAvatar } from "../net/util";
import { user } from "../user/user";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ChatItem extends cc.Component {

    @property(cc.Node)
    selfNode: cc.Node = null;

    @property(cc.Label)
    labelRight: cc.Label = null;

    @property(cc.Node)
    qiPaoRight: cc.Node = null;

    @property(cc.Node)
    okRight: cc.Node = null;

    @property(cc.Node)
    iconRight: cc.Node = null;

    @property(cc.Label)
    labelLeft: cc.Label = null;

    @property(cc.Node)
    qiPaoLeft: cc.Node = null;

    @property(cc.Node)
    okLeft: cc.Node = null;

    @property(cc.Node)
    iconLeft: cc.Node = null;

    onLoad() {
        this.initProperty();
    }

    start() {
        // let str = "交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电交电费卡交电";
        // this.setInfo({ content: str.substring(0, Math.floor(Math.random() * str.length)) }, false);
        // this.setInfo({ content: str.substring(0, Math.floor(Math.random() * str.length)) }, true);
    }

    private initProperty(): void {
        // this.successOk.active = false;
    }

    async setInfo(data: any, isMe: boolean) {
        console.log(`${isMe} ${data.friendId} ${data.userId}`)
        return new Promise(resolve => {
            if (isMe) {
                this.iconLeft.active = false;
                this.qiPaoLeft.active = false;
                this.iconRight.active = true;
                this.qiPaoRight.active = true;
                this.labelRight.string = data.content;
                this.labelRight._forceUpdateRenderData(true);
                this.qiPaoRight.height = this.labelRight.node.height + 5;
                this.selfNode.height = this.qiPaoRight.height + 10 + 30;
                this.iconRight.getComponent(cc.Sprite).spriteFrame = getAvatar(user.data.pid);
            }
            else {
                this.iconRight.active = false;
                this.qiPaoRight.active = false;
                this.iconLeft.active = true;
                this.qiPaoLeft.active = true;

                this.labelLeft.string = data.content;
                this.labelLeft._forceUpdateRenderData(true);
                this.qiPaoLeft.height = this.labelLeft.node.height + 5;
                this.selfNode.height = this.qiPaoLeft.height + 10 + 30;
                this.iconLeft.getComponent(cc.Sprite).spriteFrame = getAvatar(data.userId);
            }
            resolve();
        });
    }
}
