let allEmoticonsData = {};
let activeTag = null;

// 读取 display_all.json 文件（一次性加载所有表情包数据）
fetch('/json/display_all.json')
    .then(response => response.json())
    .then(data => {
        allEmoticonsData = data;
        const emoticonsList = document.getElementById('emoticons-list');

        // 收集所有标签（排除"未分类"）
        const allTags = new Set();
        Object.values(data).forEach(emoticon => {
            (emoticon.tags || []).forEach(tag => {
                if (tag !== '未分类') allTags.add(tag);
            });
        });

        // 渲染标签筛选栏
        const tagFilter = document.getElementById('tag-filter');
        const tagBtn = document.createElement('span');
        tagBtn.className = 'tag-btn active';
        tagBtn.textContent = '全部';
        tagBtn.onclick = () => filterByTag(null);
        tagFilter.appendChild(tagBtn);

        // 固定添加"未分类"按钮
        const unclassifiedBtn = document.createElement('span');
        unclassifiedBtn.className = 'tag-btn';
        unclassifiedBtn.textContent = '未分类';
        unclassifiedBtn.onclick = () => filterByTag('未分类');
        tagFilter.appendChild(unclassifiedBtn);

        // 按字母排序添加其他标签
        if (allTags.size > 0) {
            const sortedTags = [...allTags].sort((a, b) => a.localeCompare(b));
            sortedTags.forEach(tag => {
                const btn = document.createElement('span');
                btn.className = 'tag-btn';
                btn.textContent = tag;
                btn.onclick = () => filterByTag(tag);
                tagFilter.appendChild(btn);
            });
        }

        Object.values(data).forEach(emoticon => {
            const emoticonDiv = document.createElement('div');
            emoticonDiv.className = 'col-md-4 mb-4';
            // 标签处理：空标签归入"未分类"
            const emoticonTags = (emoticon.tags || []).filter(tag => tag !== '未分类');
            emoticonDiv.dataset.tags = emoticonTags.length > 0 ? emoticonTags.join(',') : '未分类';
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
            } else if (emoticon.source.startsWith('bilibili')) {
                sourceHTML = `<a href="${emoticon.source}" target="_blank" rel="nofollow noopener noreferrer" onclick="event.stopPropagation()">BiliBili APP</a>`;

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
                        <h5 class="card-title">${emoticon.chinese_name} (${emoticon.english_name})<img src="${randomImageUrl}" alt="${randomAlias}" class="emoticon-preview"></h5>
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
    .catch(error => console.error('Error loading emoticons:', error));

// 按标签筛选
function filterByTag(tag) {
    activeTag = tag;
    document.querySelectorAll('#tag-filter .tag-btn').forEach(btn => {
        btn.classList.toggle('active', tag === null ? btn.textContent === '全部' : btn.textContent === tag);
    });
    document.querySelectorAll('#emoticons-list > div').forEach(card => {
        if (tag === null) {
            card.classList.remove('emoticon-card-hidden');
        } else {
            const tags = card.dataset.tags.split(',');
            card.classList.toggle('emoticon-card-hidden', !tags.includes(tag));
        }
    });
}

// 显示表情包列表（一级模态框）
function showEmoticons(englishName, chineseName) {
    const data = allEmoticonsData[englishName];
    if (!data) return;

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
    document.getElementById('twikooLink').value = `<img src="${imageUrl}" alt=":${name}:" class="tk-owo-emotion">`;
    document.getElementById('stellarLink').value = `{% emoji rawurl:${imageUrl} %}`;
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