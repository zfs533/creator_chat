/* 老虎机转圈测试 */
import LhjItem from "./lhjItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LhjPaths extends cc.Component {
    @property(cc.Prefab)
    lhjItem: cc.Prefab = undefined;

    private items: cc.Node[] = [];
    private cout: number = 0;
    private index: number = 0;
    private speed: number = 2;
    private circleCount: number = 0;

    onLoad() {
        this.initProperty();
    }
    start() {
        this.layoutItems();
    }

    testAdd() {
        this.speed++
    }
    testCut() {
        this.speed--;
    }
    update() {
        this.cout++;
        if (this.cout % this.speed == 0) {
            this.index++;
            if (this.index >= this.items.length) {
                this.cout = 0;
                this.index = 0;
            }
            this.items[this.index].getComponent(LhjItem).playLHJAction();
        }
    }

    layoutItems() {
        let firstX: number = 0;
        let lastX: number = 0;
        let topY: number = 510;
        /* top */
        for (let i = 0; i < 7; i++) {
            let item: cc.Node = cc.instantiate(this.lhjItem);
            this.node.addChild(item);
            let xx = (640 - 6 * item.width) / 2 - 330 + (item.width + 5) * i;
            item.setPosition(xx, topY);
            if (i == 0) {
                console.log(xx);
                firstX = xx;
            }
            lastX = xx;
            this.items.push(item);
        }

        /* right */
        for (let i = 0; i < 11; i++) {
            let item: cc.Node = cc.instantiate(this.lhjItem);
            this.node.addChild(item);
            item.setPosition(lastX, topY - (item.width + 5) * (i + 1));
            this.items.push(item);
        }


        /* bottom */
        for (let i = 6; i >= 0; i--) {
            let item: cc.Node = cc.instantiate(this.lhjItem);
            this.node.addChild(item);
            item.setPosition((640 - 6 * item.width) / 2 - 330 + (item.width + 5) * i, -topY);
            this.items.push(item);
        }

        /* left */
        for (let i = 10; i >= 0; i--) {
            let item: cc.Node = cc.instantiate(this.lhjItem);
            this.node.addChild(item);
            item.setPosition(firstX, topY - (item.width + 5) * (i + 1));
            this.items.push(item);
        }
    }

    private initProperty(): void {

    }
    // update (dt) {}
}
