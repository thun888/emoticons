import os
import json
import re

def is_image_file(filename):
    # 判断文件是否为图片文件的函数
    return filename.endswith((".jpg", ".jpeg", ".png", ".bmp"))

def extract_number(filename):
    # 从文件名中提取数字，考虑到文件名中的点（`.`）
    match = re.search(r"dokomo-(\d+)\.png", filename)
    return int(match.group(1)) if match else None

def generate_owo_json(directory_path="."):
    data = []
    # 确保路径以斜杠结束
    directory_path = os.path.join(directory_path, '')
    filenames = [f for f in os.listdir(directory_path) if os.path.isfile(os.path.join(directory_path, f)) and is_image_file(f)]
    # 根据文件名中的数字排序
    filenames.sort(key=extract_number)
    for filename in filenames:
        number = extract_number(filename)
        if number is not None:
            img_src = f"https://cdn.jsdelivr.net/gh/infinitesum/Twikoo-emoji@master/dokomo/dokomo-{number}.png"
            item = {"text": f"dokomo-{number}", "icon": f"<img src='{img_src}'>"}
            data.append(item)
    with open(os.path.join(directory_path, "owo.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)

# 使用示例：替换下面的"path/to/your/directory"为您图片文件所在的实际目录路径
generate_owo_json("/Users/summer/Downloads/Twikoo-blobcat-emoji/dokomo/")
