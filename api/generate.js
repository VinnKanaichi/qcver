const { createCanvas, loadImage } = require("canvas");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { text, name, avatar } = req.body;

    if (!text || !name || !avatar) {
      console.log("❌ Missing required field(s):", { text, name, avatar });
      return res.status(400).json({ error: "Missing text, name, or avatar" });
    }

    const canvas = createCanvas(512, 768);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      const img = await loadImage(avatar);
      ctx.beginPath();
      ctx.arc(64, 64, 48, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 16, 16, 96, 96);
    } catch (err) {
      console.error("❌ Error loading avatar:", err.message);
    }

    ctx.fillStyle = "#000000";
    ctx.font = "bold 22px Arial";
    ctx.fillText(name, 128, 60);

    ctx.font = "18px sans-serif";
    ctx.fillText(text, 32, 160, 448);

    const buffer = canvas.toBuffer("image/png");
    const base64Image = buffer.toString("base64");

    res.status(200).json({ result: base64Image });
  } catch (e) {
    console.error("❌ Internal error:", e);
    res.status(500).json({ error: "Internal Server Error", details: e.message });
  }
};
