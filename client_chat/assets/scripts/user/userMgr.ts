class UserMgr {
    private userList: any[] = [];
    addToList(data: any) {
        let isHave = this.userList.find(item => { return data.pid == item.pid });
        if (!isHave) {
            this.userList.push(data);
        }
    }

    findOne(pid: number) {
        return this.userList.find(item => { return pid == item.pid });
    }
}

export const userMgr = new UserMgr();