import Loading from "../common/loading";
import { Net } from "../net/net";
import { updateUtil } from "./updateUtil";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Start extends cc.Component {

    @property(Loading)
    loading: Loading = null;

    @property({ type: cc.Asset })
    updateManifest: cc.Asset = undefined;

    @property(cc.Node)
    updateNode: cc.Node = null;

    onLoad() {
        this.updateNode.active = false;
        this.initProperty();
    }
    start() {
        this.startUpdate();
        // this.gotoChat();
    }

    private initProperty(): void {

    }

    gotoChat() {
        cc.log("gotoChat");
        /* 链接游戏服务器 */
        this.loading.showLoading();
        Net.init(() => {
            this.loading.hideLoading();
            cc.director.loadScene('chat');
        });
    }

    /**
     * 开始热更新
     */
    async startUpdate() {
        if (cc.sys.isNative) {
            this.updateNode.active = true;
            await updateUtil.init(this);
            await updateUtil.startUpdateTask(this.updateManifest);
        }
        else {
            this.gotoChat();
        }
    }
}
