import nodeHtmlToImage from 'node-html-to-image';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { text = '', name = 'User', avatar = '' } = req.body;

  try {
    const image = await nodeHtmlToImage({
      html: `
      <html>
        <body style="width:512px;height:768px;margin:0;padding:0;background:#ffffff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;">
          ${ avatar ? `<img src="${avatar}" style="width:96px;height:96px;border-radius:50%;margin-bottom:20px;" />` : '' }
          <div style="font-size:22px;font-weight:bold;margin-bottom:16px;">${name}</div>
          <div style="font-size:18px;text-align:center;padding: 0 20px;white-space:pre-wrap;">${text}</div>
        </body>
      </html>`,
      type: 'png',
      encoding: 'base64',
      quality: 100
    });

    return res.status(200).json({ result: image });
  } catch (err) {
    console.error('Error generate quote image:', err);
    return res.status(500).json({ error: 'Internal error', detail: err.message });
  }
}
