const fs = require("fs");
const path = require("path");

const PUBLIC_FOLDER = path.join(__dirname, "..", "public");
const PFP_FOLDER = path.join(PUBLIC_FOLDER, "pfp");

const handleJsonImage = async (user, newImageData) => {
    if (!newImageData) return;

    // ✅ Ensure /public/pfp exists
    if (!fs.existsSync(PFP_FOLDER)) {
        fs.mkdirSync(PFP_FOLDER, { recursive: true });
    }

    // Delete old image if exists
    if (user.imagePath) {
        const oldPath = path.join(__dirname, "..", user.imagePath);
        try {
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
            console.error("Failed to delete old image:", err);
        }
    }

    // Save new image
    const filename = `${Date.now()}-${Math.floor(Math.random() * 1e18)}.jpg`;
    const buffer = Buffer.from(newImageData.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const newPath = path.join(PFP_FOLDER, filename);

    fs.writeFileSync(newPath, buffer);

    // Save path (use forward slashes for Linux)
    user.imagePath = `public/pfp/${filename}`;
    await user.save();
};

module.exports = handleJsonImage;
