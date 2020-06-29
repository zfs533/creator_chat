import Net from "./modules/net/net";
import ClientManager from "./modules/common/clientManager";
import MongodbUtil from "./modules/mongodb/mongodbUtil";

ClientManager.Instance;
Net.Instance.startServer();
