// QR codes generated at build time. ECC level Q, square modules, navy on white, 4-module quiet zone.
const QRCode = require("qrcode");

const opts = { errorCorrectionLevel: "Q", margin: 4, color: { dark: "#0B1F45", light: "#FFFFFF" } };

const qrSvg = (url) => QRCode.toString(url, { ...opts, type: "svg" });
const qrPng = (url, size = 2048) => QRCode.toBuffer(url, { ...opts, type: "png", width: size });

module.exports = { qrSvg, qrPng };
