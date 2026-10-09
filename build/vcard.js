// vCard 3.0 generated from site.yaml.
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

function fold(line) {
  const out = [];
  while (line.length > 74) {
    out.push(line.slice(0, 74));
    line = " " + line.slice(74);
  }
  out.push(line);
  return out.join("\r\n");
}

function buildVcard(d, photoJpegBase64) {
  const parts = d.founder.name.trim().split(/\s+/);
  const family = parts.length > 1 ? parts.pop() : "";
  const given = parts.join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(d.founder.name)}`,
    `ORG:${esc(d.company.name)}`,
    `TITLE:${esc(d.founder.title)}`,
  ];
  if (d.contact.phone) lines.push(`TEL;TYPE=CELL:${d.contact.phone}`);
  if (d.contact.whatsapp && d.contact.whatsapp !== d.contact.phone) lines.push(`TEL;TYPE=CELL:${d.contact.whatsapp}`);
  if (d.contact.email) lines.push(`EMAIL;TYPE=INTERNET:${d.contact.email}`);
  lines.push(`URL:${d.site.url}`);
  if (photoJpegBase64) lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoJpegBase64}`);
  lines.push("END:VCARD");
  return lines.map(fold).join("\r\n") + "\r\n";
}

module.exports = { buildVcard };
