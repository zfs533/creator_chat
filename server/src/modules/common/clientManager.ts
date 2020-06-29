import Logger from "../utils/logger";
import EventManager from "./EventManager";
import ClientSocket from "../net/clientSocket";

/* 客户端 socket 连接管理 */
export default class ClientManager {
    private static _instance: ClientManager;
    private _index: number = 1000;
    public static get Instance(): ClientManager {
        if (!ClientManager._instance) {
            ClientManager._instance = new ClientManager();
        }
        return ClientManager._instance;
    }
    /* 客户端socket数组 */
    private _clientSockets: any[] = [];
    constructor() {
        EventManager.Instance.registerEevent(EventManager.EvtSaveClientSocket, this._evtSaveClientSocket.bind(this), this);
        EventManager.Instance.registerEevent(EventManager.EvtRemoveClientSocket, this._evtRemoveClientSocket.bind(this), this);
    }

    /**
     * 保存客户端socket
     * @param clientSocket 
     */
    private _evtSaveClientSocket(clientSocket: ClientSocket): void {
        this._clientSockets.push(clientSocket);
    }

    /**
     * 移除客户端socket
     * @param clientSocket 
     */
    private _evtRemoveClientSocket(clientSocket: ClientSocket): void {
        for (let i = 0; i < this._clientSockets.length; i++) {
            if (this._clientSockets[i].id == clientSocket.id) {
                this._clientSockets.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 获取客户端唯一标示id
     */
    public getId(): number {
        return this._index++;
    }

    /**
     * 根据pid获取clientsocket
     * @param pid 
     */
    public getClientSocketByPid(pid: number): ClientSocket {
        let cs: ClientSocket = this._clientSockets.find(item => { return item.id == pid });
        return cs;
    }

} 