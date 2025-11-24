import os
import asyncio
from typing import Optional
from pathlib import Path
import aiohttp
import dotenv
from pypinyin import lazy_pinyin
import yaml


class BiliEmojiDownloader:
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.base_headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        }
        
    async def __aenter__(self):
        await self.init_session()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
        
    async def init_session(self):
        """初始化会话"""
        cookie = self._get_cookie()
        headers = {**self.base_headers}
        if cookie:
            headers['cookie'] = cookie
        self.session = aiohttp.ClientSession(headers=headers)
        
    async def close(self):
        """关闭会话"""
        if self.session:
            await self.session.close()
            
    def _get_cookie(self) -> str:
        """从.env获取cookie"""
        sessdata = os.environ.get('SESSDATA', '') 
        bili_jct = os.environ.get('bili_jct', '')
        if sessdata and bili_jct:
            return f'SESSDATA={sessdata}; bili_jct={bili_jct}'
        return ''
        
    async def search_packages(self, keyword: str, pn: int = 1, ps: int = 20) -> dict:
        """搜索表情包"""
        url = 'https://api.bilibili.com/bapis/main.community.interface.emote.EmoteService/AllPackages'
        
        cookie_dict = {}
        cookie = self._get_cookie()
        if cookie:
            for item in cookie.split(';'):
                if '=' in item:
                    k, v = item.strip().split('=', 1)
                    cookie_dict[k] = v
        
        params = {
            'business': 'reply',
            'csrf': cookie_dict.get('bili_jct', ''),
            'pn': pn,
            'ps': ps,
            'search': keyword,
        }
        
        async with self.session.get(url, params=params) as resp:
            return await resp.json()
    
    async def get_package_detail(self, package_id: int | str) -> dict:
        """通过 ID 获取表情包详情（完整信息）"""
        url = 'https://api.bilibili.com/bapis/main.community.interface.emote.EmoteService/PackageDetail'
        
        params = {
            'business': 'reply',
            'id': package_id
        }
        
        async with self.session.get(url, params=params) as resp:
            return await resp.json()
            
    async def download_image(self, url: str, save_path: Path) -> bool:
        """下载图片"""
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    content = await resp.read()
                    with open(save_path, 'wb') as f:
                        f.write(content)
                    return True
        except Exception as e:
            print(f"下载失败 {url}: {e}")
        return False
        
    def to_pinyin_name(self, chinese_name: str) -> str:
        """将中文名转换为拼音名称，用-分隔"""
        pinyin_list = lazy_pinyin(chinese_name)
        return '-'.join(pinyin_list)
        
    async def download_package(self, package: dict) -> bool:
        """下载表情包"""
        chinese_name = package['text']
        english_name = self.to_pinyin_name(chinese_name)
        item_url = package['meta'].get('item_url', '')
        # 创建保存目录
        save_dir = Path('emoticons') / english_name
        save_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\n开始下载表情包: {chinese_name} ({english_name})")
        print(f"保存到: {save_dir}")
        print(f"表情数量: {len(package['emotes'])}")
        
        aliases = {}
        
        # 下载所有表情
        for idx, emote in enumerate(package['emotes'], start=1):
            image_url = emote['url']
            alias = emote['meta'].get('alias', f'表情{idx}')
            
            # 判断文件扩展名
            ext = '.png'  # 默认 png
            if 'webp' in image_url:
                ext = '.webp'
            elif 'gif' in image_url:
                ext = '.gif'
            elif 'apng' in image_url:
                ext = '.apng'
            
            filename = f"{idx}{ext}"
            save_path = save_dir / filename
            
            print(f"  [{idx}/{len(package['emotes'])}] 下载 {alias}... ", end='')
            
            if await self.download_image(image_url, save_path):
                aliases[filename] = alias
                print("✓")
            else:
                print("✗")
                
        # 生成 config.yaml
        config = {
            'aliases': aliases,
            'chinese_name': chinese_name,
            'english_name': english_name,
            'source': item_url,
            'source_description': "表情包版权归原作者所有",
            'tags': {}
        }
        
        config_path = save_dir / 'config.yaml'
        with open(config_path, 'w', encoding='utf-8') as f:
            yaml.dump(config, f, allow_unicode=True, sort_keys=False)
            
        print(f"\n✓ 下载完成！配置文件已保存到: {config_path}")
        return True


async def main():
    # 检查依赖
    try:
        import pypinyin
        import yaml
    except ImportError as e:
        print(f"\n缺少依赖库: {e}")
        print("请先安装依赖: pip install pypinyin pyyaml aiohttp python-dotenv")
        return
    
    # 检查环境变量
    sessdata = os.environ.get('SESSDATA')
    bili_jct = os.environ.get('bili_jct')
    if not sessdata or not bili_jct:
        print("\n警告: 未配置 sessdata 和 bili_jct")
        print("某些功能可能受限，建议在 .env 文件中配置")
        print()
    
    async with BiliEmojiDownloader() as downloader:
        while True:
            # 搜索表情包
            keyword = input("\n请输入搜索关键词 (输入 q 退出): ").strip()
            if keyword.lower() == 'q':
                break
                
            if not keyword:
                continue
                
            print(f"\n搜索中: {keyword}...")
            result = await downloader.search_packages(keyword)
            
            if result.get('code') != 0:
                print(f"搜索失败: {result.get('message', '未知错误')}")
                continue
                
            packages = result.get('data', {}).get('packages', [])
            if not packages:
                print("未找到相关表情包")
                continue
                
            # 显示搜索结果
            print(f"\n找到 {len(packages)} 个表情包:")
            print("-" * 60)
            for idx, pkg in enumerate(packages, start=1):
                chinese_name = pkg['text']
                # emote_count = len(pkg.get('emotes', []))
                no_access = pkg.get('flags', {}).get('no_access', False)
                # access_status = " [需购买]" if no_access else ""
                print(f"{idx}. {chinese_name}")
            print("-" * 60)
            
            # 用户选择
            choice = input("\n请选择要下载的表情包序号 (输入 0 重新搜索): ").strip()
            if not choice.isdigit():
                continue
                
            choice_num = int(choice)
            if choice_num == 0:
                continue
            elif 1 <= choice_num <= len(packages):
                selected_package = packages[choice_num - 1]
                package_id = selected_package['id']
                
                # 通过 PackageDetail API 获取完整表情包信息
                print(f"\n获取表情包详情 (ID: {package_id})...")
                detail_result = await downloader.get_package_detail(package_id)
                
                if detail_result.get('code') != 0:
                    print(f"获取详情失败: {detail_result.get('message', '未知错误')}")
                    continue
                
                # 使用详情 API 返回的完整数据
                package_detail = detail_result.get('data', {}).get('package', {})
                if not package_detail:
                    print("获取详情失败: 数据为空")
                    continue
                
                # 检查是否需要购买
                # if package_detail.get('flags', {}).get('no_access', False):
                #     print("\n⚠ 该表情包需要购买才能下载")
                #     confirm = input("是否继续尝试下载? (y/n): ").strip().lower()
                #     if confirm != 'y':
                #         continue
                
                await downloader.download_package(package_detail)
            else:
                print("无效的选择")
                
    print("(●'◡'●)")


if __name__ == '__main__':
    dotenv.load_dotenv()
    asyncio.run(main())
