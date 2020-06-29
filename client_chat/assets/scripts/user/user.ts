import { UserModule, FriendsModule, LoginRes } from "../net/globalUtils";

class User {
    public data: UserModule;
    public userlist: UserModule[];
    public friendList: FriendsModule[];

    setInfo(data: LoginRes) {
        this.data = data.user;
        this.userlist = data.list;
        this.friendList = data.fList;
    }
}

export const user = new User();