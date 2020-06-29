const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    onLoad() {
        this.initProperty();
    }
    start() { }

    private initProperty(): void {

    }
    // update (dt) {}
}
