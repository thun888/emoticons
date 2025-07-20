import os
import json
import requests
from urllib.parse import urlparse
from pathlib import Path

with open('bili.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def download_emotes(data, root_dir='emoticons'):
    """
    下载 JSON 中所有 package 下的 emote 表情图，并按照 package_id 存放到指定目录。
    :param data: 解析后的 JSON 对象
    :param root_dir: 存放所有包的根目录
    """
    packages = data.get('data', {}).get('packages', [])
    
    for pkg in packages:
        pkg_id = pkg.get('id')
        emotes = pkg.get('emote', [])
        
        # 创建以 package_id 命名的文件夹
        pkg_dir = Path(root_dir) / str(pkg_id)
        pkg_dir.mkdir(parents=True, exist_ok=True)
        
        for em in emotes:
            url = em.get('url') + "@.webp"
            alias = em.get('meta', {}).get('alias')
            if not url or not alias:
                continue

            # 从 URL 中解析扩展名
            path = urlparse(url).path
            # ext = os.path.splitext(path)[1] or '.png'
            ext = ".webp"
            # 对 alias 做简单清洗，避免文件名非法字符
            safe_alias = "".join(c for c in alias if c.isalnum() or c in (' ', '_', '-')).strip()
            filename = f"{safe_alias}{ext}"
            filepath = pkg_dir / filename

            # 如果文件已存在，跳过下载
            if filepath.exists():
                print(f"跳过已存在文件: {filepath}")
                continue

            try:
                print(f"正在下载 {url} -> {filepath}")
                resp = requests.get(url, timeout=10)
                resp.raise_for_status()
                with open(filepath, 'wb') as f:
                    f.write(resp.content)
            except Exception as e:
                print(f"下载失败 {url}: {e}")

if __name__ == '__main__':
    download_emotes(data)
