import os

def rename_files_in_directory(directory, new_extension):
    # 获取目录下的所有文件
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    
    # 按文件名排序
    files.sort()
    
    # 遍历文件并重命名
    for index, filename in enumerate(files):
        # 获取文件的扩展名
        _, old_extension = os.path.splitext(filename)
        
        # 构建新的文件名
        new_filename = f"{index}{new_extension}"
        
        # 获取文件的完整路径
        old_file_path = os.path.join(directory, filename)
        new_file_path = os.path.join(directory, new_filename)
        
        # 重命名文件
        os.rename(old_file_path, new_file_path)
        print(f"Renamed {filename} to {new_filename}")

def main():
    # 询问用户目录路径
    directory = input("请输入需要重命名文件所在的路径: ")
    
    # 询问用户新的文件扩展名
    new_extension = input("请输入重命名后的文件后缀（例如 .gif）: ")
    
    # 检查路径是否存在
    if not os.path.isdir(directory):
        print("指定的路径不存在或不是一个目录。")
        return
    
    # 调用重命名函数
    rename_files_in_directory(directory, new_extension)

if __name__ == "__main__":
    main()