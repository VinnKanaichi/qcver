const { createCanvas, loadImage } = require("canvas");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { text, name, avatar } = req.body;

    const canvas = createCanvas(512, 768);
    const ctx = canvas.getContext("2d");

    // Background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar Avatar
    try {
      const img = await loadImage(avatar);
      ctx.beginPath();
      ctx.arc(64, 64, 48, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 16, 16, 96, 96);
      // HAPUS ctx.restore(); karena tidak ada ctx.save()
    } catch (err) {
      console.log("Avatar load error:", err.message);
    }

    // Nama
    ctx.fillStyle = "#000000";
    ctx.font = "bold 22px Arial";
    ctx.fillText(name || "Pengguna", 128, 60);

    // Teks
    ctx.font = "18px sans-serif";
    ctx.fillText(text || "", 32, 160, 448);

    const buffer = canvas.toBuffer("image/png");
    const base64Image = buffer.toString("base64");

    res.status(200).json({ result: base64Image });
  } catch (e) {
    console.error("Internal Server Error:", e);
    res.status(500).send("Internal Server Error");
  }
};
