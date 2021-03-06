import { Net } from "../net/net";
import { tips } from "../common/tip";
import EventManager from "../common/eventManager";
import { Router } from "../net/routers";
import { ModelAny, LoginReq } from "../net/globalUtils";
import { ErrEnum } from "../net/err";
import Loading from "../common/loading";
import { user } from "../user/user";
import UserNode from "../user/userNode";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Login extends cc.Component {
    @property(UserNode)
    userNode: UserNode = null;

    @property(cc.EditBox)
    edtName: cc.EditBox = null;

    @property(cc.EditBox)
    edtPwd: cc.EditBox = null;

    @property(Loading)
    loading: Loading = null;

    onLoad() {
        this.node.active = true;
        EventManager.Inst.registerEevent(Router.rut_login, this.resLogin.bind(this));
        EventManager.Inst.registerEevent(Router.rut_register, this.resRegister.bind(this));
    }

    start() {
        let name = cc.sys.localStorage.getItem("uname");
        let pwd = cc.sys.localStorage.getItem("pwd");
        if (name) {
            this.edtName.string = name;
        }
        if (pwd) {
            this.edtPwd.string = pwd;
        }

    }

    handLogin() {
        if (this.edtName.string.length < 1 || this.edtPwd.string.length < 1) {
            tips.showTip("用户名和密码不能为空");
            return;
        }

        let dt: LoginReq = {
            name: this.edtName.string,
            pwd: this.edtPwd.string,
        }
        Net.sendMsg(dt, Router.rut_login);
        this.loading.showLoading();
    }

    handleRegister() {
        if (this.edtName.string.length < 1 || this.edtPwd.string.length < 1) {
            tips.showTip("用户名和密码不能为空");
            return;
        }

        let dt: LoginReq = {
            name: this.edtName.string,
            pwd: this.edtPwd.string,
        }
        Net.sendMsg(dt, Router.rut_register);
        this.loading.showLoading();
    }

    resLogin(data: ModelAny) {
        this.loading.hideLoading();
        if (data.code !== ErrEnum.OK) {
            tips.showTip(ErrEnum[String(data.code)]);
            return;
        }
        this.saveLoginInfo(this.edtName.string, this.edtPwd.string);
        tips.showTip("登录成功");
        user.setInfo(data.msg);
        this.userNode.init();
        this.hideSelf();
    }

    saveLoginInfo(name: string, pwd: string) {
        cc.sys.localStorage.setItem("uname", name);
        cc.sys.localStorage.setItem("pwd", pwd);
    }

    resRegister(data: ModelAny) {
        this.loading.hideLoading();
        if (data.code !== ErrEnum.OK) {
            tips.showTip(ErrEnum[String(data.code)]);
            return;
        }
        this.saveLoginInfo(this.edtName.string, this.edtPwd.string);
        tips.showTip("注册成功");
        user.setInfo(data.msg);
        this.userNode.init();
        this.hideSelf();
    }

    hideSelf() {
        let fadeOut = cc.fadeOut(0.2);
        let moveTo = cc.moveTo(0.2, new cc.Vec2(-650, 0));
        let spaw = cc.spawn(fadeOut, moveTo);
        cc.tween(this.node).then(spaw).start();
    }
}
