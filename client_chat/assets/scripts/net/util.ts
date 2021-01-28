import Main from "../common/Main";

let main: Main;
function getMain() {
    if (!main) {
        main = cc.find("main").getComponent(Main);
    }
    return main;
}
export function getAvatar(pid: number): cc.SpriteFrame {
    let main = getMain();
    let head = main.getHeadByPid(pid);
    return head;
}

export enum IpType {
    local = 0,
    remote = 1
}

export function getIp(type: number): string {
    if (type == IpType.local) {
        return "ws://0.0.0.0:8089/ws";
        // return "ws://192.168.0.197:8089/ws";
    }
    else if (type == IpType.remote) {
        return "ws://139.199.80.239:8089/ws"
    }
}