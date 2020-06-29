const fs = require('fs');
const path = require("path");
var readline = require('readline');
/* 场景脚本 */
module.exports = {
    async getCanvasChildren(event, className, filePath, isTsScript) {
        Editor.success(className);
        Editor.success(filePath);
        let url = this.checkFilePath(filePath);
        await this.dealUrl(className, url, isTsScript);
        /* 获取当前选中节点uuid */
        let uuid = Editor.Selection.curSelection('node');
        /* 获取节点对象 */
        let node = cc.engine.getInstanceById(uuid);
        node.addComponent(className);
        Editor.success("add success");
    },

    /**
     * 递归创建目录 同步方法 
     * @param {绝对路径 string} dirname 
     */
    mkdirsSync(dirname) {
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            Editor.success(path.dirname(dirname));
            if (this.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    },

    /**
     * 文件存放路径
     * @param {相对路径 string} filePath 
     */
    checkFilePath(filePath) {
        let url = `${Editor.Project.path}/assets/scripts/${filePath}`
        if (!fs.existsSync(url)) {
            this.mkdirsSync(url);
        }
        return url;
    },

    /**
     * 生成脚本组件
     * @param {类名 string} className 
     * @param {绝对路径} filePath 
     */
    async dealUrl(className, filePath, isTsScript) {
        return new Promise(async resolve => {
            if (!fs.existsSync(filePath)) {
                Editor.error("目录不存在")
                Editor.success(filePath);
                resolve()
                return;
            }
            if (isTsScript) {
                var head = className[0];
                head = head.toUpperCase();
                this.readFileToArr(`${__dirname}/moduleScript.ts`, head + className.substring(1, className.length), async () => {
                    /* 将模版拷贝到指定位置 */
                    fs.copyFileSync(`${__dirname}/moduleScriptF.ts`, `${filePath}/${className}.ts`);
                    /* 刷新脚本资源目录 */
                    await Editor.Ipc.sendToMain("bindscript:refreshAssets", () => {
                        setTimeout(() => {
                            resolve();
                        }, 3000);
                    });
                });
            }
            else {
                fs.copyFileSync(`${__dirname}/moduleScript.js`, `${filePath}/${className}.js`);
                /* 刷新脚本资源目录 */
                await Editor.Ipc.sendToMain("bindscript:refreshAssets", () => {
                    setTimeout(() => {
                        resolve();
                    }, 3000);
                });
            }
        });
    },

    /*
    * 按行读取文件内容
    * 返回：字符串数组
    * 参数：fReadName:文件名路径
    *      callback:回调函数
    * */
    async readFileToArr(fReadName, ClassName, callback) {
        var fRead = fs.createReadStream(fReadName);
        var objReadline = readline.createInterface({
            input: fRead
        });
        fs.writeFileSync(`${__dirname}/moduleScriptF.ts`, "");
        objReadline.on('line', function (line) {
            var index = line.indexOf("NewClass");
            if (index > 0) {
                line = line.replace("NewClass", ClassName);
            }
            fs.writeFileSync(`${__dirname}/moduleScriptF.ts`, line + "\n", { flag: 'a' });
        });
        objReadline.on('close', function () {
            callback()
        });

    }
};