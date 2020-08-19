import { UserModule, FriendsModule, LoginRes, GroupModule } from "../net/globalUtils";

class User {
    public data: UserModule;
    public userlist: UserModule[];
    public friendList: FriendsModule[];
    public groupList: GroupModule[];


    setInfo(data: LoginRes) {
        this.data = data.user;
        this.userlist = data.list;
        this.friendList = data.fList;
        this.groupList = data.gList;
    }
}

export const user = new User();