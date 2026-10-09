// Validates content/site.yaml and normalises values. Throws (fails the build) on any error.
const PLATFORMS = ["youtube", "facebook", "instagram", "tiktok", "linkedin", "x", "threads", "telegram"];

function normalisePhone(raw, label, errors) {
  const s = String(raw || "").replace(/[\s\-().]/g, "");
  if (!s) return "";
  if (/^\+\d{8,15}$/.test(s)) return s;
  if (/^8801\d{9}$/.test(s)) return "+" + s;
  if (/^01\d{9}$/.test(s)) return "+88" + s;
  errors.push(`${label}: "${raw}" is not a valid phone number. Use 01XXXXXXXXX or +8801XXXXXXXXX.`);
  return "";
}

function httpsUrl(raw, label, errors) {
  const s = String(raw || "").trim();
  if (!s) return "";
  try {
    const u = new URL(s);
    if (u.protocol !== "https:") throw new Error("not https");
    return u.href;
  } catch {
    errors.push(`${label}: "${raw}" must be a full link starting with https://`);
    return "";
  }
}

function validate(raw) {
  const errors = [];
  const warnings = [];
  const d = JSON.parse(JSON.stringify(raw || {}));
  const need = (path, v) => {
    if (!v || !String(v).trim()) errors.push(`${path} is required.`);
  };

  d.site = d.site || {};
  need("site.url", d.site.url);
  d.site.url = httpsUrl(d.site.url, "site.url", errors);
  if (d.site.url && !d.site.url.endsWith("/")) d.site.url += "/";
  d.site.qr_target = httpsUrl(d.site.qr_target || d.site.url, "site.qr_target", errors) || d.site.url;
  need("site.title", d.site.title);
  need("site.description", d.site.description);
  d.site.year = String(d.site.year || new Date().getFullYear());

  d.founder = d.founder || {};
  need("founder.name", d.founder.name);
  d.founder.name = String(d.founder.name || "");
  d.founder.title = d.founder.title || "Founder";
  d.founder.photo = String(d.founder.photo || "").trim();
  d.founder.initials = d.founder.name.replace(/[\[\]]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "P";

  d.company = d.company || {};
  need("company.tagline", d.company.tagline);
  d.company.name = d.company.name || "Propigo";
  if (!Array.isArray(d.company.about) || !d.company.about.length) errors.push("company.about must be a list of sentences.");

  d.categories = Array.isArray(d.categories) ? d.categories : [];
  d.categories.forEach((c, i) => {
    need(`categories[${i}].title`, c.title);
    if (!["building", "car"].includes(c.icon)) errors.push(`categories[${i}].icon must be "building" or "car".`);
  });

  d.how = d.how || { title: "How it works", steps: [] };
  d.how.steps = d.how.steps || [];

  d.cta = d.cta || {};
  d.contact = d.contact || {};
  const c = d.contact;
  c.phone = normalisePhone(c.phone, "contact.phone", errors);
  c.whatsapp = normalisePhone(c.whatsapp, "contact.whatsapp", errors);
  c.whatsapp_digits = c.whatsapp.replace("+", "");
  c.whatsapp_message = String(c.whatsapp_message || "");
  c.email = String(c.email || "").trim();
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) errors.push(`contact.email: "${c.email}" is not a valid email address.`);

  const rawSoc = d.socials || {};
  d.socials = {};
  ["company", "founder"].forEach((owner) => {
    const m = rawSoc[owner] || {};
    Object.keys(m).forEach((k) => {
      if (!PLATFORMS.includes(k)) errors.push(`socials.${owner}.${k} is unknown. Allowed: ${PLATFORMS.join(", ")}.`);
    });
    d.socials[owner] = PLATFORMS.map((p) => ({ platform: p, url: httpsUrl(m[p], `socials.${owner}.${p}`, errors) }));
  });

  d.about_page = d.about_page || { title: "About", sections: [] };
  d.about_page.sections = d.about_page.sections || [];

  if (/USERNAME|REPO/.test(d.site.url)) warnings.push("site.url still has USERNAME/REPO. Set the real GitHub address before printing cards.");
  if (JSON.stringify(d).includes("[PLACEHOLDER]") || d.founder.name.startsWith("[")) warnings.push("Placeholder text is still present in content/site.yaml.");
  if (!c.phone && !c.whatsapp && !c.email) warnings.push("No contact method set (phone / whatsapp / email).");

  if (errors.length) throw new Error("\n\ncontent/site.yaml has problems:\n  - " + errors.join("\n  - ") + "\n");
  warnings.forEach((w) => console.warn("[propigo] warning: " + w));
  return d;
}

module.exports = { validate, PLATFORMS };
