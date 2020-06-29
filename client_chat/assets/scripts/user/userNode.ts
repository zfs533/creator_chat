import UserItem from "./userItem";
import ChatNode from "../chat/chatNode";
import { user } from "./user";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UserNode extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Prefab)
    userItem: cc.Prefab = null;

    @property(ChatNode)
    chatNode: ChatNode = null;

    @property(cc.Node)
    content: cc.Node = null;

    onLoad() {
    }

    init() {
        this.node.opacity = 0;
        let fadeIn = cc.fadeIn(0.2);
        cc.tween(this.node).then(fadeIn).start();
        this.setData();
    }

    private setData(): void {
        this.nameLabel.string = user.data.name;
        let pList = user.userlist;
        for (let i = 0; i < pList.length; i++) {
            let item: cc.Node = cc.instantiate(this.userItem);
            let script = item.getComponent(UserItem);
            script.chatNode = this.chatNode;
            script.setInfo(pList[i])
            this.content.addChild(item);
        }
    }

}
