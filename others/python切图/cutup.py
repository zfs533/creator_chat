# -*- coding: utf-8 -*
"""
    切图工具，大图切碎片
"""
import os
import sys
from PIL import Image


def startCut(imgPath, size, savePath):
    """
        开始切图
        imgPath:大图路径
        size:单张切片尺寸,正矩形
        savePath:保存切片路径
    """
    img = Image.open(imgPath)
    hor = img.size[0]/size
    ver = img.size[1]/size
    print("图像宽度%d 图像高低%d" % (img.size[0], img.size[1]))
    for i in range(hor):
        for j in range(ver):
            cropped = img.crop(
                ((i*size), (j*size), (i*size+size), (j*size+size)))
            rPath = "%s/%d_%d.jpg" % (savePath, i, j)
            print(rPath)
            cropped.save(rPath)


def mkdir_recursively(path_list):
    """
        循环递归创建目录
    """
    dir = ''
    for path_item in path_list:
        dir = os.path.join(dir, path_item)
        print("dir:", dir)
        if os.path.exists(dir):
            if os.path.isdir(dir):
                print("mkdir skipped: %s, already exist." % (dir,))
            else:  # Maybe a regular file, symlink, etc.
                print("Invalid directory already exist:", dir)
                return False
        else:
            try:
                os.mkdir(dir)
            except e:
                print("mkdir error: ", dir)
                print(e)
                return False
            print("mkdir ok:", dir)


if __name__ == '__main__':
    """
        sys.argv[1]:大图路径
        sys.argv[2]:单张切片尺寸,正矩形
        sys.argv[3]:保存切片路径
    """
    imgPath = sys.argv[1]
    size = int(sys.argv[2])
    savePath = sys.argv[3]
    path_list = savePath.split('/')
    print(path_list)
    mkdir_recursively(path_list)
    startCut(imgPath, size, savePath)

"""
exp:
    python cutup.py map.jpg 100 save/one/two/three
"""
