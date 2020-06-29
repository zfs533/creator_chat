const { ccclass, property } = cc._decorator;
@ccclass
export default class LhjItem extends cc.Component {
    @property(cc.Node)
    lightNode: cc.Node = undefined

    onLoad() {
        this.initProperty();
    }
    start() {
        this.lightNode.opacity = 0;
    }

    private initProperty(): void {

    }
    public playLHJAction() {
        this.lightNode.opacity = 255;
        let fadeOut = cc.fadeOut(0.5);
        cc.tween(this.lightNode).then(fadeOut).start();
    }
}
