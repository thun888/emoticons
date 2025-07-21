export async function onRequestGet(event) {
  // event:['request','params','env']
  // request: ['maxFollow','version','eo','cf','url','referrer','redirect','mode','method','integrity','headers','credentials','cache','bodyUsed','body','destination','referrerPolicy']
  // params: ['default']
  // env: 环境变量
  const { request } = event;
  const urlInfo = new URL(request.url);
  const originUrl = `http://emoticons-assets.hzchu.top${urlInfo.pathname}${urlInfo.search}`;

  const cache = await caches.open('cache');

  const cachedResponse = await cache.match(originUrl);
  console.log(cachedResponse);
  if (cachedResponse) {
    console.log('缓存命中');
    return cachedResponse;
  }

  const proxyRequest = new Request(originUrl, {
    method: request.method,
    body: request.body,
    headers: request.headers,
    cache: 'force-cache',
  });
  proxyRequest.headers.set('Host', 'emoticons-assets.hzchu.top');


  // fetch 反向代理
  const response = await fetch(proxyRequest);

  // 读取content-type
  const contentType = response.headers.get('content-type');
  /** 删除响应头 **/
  const newResponse = new Response(response.body, {
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Max-Age': '2592000',
      'Cache-Control': 'public,max-age=2592000,immutable',
      'content-type': contentType
    })
  });
  await cache.put(originUrl, newResponse.clone());


  newResponse.headers.append('x-edgefunctions-cache', 'MISS');

  return newResponse;
}