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