import DataViewUtils from "./dataviewUtils";
import { Router } from "./routers";
import { Head, ModelAny } from "./globalUtils";
import EventManager from "../common/eventManager";
import { getIp, IpType } from "./util";
import { tips } from "../common/tip";

export default class ChatNet {
    private socket: WebSocket;
    private id: number = 0;
    private serverType: number = 0;
    init(cb?: any) {
        let ip = getIp(IpType.remote);
        this.socket = new WebSocket(ip);
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