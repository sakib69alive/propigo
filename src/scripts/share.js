(function () {
  document.documentElement.classList.add("js");
  var link = document.querySelector("link[rel=canonical]");
  var url = link ? link.href : location.href;
  var toast = document.getElementById("toast");
  var timer;

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

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-action]");
    if (!b) return;
    if (b.dataset.action === "share") share();
    if (b.dataset.action === "copy") copy();
  });
})();
