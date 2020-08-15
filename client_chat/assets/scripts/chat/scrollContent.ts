import ChatItem from "./chatItem";
import EventManager from "../common/eventManager";
import { Router } from "../net/routers";
import { ModelAny, ChatRes, HistoryReq, ContentsModule } from "../net/globalUtils";
import Loading from "../common/loading";
import { user } from "../user/user";
import NodePool from "../common/nodePool";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ScrollContent extends cc.Component {

    @property(cc.Prefab)
    chatItem: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(Loading)
    loading: Loading = null;

    @property(cc.ScrollView)
    scrolView: cc.ScrollView = null;

    private itemlist: any[] = [];

    onLoad() {
        EventManager.Inst.registerEevent(Router.rut_chat, this.handleChat.bind(this), this);
        EventManager.Inst.registerEevent(Router.rut_chat_history, this.handleChatHistory.bind(this), this);
        NodePool.Instance.init();
    }

    addtest() {
        // test
        // for (let i = 0; i < 20; i++) {
        //     let str = "testtesttest交电费卡交电交电费卡交电交电费卡交电";
        //     this.addItem(str.substring(0, Math.floor(Math.random() * str.length)), false);
        //     this.addItem(str.substring(0, Math.floor(Math.random() * str.length)), true);
        // }
    }

    /**
     * 处理服务器返回
     * @param data 
     */
    handleChat(data: ModelAny) {
        console.log(data);
        this.loading.hideLoading();
        let dt: ChatRes = data.msg;
        if (dt.userId != user.data.pid) {
            this.addItem(dt, false);
        }
    }

    async addItem(data: any, isMe: boolean) {
        let item: cc.Node = NodePool.Instance.getNode(NodePool.CtItem);
        if (!item) {
            item = cc.instantiate(this.chatItem);
        }
        let script: ChatItem = item.getComponent(ChatItem);
        await script.setInfo({ content: data.content, userId: data.userId, friendId: data.friendId }, isMe);
        this.content.addChild(item);
        this.itemlist.push(item);
        this.scrolView.scrollToBottom(0.2);
    }

    /**
     * 处理历史消息
     * @param data 
     */
    handleChatHistory(data: ModelAny) {
        let list: ContentsModule[] = data.msg;
        console.log(list);
        // list.sort((a, b) => { return (new Date(a.time)).getTime() - (new Date(b.time)).getTime() });
        list.sort((a, b) => { return (Number(a.time)) - (Number(b.time)) });
        console.log(list);
        this.clearling();
        for (let i = 0; i < list.length; i++) {
            if (list[i].userId == user.data.pid) {
                this.addItem(list[i], true);
            }
            else {
                this.addItem(list[i], false);
            }
        }
    }

    clearling() {
        this.itemlist.forEach(item => {
            NodePool.Instance.putNode(item, NodePool.CtItem);
        });
        this.itemlist.splice(0);
    }
}
