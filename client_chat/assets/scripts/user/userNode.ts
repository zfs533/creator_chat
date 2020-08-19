import UserItem from "./userItem";
import ChatNode from "../chat/chatNode";
import { user } from "./user";
import { getAvatar } from "../net/util";
import { Net } from "../net/net";
import { Router } from "../net/routers";
import { HistoryReq, ReqGroups, ModelAny } from "../net/globalUtils";
import Loading from "../common/loading";
import EventManager from "../common/eventManager";
import { ErrEnum } from "../net/err";
import { tips } from "../common/tip";
import GroupItem from "./groupItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UserNode extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Prefab)
    userItem: cc.Prefab = null;

    @property(cc.Prefab)
    groupItem: cc.Prefab = null;

    @property(ChatNode)
    chatNode: ChatNode = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    contentGroup: cc.Node = null;

    @property(cc.Sprite)
    head: cc.Sprite = null;

    @property(Loading)
    loading: Loading = null;

    @property(cc.Node)
    groupListNode: cc.Node = null;

    @property(cc.Node)
    friendListNode: cc.Node = null;

    onLoad() {
        EventManager.Inst.registerEevent(Router.rut_create_group, this.resCreateGroup.bind(this));
        EventManager.Inst.registerEevent(Router.rut_user_list, this.resUserList.bind(this));
        EventManager.Inst.registerEevent(Router.rut_group_list, this.resGroupList.bind(this));
    }

    init() {
        this.node.opacity = 0;
        let fadeIn = cc.fadeIn(0.2);
        cc.tween(this.node).then(fadeIn).start();
        this.setData();
        this.changeList("", 0);
    }

    /**
     * 玩家列表
     */
    private setData(): void {
        this.nameLabel.string = user.data.name;
        this.head.spriteFrame = getAvatar(user.data.pid);
        let pList = user.userlist;
        for (let i = 0; i < pList.length; i++) {
            if (pList[i].pid == user.data.pid) { continue; }
            let item: cc.Node = cc.instantiate(this.userItem);
            let script = item.getComponent(UserItem);
            script.chatNode = this.chatNode;
            script.setInfo(pList[i])
            this.content.addChild(item);
        }
        let gList = user.groupList;
        for (let i = 0; i < gList.length; i++) {
            let item: cc.Node = cc.instantiate(this.groupItem);
            let script = item.getComponent(GroupItem);
            script.chatNode = this.chatNode;
            script.setInfo(gList[i])
            this.contentGroup.addChild(item);
        }
    }

    /**
     * 好友和群组列表切换
     * @param event 
     * @param type 
     */
    changeList(event: any, type: number) {
        this.groupListNode.active = type == 1 ? true : false;
        this.friendListNode.active = type == 0 ? true : false;
        this.loading.showLoading();
        if (type == 0) {
            //好友列表
            Net.sendMsg({}, Router.rut_user_list);
        }
        else {
            Net.sendMsg({}, Router.rut_group_list);
        }
    }

    /**
     * 新建一个群聊
     */
    createGroup() {
        this.loading.showLoading();
        let dt = {};
        Net.sendMsg(dt, Router.rut_create_group);
    }

    resCreateGroup(data: ModelAny) {
        this.loading.hideLoading();
        if (data.code !== ErrEnum.OK) {
            tips.showTip("创建群组失败");
            return;
        }
        console.log(data);
        user.groupList.push(data.msg[0]);
        let gList = data.msg;
        let item: cc.Node = cc.instantiate(this.groupItem);
        let script = item.getComponent(GroupItem);
        script.chatNode = this.chatNode;
        script.setInfo(gList[0])
        this.contentGroup.addChild(item);
    }

    resUserList(data: ModelAny) {
        this.loading.hideLoading();
        if (data.code !== ErrEnum.OK) {
            tips.showTip("获取好友列表失败");
            return;
        }
        if (data.msg.length != user.userlist.length) {
            user.userlist = data.msg;
            this.refreshAllListContent();
        }
    }

    resGroupList(data: ModelAny) {
        this.loading.hideLoading();
        if (data.code !== ErrEnum.OK) {
            tips.showTip("获取群组列表失败");
            return;
        }
        if (data.msg.length != user.groupList.length) {
            user.groupList = data.msg;
            this.refreshAllListContent();
        }
    }

    /**
     * 好友或群组列表有变动，刷新一下
     */
    refreshAllListContent() {
        this.content.removeAllChildren();
        this.contentGroup.removeAllChildren();
        this.setData();
    }

}
