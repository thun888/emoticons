export async function onRequestGet(event) {
  const { request } = event;
  const urlInfo = new URL(request.url);
  const originUrl = `http://emoticons-assets.hzchu.top${urlInfo.pathname}${urlInfo.search}`;
  const cacheKey = new Request(originUrl);
  const cache = await caches.open('cache');

  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    console.log('缓存命中');
    cachedResponse.headers.append('x-edgefunctions-cache', 'HIT');
    return cachedResponse;
  }

  const response = await fetch(cacheKey, {
    headers: {
      'Host': 'emoticons-assets.hzchu.top'
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

  await cache.put(cacheKey, newResponse.clone());
  newResponse.headers.append('x-edgefunctions-cache', 'MISS');
  return newResponse;
}
