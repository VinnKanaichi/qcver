import { createCanvas, loadImage } from "canvas";

export default async function handler(req, res) {
  try {
    const { text = "", name = "Pengguna", avatar } = req.body;

    const canvas = createCanvas(512, 768);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Avatar
    if (avatar) {
      try {
        const img = await loadImage(avatar);
        ctx.save();
        ctx.beginPath();
        ctx.arc(64, 64, 48, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 16, 16, 96, 96);
        ctx.restore();
      } catch (e) {
        console.log("⚠️ Avatar gagal dimuat:", e.message);
      }
    }

    // Nama
    ctx.fillStyle = "#000";
    ctx.font = "bold 22px Arial";
    ctx.fillText(name, 130, 60);

    // Teks
    ctx.font = "18px sans-serif";
    ctx.fillText(text, 32, 160, 448);

    // Buffer ke Base64
    const buffer = canvas.toBuffer("image/png");
    const base64Image = buffer.toString("base64");

    res.status(200).json({ result: base64Image });
  } catch (err) {
    console.error("❌ Error di API:", err.message);
    res.status(500).json({ error: "Internal error", detail: err.message });
  }
}
