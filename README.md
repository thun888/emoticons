
<div align="center">
  <img width="128" height="128" alt="image" src="https://github.com/user-attachments/assets/5e285c8b-b4af-4c23-9457-ef5ce1f00163" />


  <a title="preview" href="https://emoticons.hzchu.top/"><img src="https://img.shields.io/badge/-✨ 在线预览-545759?style=for-the-badge" alt="online-preview"></a>

  # 表情包收集
</div>



本项目会收集一些表情包并提供 Artalk 形式的表情引用（位于 page 分支的 json/ 文件夹内）。通过 GitHub Actions 实现自动化，新增表情包后可自动更新 JSON 配置文件和预览页面。

托管于Github Page上，并使用腾讯云Edge One反代加速

<img width="1452" height="798" alt="image" src="https://github.com/user-attachments/assets/cf6580ff-0ff4-42a7-ad47-f2cbca48ff8b" />


## 表情一览

**免责声明**：部分表情包源于网络，原作者信息可能不详。我们尊重并感谢每一位创作者的辛勤付出。如果您是原作者或知晓确切来源，欢迎通过 [Issue](https://github.com/thun888/emoticons/issues) 告知我们进行补充。若存在版权问题，请立即 [联系我们](mailto:summer@flyalready.com)，我们会第一时间处理。


| 名称         | 路径           | 出处/来源                                                    |
| ------------ | -------------- | ------------------------------------------------------------ |
| azukisan     | azukisan       | 由 [Summer](https://www.flyalready.com/) 整理                   |
| Blob         | Blob           | 由 [Summer](https://www.flyalready.com/) 整理                   |
| neko         | neko           | 由 [Summer](https://www.flyalready.com/) 整理                   |
| 小恐龙       | littledinosaur | https://t.me/addstickers/reaalLittleDinosaurHD               |
| 什么猫       | wtfcat         | https://t.me/addstickers/wtfcat2                             |
| 多洛狼       | dorow0lf   | https://t.me/addstickers/sticker_6f2be407_by_moe_sticker_bot |
| Capoo        | capoo_world    | https://t.me/addstickers/capoo_world123_by_moe_sticker_bot   |
| 克莱恩礼帽猫 | kelaien_cat    | https://t.me/addstickers/kelaien_cat_by_moe_sticker_bot      |
| 抹茶旦旦2    | mochadandan2   | https://t.me/addstickers/mochadandan2                        |
| 小熊虫3 | xiaoxiongchong3 | 微信@小熊虫com |
| 阿龙来咯 | feilong | https://t.me/addstickers/in_FDCFDC_by_NaiDrawBot |
| Strange_Fox | Strange_Fox | https://t.me/addstickers/Strange_Fox_by_moe_sticker_bot |
| blobcat_fu  | blobcat_fu      | 网络    |
| blobcat_pnd | blobcat_pnd     | 网络    |
| 猫猫虫         | bugcat          | 网络    |
| 咖波          | capoo           | 网络    |
| 酷安          | coolapk         | 网络    |
| dokomo      | dokomo          | 网络    |
| 花！          | flowerhd        | 网络    |
| mongmong    | mongmong_rabbit | 网络    |
| nobeko      | nobeko          | 网络    |
| 日行一牡丹       | rxy             | 网络    |
| 活字乱刷      | Movablerandom   |   网络     |

……等等，更多请在 [在线预览](https://emoticons.hzchu.top/) 页面查看。

## 截图

<img width="1470" height="798" alt="image" src="https://github.com/user-attachments/assets/ef25fb9f-da6c-46a2-b7e6-22ba1d440806" />

<img width="1470" height="798" alt="image" src="https://github.com/user-attachments/assets/3185247d-ce3a-4566-9ee0-27b18b1b2a5a" />

<img width="1470" height="798" alt="image" src="https://github.com/user-attachments/assets/2b6dbc18-04a1-4556-a240-2156bb3a7af5" />


<img width="1470" height="798" alt="image" src="https://github.com/user-attachments/assets/b9a5a735-27b9-4fa8-8af0-4a8d2c39d210" />

<img width="2608" height="1248" alt="image" src="https://github.com/user-attachments/assets/23fd4089-da0d-4527-a25a-070790c74cd8" />


## 使用指南

### 引入 Artalk

- 引用单个表情包：在 [在线预览](https://emoticons.hzchu.top/) 页面选择你想要的表情包，复制链接到 Artalk 配置中。

- 一键引用所有表情包：在 Artalk 配置中填入 `https://emoticons.hzchu.top/json/artalk_all.json`。

- 亦可自行指定，Artalk 支持同时加载多个表情包，只需将多个链接放入一个数组即可。例如，同时引入 `azukisan` 和 `neko`，在配置文件中填入：

```
["https://emoticons.hzchu.top/json/azukisan.json","https://emoticons.hzchu.top/json/neko.json"]
```


## 贡献指南

### 添加新的表情包

欢迎您为本项目贡献新的表情包！流程如下：

1.  [**Fork 本仓库**](https://github.com/thun888/emoticons/fork)。
2.  在 `emoticons/` 目录下创建一个**英文名称**的新文件夹。这个名称将作为表情包的唯一 ID。
3.  将表情图片（如 `.png`, `.gif` 等）放入该文件夹中。
4.  运行 `create.py` 脚本，并按照提示操作：
    ```bash
    python create.py
    ```
    ⚠️ 注意：脚本会提示输入中英文名称等信息，请确保**填写的英文名称与第 2 步创建的文件夹名完全一致**。脚本会自动生成所有必要的配置文件。

5.  提交修改并发起 Pull Request。

> [!NOTE]
> 如果您不熟悉如何提交 Pull Request，也可以将表情包文件及相关信息（中文名、英文名、来源、来源描述）通过邮件发送至 `thun888@hzchu.top` 或者 `summer@flyalready.com`。

## 自托管

如果您希望将此项目部署到您自己的服务器上，可按以下步骤操作：

1.  [**Fork 本仓库**](https://github.com/thun888/emoticons/fork)。
2.  修改 `build.py` 文件中的域名配置，将其指向您自己的域名。

    ```diff build.py
    # 将域名修改为您自己的
    - domain = "emoticons.hzchu.top"
    + domain = "emoticons.your-domain.com"
    ```

3.  配置您的服务器或 Pages 服务，使其指向 `page` 分支作为网站根目录。
4.  提交您的修改。项目的 GitHub Action 将自动运行构建脚本，并将生成好的网站和 JSON 文件推送到 page 分支，完成部署。

