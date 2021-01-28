# -*- coding: utf-8 -*
"""
    首先安装tingfy模块 sudo pip install --upgrade tinify
    压缩图片 https://blog.csdn.net/weixin_41010198/article/details/106544789
    tingfy局限性,非会员免费调用API的次数是有限的
"""
import os
import sys
import tinify
import thread
import time

g = os.walk("./")
def startCompress(origin,target):
    """
        origin:原始图片
        target:压缩后的图片
    """
    tinify.key = "kLVgyqSkfKgCBmWqpHYLmn09tnXmNKMJ"
    source = tinify.from_file(origin)
    source.to_file(target)


if __name__ == '__main__':
    """
        
    """
    # startCompress()
    for path, dir_list, file_list in g:
        for file_name in file_list:
            file = os.path.join(path,file_name)
            end = file[-3:]
            if (end == 'png') or (end == 'jpg'):
                print(file)
                startCompress(file,file);
                # time.sleep(1)
                # thread.start_new_thread(startCompress,(file,file))

"""
    exp:
        在需要压缩的文件夹根目录直接运行 python compress_tingypng.py
"""
