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
        /* 链接游戏服务器 */
        this.loading.showLoading();
        Net.init(() => {
            this.loading.hideLoading();
            this.startUpdate();
        });
    }

    private initProperty(): void {

    }

    gotoChat() {
        cc.log("gotoChat");
        cc.director.loadScene('chat');
    }

    /**
     * 开始热更新
     */
    async startUpdate() {
        if (cc.sys.isNative) {
            this.updateNode.active = true;
            await updateUtil.init();
            await updateUtil.startUpdateTask(this.updateManifest);
        }
        else {
            this.gotoChat();
        }
    }
}
