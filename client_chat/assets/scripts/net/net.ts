import DataViewUtils from "./dataviewUtils";
import { Router } from "./routers";
import { Head, ModelAny } from "./globalUtils";
import EventManager from "../common/eventManager";

export default class ChatNet {
    private socket: WebSocket;
    private id: number = 0;
    private serverType: number = 0;
    init(cb?: any) {
        // this.socket = new WebSocket("ws://192.168.0.65:8089/ws");
        this.socket = new WebSocket("ws://139.199.80.239:8089/ws");//remote
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = () => {
            if (cb) {
                console.log("--------connect success---------");
                cb()
            }
        };
        this.socket.close = () => { console.log("close") };
        this.socket.onerror = () => { console.log("onerror") };
        this.socket.onmessage = (req) => {
            let message = req.data;
            let buf = new Uint8Array(message).buffer;
            let dtView = new DataView(buf);
            let head = DataViewUtils.getHeadData(dtView);
            let body = DataViewUtils.decoding(dtView, buf.byteLength);

            console.log(JSON.stringify(head));
            console.log(JSON.stringify(body));
            this.handleRecvdate(head, body);
        };
    }

    handleRecvdate(head: Head, body: ModelAny) {
        EventManager.Inst.dispatchEvent(head.router, body);
    }

    sendMsg(data: any, router: string) {
        let dt = DataViewUtils.encoding(this.id, this.serverType, Number(router), data);
        this.socket.send(dt);
    }
}

export const Net = new ChatNet();