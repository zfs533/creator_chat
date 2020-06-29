import ClientManager from "../common/clientManager";
import { Head, LoginRes, ChatReq, HistoryReq } from "../utils/globalUtils";
import DataViewUtils from "../utils/dataviewUtils";
import Logger from "../utils/logger";
import { Router } from "../controller/routers";
import { loginApi } from "../controller/loginApi";
import { contentApi } from "../controller/contentsApi";
import { ModelAny } from "../mongodb/mongodbUtil";
import { ErrEnum } from "../utils/err";
import EventManager from "../common/EventManager";
import FriendScheme from "../mongodb/module/friendsDao";
import { friendApi } from "../controller/friendApi";
import UserScheme from "../mongodb/module/userDao";

/* 客户端连接socket类 */
export default class ClientSocket {
    /* socket连接对象，收发数据 */
    public socket: any;
    public id: number = 0;
    public serverType: number = 0;
    private dataType: any;

    private isLogined: boolean = false;

    constructor(socket: any) {
        this.socket = socket;
        this.id = ClientManager.Instance.getId();
        this._init();
    }

    private _init(): void {
        this.socket.on('message', this._resaveMassage.bind(this));
        this.socket.on('close', this._clientClose.bind(this));
        // setInterval(() => {
        //     let str = "文字尺寸不会根据 Bounding Box 的大小进行缩放，Wrap Text 关闭的情况下，按照正常文字排列，超出 Bounding Box 的部分将不会显示。Wrap Text 开启的情况下，会试图将本行超出范围的文字换行到下一行。如果纵向空间也不够时，也会隐藏无法完整显示的文字。"
        //     let info = str.substring(0, Math.random() * str.length);
        //     this.sendMsg(this.id, 1, 0, { info: info })
        // }, 500);
    }

    /**
     * 接收消息
     * @param message 
     */
    private _resaveMassage(message: any): void {
        Logger.info(message);
        this.dataType = typeof (message);
        if (this.dataType == 'string') {
            // this.socket.send("333");
        }
        else {
            let buf = new Uint8Array(message).buffer;
            let dtView = new DataView(buf);
            let head: Head = DataViewUtils.getHeadData(dtView);
            let body = DataViewUtils.decoding(dtView, buf.byteLength);
            // Logger.info(head);
            // Logger.info(body);
            // this.sendMsg(this.id, 1, 0, body);
            this.serverType = head.serverType;
            this._handleClientData(head.router, body);
        }
    }

    /**
     * 发送消息
     * @param {JSON} data 
     */
    public sendMsg(router: string, body: any): void {
        Logger.info("-----------------sendMsg-----------------");
        Logger.info(router, body);
        let id = this.id;
        let serverType = this.serverType;
        if (this.dataType == 'string') {
            this.socket.send(JSON.stringify({ id: id, serverType: serverType, router: Number(router), body: body }));
        }
        else {
            let data = DataViewUtils.encoding(id, serverType, Number(router), body);
            this.socket.send(data);
        }
    }

    private _clientClose(client: any): void {
        Logger.info("client_close" + client);
        this.isLogined = false;
        EventManager.Instance.dispatchEvent(EventManager.EvtRemoveClientSocket, this);
    }

    private async _handleClientData(router: string, data: any): Promise<any> {
        switch (router) {
            case Router.rut_login:
                this.handleLogin(data);
                break;

            case Router.rut_register:
                this.handleRegister(data);
                break;

            case Router.rut_chat:
                this.handleChat(data);
                break;

            case Router.rut_chat_history:
                this.handleHistory(data);
                break;

            case Router.rut_add_friend:
                this.handleAddFriend(data);
                break;

            case Router.rut_user_list:
                this.handleGetUserList(data);
                break;

            case Router.rut_friend_list:
                this.handleGetFriendList(data);
                break;
        }
    }

    private async handleLogin(data: any) {
        let loginData = await loginApi.login(data.name, data.pwd)
        Logger.info(1, loginData)
        let reData: ModelAny = { code: ErrEnum.OK };
        if (!loginData.msg) {
            reData.code = ErrEnum.login_failed.code;
            reData.err = ErrEnum.login_failed.dis;
        }
        else {
            this.id = loginData.msg.pid;
            this.isLogined = true;
            //将用户信息返给用户
            let userInfo = await loginApi.getUserInfo(loginData.msg.pid)
            Logger.info(2, userInfo);
            let userList = await loginApi.getUserList();
            let friendList = await FriendScheme.Inst.getFriendList(loginData.msg.pid);
            let lRes: LoginRes = { user: userInfo.msg, list: userList.msg, fList: friendList.msg };
            reData.msg = lRes;
        }
        Logger.info(JSON.stringify(reData));
        Logger.info("-11-")
        this.sendMsg(Router.rut_login, reData)
    }

    private async handleRegister(data: any) {
        let loginData = await loginApi.login(data.name, data.pwd)
        if (loginData.msg) {
            let reData1: ModelAny = { code: ErrEnum.register_repeat.code, err: ErrEnum.register_repeat.dis };
            this.sendMsg(Router.rut_register, reData1)
            return;
        }

        let loginData1 = await loginApi.register(data.name, data.pwd)
        let reData1: ModelAny = { code: ErrEnum.OK };
        if (!loginData1.msg) {
            reData1.code = ErrEnum.register_failed.code;
            reData1.err = ErrEnum.register_failed.dis;
        }
        else {
            this.id = loginData1.msg.pid;
            this.isLogined = true;
            //将用户信息返给用户
            let userInfo = await loginApi.getUserInfo(loginData1.msg.pid)
            let userList = await loginApi.getUserList();
            let friendList = await FriendScheme.Inst.getFriendList(loginData1.msg.pid);
            let lRes: LoginRes = { user: userInfo.msg, list: userList.msg, fList: friendList.msg };
            reData1.msg = lRes;
        }
        this.sendMsg(Router.rut_register, reData1)
    }

    private handleChat(data: any) {
        /* 向数据库中写入数据 */
        let dt: ChatReq = {
            userId: data.userId,
            friendId: data.friendId,
            content: data.content,
        }
        /* 将信息发送给对方 */
        contentApi.handleChat(dt);
        /* 告诉玩家发送成功 */
        let redt: ModelAny = { code: 200, msg: { userId: data.userId } };
        this.sendMsg(Router.rut_chat, redt);
    }

    private async handleHistory(data: any) {
        let hisDt: HistoryReq = {
            userId: data.userId,
            friendId: data.friendId,
        }
        let dt: ModelAny = await contentApi.getHistoryRecord(hisDt);
        this.sendMsg(Router.rut_chat_history, dt);
    }

    private async handleAddFriend(data: any) {
        await friendApi.addFriend({ friendId: data.friendId }, this.id);
        let dt: ModelAny = { code: ErrEnum.OK }
        this.sendMsg(Router.rut_add_friend, dt);
    }

    private async handleGetUserList(data: any) {
        let userList = await loginApi.getUserList();
        let dt: ModelAny = { code: ErrEnum.OK, msg: userList }
        this.sendMsg(Router.rut_user_list, dt);
    }

    private async handleGetFriendList(data: any) {
        let friendList = await FriendScheme.Inst.getFriendList(data.pid);
        let dt: ModelAny = { code: ErrEnum.OK, msg: friendList }
        this.sendMsg(Router.rut_friend_list, dt);
    }
}

