import { addFriendReq } from "../utils/globalUtils";
import { ModelAny } from "../mongodb/mongodbUtil";
import UserScheme from "../mongodb/module/userDao";
import FriendScheme, { FriendsModule } from "../mongodb/module/friendsDao";

class FriendApi {
    async addFriend(data: addFriendReq, userId: number) {
        let fDt: ModelAny = await UserScheme.Inst.findOne({ pid: data.friendId });
        let uDt: ModelAny = await UserScheme.Inst.findOne({ pid: userId });
        let fdata: FriendsModule = {
            userId: userId,
            friendId: data.friendId,
            uName: uDt.msg.name,
            fName: fDt.msg.name,
        }
        await FriendScheme.Inst.insertOne(fdata);
    }
}

export const friendApi = new FriendApi();