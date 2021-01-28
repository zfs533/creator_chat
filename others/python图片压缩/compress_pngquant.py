# -*- coding: utf-8 -*
"""
    单独针对png格式图片压缩
    压缩图片 https://blog.csdn.net/weixin_41010198/article/details/106544789
    首先安装 https://pngquant.org/
"""
import os
import sys
import subprocess

g = os.walk("./assets")
def startCompress(origin,target):
    """
        origin:原始图片
        target:压缩后的图片
    """
    PNGQUANT_PATH = r'./pngquant/pngquant' #pngquant执行文件路径
    
    cmd_command = '"{0}" 256 -s1 --force --quality=90-90 "{1}" -o "{2}"'.format(PNGQUANT_PATH, origin, target)
    #执行命令
    p = subprocess.Popen(cmd_command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    retval = p.wait()


if __name__ == '__main__':
    """
        
    """
    # startCompress("./map.jpg","./test.jpg")
    #遍历文件夹
    for path, dir_list, file_list in g:
        for file_name in file_list:
            file = os.path.join(path,file_name)
            end = file[-3:]
            if (end == 'png'):
                print(file)
                startCompress(file,file);

"""
    exp:
        在需要压缩的文件夹根目录直接运行 python compress_tingypng.py
"""
