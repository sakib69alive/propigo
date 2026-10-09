(function () {
  document.documentElement.classList.add("js");
  var link = document.querySelector("link[rel=canonical]");
  // Always share the home page address (the card), never a sub-page
  var url = link ? link.href.replace(/(about|founder)\/$/, "") : location.href;
  var toast = document.getElementById("toast");
  var sheet = document.getElementById("share");
  var timer, opener;

  function say(msg) {
    toast.textContent = msg;
    toast.classList.add("on");
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove("on"); }, 2200);
  }

  function copy() {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(url).then(function () { say("Link copied"); }, fallback);
    }
    fallback();
  }

  function fallback() {
    var t = document.createElement("textarea");
    t.value = url;
    t.setAttribute("readonly", "");
    t.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(t);
    t.select();
    try { document.execCommand("copy"); say("Link copied"); } catch (e) { say("Copy not supported"); }
    document.body.removeChild(t);
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
    } else {
      copy();
    }
  }

  function openSheet(from) {
    opener = from;
    sheet.classList.add("open");
    document.body.style.overflow = "hidden";
    var b = sheet.querySelector(".btn.gold");
    if (b) b.focus();
  }
  function closeSheet() {
    sheet.classList.remove("open");
    document.body.style.overflow = "";
    if (opener) opener.focus();
  }

  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]");
    if (o) { e.preventDefault(); return openSheet(o); }
    if (e.target.closest("[data-close]")) { e.preventDefault(); return closeSheet(); }
    var b = e.target.closest("[data-action]");
    if (!b) return;
    if (b.dataset.action === "share") share();
    if (b.dataset.action === "copy") copy();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet.classList.contains("open")) closeSheet();
  });
})();
