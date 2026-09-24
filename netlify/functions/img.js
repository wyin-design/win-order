exports.handler = async function(event) {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) return { statusCode: 400, body: 'Missing url' };

  const fullUrl = url.startsWith('http') ? url : 'https://' + url;

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Referer': 'https://store.wyin-design.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) return { statusCode: response.status, body: 'Image fetch failed: ' + response.status };

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800',
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch (e) {
    return { statusCode: 500, body: 'Error: ' + e.message };
  }
};
