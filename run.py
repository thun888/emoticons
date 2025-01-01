import os
import json
import shutil

#域名
domain = "emoticons.hzchu.top"

# 获取当前目录路径
current_dir = os.getcwd()
json_dir = os.path.join(current_dir, 'json')

# 清空json文件夹（如果存在的话）
if os.path.exists(json_dir):
    shutil.rmtree(json_dir)  # 删除整个json文件夹及其内容
    os.makedirs(json_dir)  # 重新创建json文件夹
else:
    os.makedirs(json_dir)  # 如果json文件夹不存在，创建它

# 获取当前目录下的所有文件夹，排除json和.git文件夹
folders = [f for f in os.listdir(current_dir) if os.path.isdir(os.path.join(current_dir, f)) and f != 'json'and f != '.git']

# 遍历每个文件夹并生成JSON文件
for folder in folders:
    folder_path = os.path.join(current_dir, folder)
    items = []

    # 遍历文件夹中的所有文件
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        # 确保只处理文件（排除子文件夹）
        if os.path.isfile(file_path):
            file_name_without_extension = os.path.splitext(filename)[0]
            relative_path = os.path.relpath(file_path, current_dir)  # 获取相对路径
            url = f"https://{domain}/{relative_path.replace(os.sep, '/')}"

            items.append({
                "key": file_name_without_extension,
                "val": url
            })

    # 构造JSON数据
    json_data = {
        "name": folder,
        "type": "image",
        "items": items
    }

    # 将JSON数据写入文件
    json_filename = os.path.join(json_dir, f"{folder}.json")
    with open(json_filename, 'w', encoding='utf-8') as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)

    print(f"生成了 {json_filename} 文件")
