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
                                const displayUrl = `https://${currentDomain}/json/artalk/${emoticon.english_name}.json`;
                                emoticonDiv.innerHTML = `
                                    <div class="card cursor-pointer" style="cursor: pointer;" onclick="showEmoticons('${emoticon.english_name}', '${emoticon.chinese_name}')">
                                        <div class="card-body">
                                            <h5 class="card-title">${emoticon.chinese_name} (${emoticon.english_name})</h5>
                                            <p class="card-text">来源: <a href="${emoticon.source}" target="_blank" onclick="event.stopPropagation()">${emoticon.source}</a></p>
                                            <p class="card-text">描述: ${emoticon.source_description || '暂无描述'}</p>
                                            <p class="card-text">路径: /emoticons/${emoticon.english_name}/</p>
                                            <p class="card-text">引用链接: <a href="${displayUrl}" target="_blank" onclick="event.stopPropagation()">${displayUrl}</a></p>
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
                            const imageUrl = `https://${currentDomain}/emoticons/${englishName}/${filename}`;
                            const atkEmoticon = englishName + "_" + filename.split('.')[0];
                            emoticonItem.innerHTML = `
                                <div class="card h-100 cursor-pointer" onclick="showEmoticonDetail('${imageUrl}', '${alias || filename}')">
                                    <img src="${imageUrl}" class="card-img-top p-2" alt="${alias || filename}" style="object-fit: contain; height: 100px;" data-atk-emoticon="${atkEmoticon}">
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
            function showEmoticonDetail(imageUrl, name) {
                // 更新预览图
                const previewImage = document.getElementById('previewImage');
                let imageUrl = previewImage.src;
                let name = previewImage.alt;
                let emoticon = previewImage.dataset.atkEmoticon;

                // 更新模态框标题
                const detailModalTitle = document.getElementById('emoticonDetailModalLabel');
                detailModalTitle.textContent = name;

                // 更新各种格式的链接
                document.getElementById('urlLink').value = imageUrl;
                document.getElementById('markdownLink').value = `![${name}](${imageUrl})`;
                document.getElementById('htmlLink').value = `<img src="${imageUrl}" alt="${name}">`;
                document.getElementById('bbcodeLink').value = `[img]${imageUrl}[/img]`;
                document.getElementById('artalkLink').value = `<img src="${imageUrl}" atk-emoticon="${emoticon}">`;

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