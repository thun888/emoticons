export async function onRequestGet(event) {
  const { request } = event;
  const urlInfo = new URL(request.url);
  const originUrl = `https://emoticons-cloudflare.hzchu.top${urlInfo.pathname}`;
  const cacheKey = new Request(originUrl);
  const cache = await caches.open('cache');
  // 如果?delete 则删除缓存
  if (urlInfo.searchParams.get('delete')) {
    await cache.delete(cacheKey);
    return new Response('删除成功', { status: 200 });
  }

  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse && urlInfo.pathname.startsWith('/emoticons')) {
    // console.log('缓存命中');
    cachedResponse.headers.append('x-edgefunctions-cache', 'HIT');
    return cachedResponse;
  }

  const response = await fetch(cacheKey, {
    headers: {
      'Host': 'emoticons-cloudflare.hzchu.top'
    }
  });

  const contentType = response.headers.get('content-type');

  const newResponse = new Response(response.body, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Max-Age': '2592000',
      'Cache-Control': 'public,max-age=2592000,immutable',
      'content-type': contentType
    }
  });
  if (response.status === 200) {
    await cache.put(cacheKey, newResponse.clone());
  }
  newResponse.headers.append('x-edgefunctions-cache', 'MISS');
  return newResponse;
}
