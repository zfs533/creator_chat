import { UserModule } from "../mongodb/module/userDao";
import { FriendsModule } from "../mongodb/module/friendsDao";
import { GroupModule } from "../mongodb/module/groupDao";

/**
 * 协议头信息
 */
export interface Head {
    /* 唯一标示id */
    id: number,
    /* 服务器类型 */
    serverType: number,
    router: string,
}

/**
 * 登录请求
 */
export interface LoginReq {
    name: string,
    pwd: string,
}

export interface LoginRes {
    /* 用户信息 */
    user: UserModule,
    /* 用户列表 */
    list: UserModule[],
    /* 好友列表 */
    fList: FriendsModule[],
    /* 群组列表 */
    gList: GroupModule[],
}

/**
 * 聊天请求
 */
export interface ChatReq {
    /* 玩家pid */
    userId: number,
    /* 好友pid */
    friendId?: number,
    /* 聊天内容 */
    content: string,
    /* 是否为群聊消息 */
    isGroup: number,
    /* 群组pid */
    groupId: number,
}

export interface ChatRes {
    userId: number,
    uName: number,
    content: string,
    time: string,
    groupId: number,
}

/**
 * 历史聊天记录请求
 */
export interface HistoryReq {
    groupId?: number,//群组pid
    userId?: number,
    friendId?: number,
    isGroup: number,
}

/**
 * 添加好友请求
 */
export interface addFriendReq {
    friendId: number,
}

export interface addFriendRes {

}

/**
 * 获取用户列表
 */
export interface getUserListReq {

}

export interface getUserListRes {
    userlist: UserModule[],
}

/**
 * 获取用户好友列表
 */
export interface getFriendListReq {
    pid: number//玩家pid
}

export interface getFriendListRes {
    userlist: FriendsModule[];
}


export interface ReqGroups {
    pid: number,
    time?: string
}
export interface ResGroups {
    pid: number,
    time?: string
}

