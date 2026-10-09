const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { validate } = require("./build/validate");
const { post } = require("./build/post");
const { qrSvg } = require("./build/qr");
const { icons, brandNames } = require("./build/icons");
const logo = require("./build/logo-svg");
const { heroArt } = require("./build/art");

// Light variant of the logo (navy parts turned near-white) for use on dark backgrounds.
const logoLight = logo.inner.replace(/#002047/g, "#eef2fa").replace(/pg-fade/g, "pg-fade-l").replace(/pg-gold/g, "pg-gold-l");

const siteFile = process.env.SITE_FILE || path.join(__dirname, "content", "site.yaml");
const read = (...p) => fs.readFileSync(path.join(__dirname, ...p), "utf8");

module.exports = function (eleventyConfig) {
  const site = validate(YAML.parse(fs.readFileSync(siteFile, "utf8")));
  const pathPrefix = new URL(site.site.url).pathname;

  eleventyConfig.addGlobalData("site", site);
  eleventyConfig.addGlobalData("icons", icons);
  eleventyConfig.addGlobalData("brandNames", brandNames);
  eleventyConfig.addGlobalData("logoInner", logo.inner);
  eleventyConfig.addGlobalData("logoLight", logoLight);
  eleventyConfig.addGlobalData("heroArt", heroArt());
  eleventyConfig.addGlobalData("logoViewBox", logo.viewBox);
  eleventyConfig.addGlobalData("qrInline", () => qrSvg(site.site.url + "c/"));
  // Styles and the tiny share script are inlined into the page: fewer requests on mobile data.
  eleventyConfig.addGlobalData("css", () =>
    ["tokens", "base", "components"].map((n) => read("src", "styles", n + ".css")).join("\n")
  );
  eleventyConfig.addGlobalData("js", () => read("src", "scripts", "share.js"));

  eleventyConfig.addFilter("encode", (s) => encodeURIComponent(s));

  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    await post(site, dir.output);
  });

  eleventyConfig.addWatchTarget("content/");
  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addWatchTarget("src/scripts/");

  return {
    pathPrefix,
    dir: { input: "src", output: "_site", includes: "partials" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
};
