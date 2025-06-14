const nodeHtmlToImage = require('node-html-to-image');

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan POST" });
  }

  const { text = "", name = "Pengguna", avatar } = req.body;

  const htmlTemplate = `
    <html>
      <head>
        <style>
          body {
            width: 512px;
            height: 768px;
            background: white;
            font-family: sans-serif;
            padding: 20px;
            box-sizing: border-box;
          }
          .wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .avatar {
            width: 96px;
            height: 96px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 16px;
          }
          .name {
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 12px;
          }
          .text {
            font-size: 18px;
            text-align: center;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          ${avatar ? `<img src="${avatar}" class="avatar" />` : ''}
          <div class="name">${name}</div>
          <div class="text">${text}</div>
        </div>
      </body>
    </html>
  `;

  try {
    const image = await nodeHtmlToImage({
      html: htmlTemplate,
      quality: 100,
      type: 'png',
      encoding: 'base64'
    });

    res.json({ result: image });
  } catch (err) {
    res.status(500).json({ error: "Gagal membuat gambar", detail: err.message });
  }
};