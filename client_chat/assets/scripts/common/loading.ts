const { ccclass, property } = cc._decorator;
@ccclass
export default class Loading extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    private count: number = 0;
    private count1: number = 0;

    showLoading() {
        this.node.active = true;
    }

    update() {
        this.count++;
        if (this.count % 10 == 0) {
            this.count1++
            if (this.count1 == 1) {
                this.label.string = "加载中";
            }
            if (this.count1 == 2) {
                this.label.string = "加载中.";
            }
            if (this.count1 == 3) {
                this.label.string = "加载中..";
            }
            if (this.count1 == 4) {
                this.label.string = "加载中...";
                this.count = 0;
                this.count1 = 0;
            }
        }
    }

    hideLoading() {
        this.node.active = false;
    }
}
