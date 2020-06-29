export interface Head {
    /* 唯一标示id */
    id: number,
    /* 服务器类型 */
    serverType: number,
    router: string,
}

export interface ModelAny {
    code?: number,
    msg?: any,
    err?: any,
}


export interface FriendsModule {
    friendId: number,
    userId: number,
    uName: string,
    fName: string,
    /* 好友类型 */
    type?: number,
    /* 好友分组 */
    groupId?: number,
    time?: Date
}

export interface UserModule {
    pid?: number,
    name: string,
    pwd: string,
    nickName?: string,
    email?: string,
    phone?: number,
    sex?: number,
    time?: Date,
}


export interface ContentsModule {
    userId: number,
    friendId: number,
    uName: string,
    fName: string,
    content: string,
    time?: Date,
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
}

/**
 * 聊天请求
 */
export interface ChatReq {
    /* 玩家pid */
    userId: number,
    /* 好友pid */
    friendId: number,
    /* 聊天内容 */
    content: string,
}

export interface ChatRes {
    userId: number,
    uName: number,
    content: string,
    time: Date,
}

/**
 * 历史聊天记录请求
 */
export interface HistoryReq {
    userId: number,
    friendId: number,
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

