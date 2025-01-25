import os
import yaml

def get_user_input(prompt, default=None):
    user_input = input(prompt).strip()
    return user_input if user_input else default

def main():
    # Step 1: Ask for the emoticon package name
    package_name = get_user_input("请输入新增表情包的路径 (相对于 ./emoticons/): ")
    package_path = os.path.join("./emoticons", package_name)

    # Create the directory if it doesn't exist
    # os.makedirs(package_path, exist_ok=True)

    # Step 2: Ask for additional details
    chinese_name = get_user_input("请输入表情包的中文名称: ")
    english_name = get_user_input(f"请输入表情包的英文名称 (默认值: {package_name}): ", default=package_name)
    source = get_user_input("请输入表情包的来源: ")
    source_description = get_user_input("请输入来源描述: ")
    tags_input = get_user_input("请输入标签(多个用逗号分隔): ")
    tags = {}
    if tags_input:
        tags = tags_input.split(',')
    # Gather file aliases for all files in the directory (excluding config.yaml)
    aliases = {}
    add_alias = get_user_input(f"是否为文件添加别称? (y/n, 默认n): ", default="n").lower()
    if add_alias == "y":
        for file_name in os.listdir(package_path):
            if file_name == "config.yaml":
                continue
            file_alias = get_user_input(f"请输入文件 {file_name} 的别称 (多个别称用逗号分隔): ").split(',')
            aliases[file_name] = ", ".join([a.strip() for a in file_alias])
    else:
        for file_name in os.listdir(package_path):
            if file_name == "config.yaml":
                continue
            aliases[file_name] = ""


    # Create or update config.yaml
    config_path = os.path.join(package_path, "config.yaml")

    # Load existing data if the file exists
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as file:
            config_data = yaml.safe_load(file) or {}
    else:
        config_data = {}

    # Update the config data
    config_data.update({
        "chinese_name": chinese_name,
        "english_name": english_name,
        "source": source,
        "source_description": source_description,
        "tags": tags,
        "aliases": aliases
    })

    # Write back to the config.yaml file
    with open(config_path, "w", encoding="utf-8") as file:
        yaml.dump(config_data, file, allow_unicode=True)

    print(f"配置已成功写入 {config_path}")

if __name__ == "__main__":
    main()