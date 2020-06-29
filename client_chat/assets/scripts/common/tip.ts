class Tip {
    private index: number = 0;
    showTip(info: string) {
        this.index++;
        let node: cc.Node = new cc.Node();
        node.addComponent(cc.Label);
        node.getComponent(cc.Label).string = info;
        node.getComponent(cc.Label).fontSize = 22;
        node.x = 320;
        node.y = 600 - this.index * 40;
        cc.director.getScene().addChild(node);

        node.scale = 0;
        let scaleto = cc.scaleTo(0.1, 1, 1);
        let delay = cc.delayTime(1);
        let moveTo = cc.moveTo(0.3, new cc.Vec2(320, 1300));
        let callbk = cc.callFunc(() => {
            this.index--;
            node.destroy();
        }, this);
        let sequence = cc.sequence(scaleto, delay, moveTo, callbk);
        cc.tween(node).then(sequence).start();
    }
}

export const tips = new Tip();