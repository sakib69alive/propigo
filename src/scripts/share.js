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
      return navigator.clipboard.writeText(url).then(function () { say("Link copied"); }, function () { fallback(); });
    }
    fallback();
  }

  function fallback(val) {
    var t = document.createElement("textarea");
    t.value = typeof val === "string" ? val : url;
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

  var form = document.getElementById("collab");
  if (form) {
    form.addEventListener("click", function (e) {
      var b = e.target.closest("[data-send]");
      if (!b) return;
      if (!form.reportValidity()) return;
      var f = form.elements;
      var text = "Collaboration request for Propigo\n\n" +
        "Name: " + f.name.value + "\n" +
        "Business: " + f.business.value + "\n" +
        "Wants to promote: " + f.sector.value + "\n" +
        (f.website.value ? "Website: " + f.website.value + "\n" : "") +
        "Phone / WhatsApp: " + f.phone.value + "\n" +
        (f.email.value ? "Email: " + f.email.value + "\n" : "") +
        "\nAbout the business:\n" + f.details.value;
      var kind = b.dataset.send;
      if (kind === "wa") window.open("https://wa.me/" + form.dataset.wa + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      else if (kind === "mail") location.href = "mailto:" + form.dataset.mail + "?subject=" + encodeURIComponent("Collaboration request: " + f.business.value) + "&body=" + encodeURIComponent(text);
      else if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { say("Details copied"); });
      else fallback(text);
    });
  }

  // Heavy, weighted glide: a small scroll off the first screen carries on by itself and settles on the next section
  var hero = document.querySelector(".hero.home");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hero && !reduce) {
    var lastY = 0, dir = 0, idle, touching = false, gliding = false, raf;
    var done = function () { gliding = false; lastY = window.scrollY; };
    var stop = function () { if (gliding) { cancelAnimationFrame(raf); done(); } };
    var glide = function (to) {
      var from = window.scrollY, dist = to - from, dur = Math.min(1100, 520 + Math.abs(dist) * 0.6), t0 = performance.now();
      gliding = true;
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        window.scrollTo({ top: from + dist * e, behavior: "instant" });
        if (p < 1 && gliding) raf = requestAnimationFrame(step); else done();
      })(t0);
    };
    var settle = function () {
      if (touching || gliding) return;
      var next = hero.nextElementSibling;
      if (!next) return;
      var end = Math.round(next.getBoundingClientRect().top + window.scrollY - 12);
      var y = window.scrollY;
      if (y < 4 || y > end - 4) return;
      glide(dir > 0 ? end : 0);
    };
    window.addEventListener("scroll", function () {
      if (gliding) return;
      dir = window.scrollY > lastY ? 1 : -1;
      lastY = window.scrollY;
      clearTimeout(idle);
      idle = setTimeout(settle, 140);
    }, { passive: true });
    window.addEventListener("touchstart", function () { touching = true; stop(); }, { passive: true });
    window.addEventListener("touchend", function () { touching = false; clearTimeout(idle); idle = setTimeout(settle, 140); }, { passive: true });
    window.addEventListener("wheel", stop, { passive: true });
  }
})();
