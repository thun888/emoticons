// 读取 display_all_list.json 文件
fetch('/json/display_all_list.json')
    .then(response => response.json())
    .then(urls => {
        const emoticonsList = document.getElementById('emoticons-list');

        // 遍历每个表情包的URL并获取详细信息
        Promise.all(urls.map(url => fetch(url).then(res => res.json())))
            .then(emoticons => {
                emoticons.forEach(emoticon => {
                    const emoticonDiv = document.createElement('div');
                    emoticonDiv.className = 'col-md-4 mb-4';
                    const routeUrl = `${currentOrigin}/emoticons/${emoticon.english_name}/`;
                    const artalkDisplayUrl = `${currentOrigin}/json/artalk/${emoticon.english_name}.json`;
                    const owoDisplayUrl = `${currentOrigin}/json/owo/${emoticon.english_name}.json`;

                    let sourceHTML = '暂无来源';
                    if (emoticon.source.startsWith('http')) {
                        // 提取域名
                        sourceDisplay = emoticon.source.split('/')[2];
                        if (sourceDisplay != "") {
                            sourceHTML = `<a href="${emoticon.source}" target="_blank" rel="nofollow noopener noreferrer" onclick="event.stopPropagation()">${sourceDisplay}</a>`;
                        } else {
                            sourceHTML = emoticon.source;
                        }
                    } else {
                        sourceHTML = emoticon.source;
                    }


                    // 随机展示
                    let maxValue = Object.keys(emoticon.aliases).length;
                    let randomValue = Math.floor(Math.random() * maxValue);
                    let [randomName, randomAlias] = Object.entries(emoticon.aliases)[randomValue];
                    let randomImageUrl = `${currentOrigin}/emoticons/${emoticon.english_name}/${randomName}`;
                    emoticonDiv.innerHTML = `
                        <div class="card cursor-pointer" style="cursor: pointer;" onclick="showEmoticons('${emoticon.english_name}', '${emoticon.chinese_name}')">
                            <div class="card-body">
                                <h5 class="card-title">${emoticon.chinese_name} (${emoticon.english_name})<img src="${randomImageUrl}" alt="${randomAlias}" style="height: 1.5em; margin-left: 0.5em;"></h5>
                                <p class="card-text">来源: ${sourceHTML}</p>
                                <p class="card-text">描述: ${emoticon.source_description || '暂无描述'}</p>
                                <p class="card-text">图片资源路径: <a href="${routeUrl}" target="_blank" onclick="event.stopPropagation()">/emoticons/${emoticon.english_name}/</a></p>
                                <p class="card-text">表情包链接: <a href="${artalkDisplayUrl}" target="_blank" onclick="event.stopPropagation()">Artalk</a> | <a href="${owoDisplayUrl}" target="_blank" onclick="event.stopPropagation()">OWO</a></p>
                            </div>
                        </div>
                    `;
                    emoticonsList.appendChild(emoticonDiv);
                });
            })
            .catch(error => console.error('Error loading emoticons details:', error));
    })
    .catch(error => console.error('Error loading the emoticons list:', error));

// 显示表情包列表（一级模态框）
function showEmoticons(englishName, chineseName) {
    fetch(`/json/display/${englishName}.json`)
        .then(response => response.json())
        .then(data => {
            const modalTitle = document.getElementById('emoticonModalLabel');
            const detailsContainer = document.getElementById('emoticonDetails');

            modalTitle.textContent = `${chineseName} (${englishName})`;
            detailsContainer.innerHTML = '';

            // 遍历表情包并显示
            Object.entries(data.aliases).forEach(([filename, alias]) => {
                const emoticonItem = document.createElement('div');
                emoticonItem.className = 'col-md-3 col-sm-4 col-6 mb-3 text-center';
                const imageUrl = `${currentOrigin}/emoticons/${englishName}/${filename}`;
                emoticonItem.innerHTML = `
                    <div class="card h-100 cursor-pointer" onclick="showEmoticonDetail('${currentOrigin}/emoticons/', '${englishName}', '${filename}', '${alias || filename}')">
                        <img src="${imageUrl}" class="card-img-top p-2" alt="${alias || filename}" style="object-fit: contain; height: 100px;">
                        <div class="card-body p-2">
                            <p class="card-text small mb-0">${alias || filename}</p>
                        </div>
                    </div>
                `;
                detailsContainer.appendChild(emoticonItem);
            });

            const modal = new bootstrap.Modal(document.getElementById('emoticonModal'));
            modal.show();
        })
        .catch(error => console.error('Error loading emoticon details:', error));
}

// 显示表情详情（二级模态框）
function showEmoticonDetail(baseUrl, englishName, filename, name) {
    // 更新预览图
    const imageUrl = `${baseUrl}${englishName}/${filename}`;
    const previewImage = document.getElementById('previewImage');
    previewImage.src = imageUrl;
    previewImage.alt = name;
    const atkEmoticon = englishName + "_" + filename.split('.')[0];

    // 更新模态框标题
    const detailModalTitle = document.getElementById('emoticonDetailModalLabel');
    detailModalTitle.textContent = name;

    // 更新各种格式的链接
    document.getElementById('urlLink').value = imageUrl;
    document.getElementById('markdownLink').value = `![${name}](${imageUrl})`;
    document.getElementById('htmlLink').value = `<img src="${imageUrl}" alt="${name}">`;
    document.getElementById('bbcodeLink').value = `[img]${imageUrl}[/img]`;
    document.getElementById('artalkLink').value = `<img src="${imageUrl}" atk-emoticon="${atkEmoticon}">`;

    // 显示二级模态框
    const detailModal = new bootstrap.Modal(document.getElementById('emoticonDetailModal'));
    detailModal.show();
}

// 复制到剪贴板
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');

    // 显示提示
    const toast = new bootstrap.Toast(document.getElementById('copyToast'));
    toast.show();
}



function initArtalk() {
    const emoticonLink = document.getElementById('emoticonLink').value;
    Artalk.init({
        el: '#Comments',
        server: 'https://artalk.hzchu.top',
        site: 'Emoticons',
        title: 'Emoticons',
        placeholder: '这是一个demo...\n点击表情按钮查看表情(～￣▽￣)～',
        emoticons: `${emoticonLink}`,
        useBackendConf: false,
        locale: "zh-CN"
    })
}