import os
import json
import shutil
import yaml

# 域名
domain = "emoticons.hzchu.top"

# 获取当前目录路径
current_dir = os.getcwd()
emoticons_dir = os.path.join(current_dir, 'emoticons')
json_dir = os.path.join(current_dir, 'json')

def ensure_dir_exists(path):
    """确保目录存在"""
    if not os.path.exists(path):
        os.makedirs(path)

# 清空 json 文件夹（如果存在的话）
if os.path.exists(json_dir):
    shutil.rmtree(json_dir)  # 删除整个 json 文件夹及其内容
ensure_dir_exists(json_dir)
ensure_dir_exists(os.path.join(json_dir, 'artalk'))
ensure_dir_exists(os.path.join(json_dir, 'display'))

# 获取 emoticons 目录下的所有文件夹
folders = [f for f in os.listdir(emoticons_dir) if os.path.isdir(os.path.join(emoticons_dir, f))]

# 用于存储所有 artalk JSON 文件的引用路径
artalk_all_data = []
display_all_data = []

# 遍历每个文件夹并生成 JSON 文件
for folder in folders:
    folder_path = os.path.join(emoticons_dir, folder)
    items = []
    name = folder  # 默认 name 为文件夹名称
    aliases = {}  # 存储别称
    config_data = {}  # 存储 config 数据

    # 检查 config.yaml 文件
    config_path = os.path.join(folder_path, 'config.yaml')
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r', encoding='utf-8') as config_file:
                config_data = yaml.safe_load(config_file)
                if 'chinese_name' in config_data:
                    name = config_data['chinese_name']
                if 'aliases' in config_data:
                    aliases = config_data['aliases']
        except Exception as e:
            print(f"读取 {config_path} 时出错: {e}")

    # 遍历文件夹中的所有文件
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        # 排除 config.yaml 文件，并确保只处理文件（排除子文件夹）
        if filename == "config.yaml" or not os.path.isfile(file_path):
            continue

        file_name_without_extension = os.path.splitext(filename)[0]
        relative_path = os.path.relpath(file_path, current_dir)  # 获取相对路径
        url = f"https://{domain}/{relative_path.replace(os.sep, '/')}"

        # 使用别称作为 key，如果没有别称或别称为空，则使用文件名
        key = aliases.get(filename) if aliases.get(filename) else file_name_without_extension

        items.append({
            "key": key,
            "val": url
        })

    # 构造 JSON 数据
    json_data = {
        "name": name,
        "type": "image",
        "items": items
    }

    # 将 JSON 数据写入文件（artalk）
    json_filename = os.path.join(json_dir, "artalk", f"{folder}.json")
    with open(json_filename, 'w', encoding='utf-8') as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)
    print(f"生成了 {json_filename} 文件")

    # 记录 artalk JSON 文件的引用路径
    artalk_all_data.append(f"https://{domain}/{os.path.relpath(json_filename, current_dir).replace(os.sep, '/')}")

    # 将 config.yaml 转换为 JSON 并存储到 ./json/display/
    display_json_filename = os.path.join(json_dir, "display", f"{folder}.json")
    with open(display_json_filename, 'w', encoding='utf-8') as display_json_file:
        json.dump(config_data, display_json_file, ensure_ascii=False, indent=4)
    display_all_data.append(f"https://{domain}/{os.path.relpath(display_json_filename, current_dir).replace(os.sep, '/')}")

    print(f"生成了 {display_json_filename} 文件")

# 生成 artalk_all.json 文件
artalk_all_filename = os.path.join(json_dir, "artalk_all.json")
with open(artalk_all_filename, 'w', encoding='utf-8') as artalk_all_file:
    json.dump(artalk_all_data, artalk_all_file, ensure_ascii=False, indent=4)

# 生成 display_all_list.json 文件
display_all_filename = os.path.join(json_dir, "display_all_list.json")
with open(display_all_filename, 'w', encoding='utf-8') as display_all_file:
    json.dump(display_all_data, display_all_file, ensure_ascii=False, indent=4)

print(f"生成了 {display_all_filename} 文件")

# 合并 display 目录下的所有 JSON 文件为 display_all.json
display_all_merged = {}
display_dir = os.path.join(json_dir, 'display')
for filename in os.listdir(display_dir):
    if filename.endswith('.json'):
        file_path = os.path.join(display_dir, filename)
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            display_all_merged[filename[:-5]] = data  # 去掉 .json 后缀作为 key

# 将合并后的数据写入 display_all.json
display_all_merged_filename = os.path.join(json_dir, 'display_all.json')
with open(display_all_merged_filename, 'w', encoding='utf-8') as display_all_merged_file:
    json.dump(display_all_merged, display_all_merged_file, ensure_ascii=False, indent=4)

print(f"生成了 {display_all_merged_filename} 文件")