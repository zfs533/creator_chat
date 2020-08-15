const { ccclass, property } = cc._decorator;
@ccclass
export default class Main extends cc.Component {

    @property([cc.SpriteFrame])
    headList: cc.SpriteFrame[] = [];

    private arr: any[] = [];
    onLoad() {
        this.initProperty();
    }
    start() { }

    private initProperty(): void {

    }

    public getHeadByPid(pid: number): cc.SpriteFrame {
        //{pid:,head:}
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i].pid == pid) {
                return this.arr[i].head;
            }
        }
        let id = pid;
        let head = this.headList[Math.floor(Math.random() * this.headList.length)];
        this.arr.push({ pid: id, head: head });
        console.log("headarr");
        console.log((this.arr))
        return head;
    }

}
