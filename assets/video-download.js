(() => {
  "use strict";

  const setupVideoDownloads = () => {
    const links = document.querySelectorAll("[data-video-download]");
    if (!links.length) return;

    const triggerDownload = (url) => {
      if (!url) return;
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.setAttribute("download", "");
      anchor.rel = "nofollow";
      anchor.style.position = "absolute";
      anchor.style.left = "-9999px";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    };

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        triggerDownload(link.getAttribute("data-video-download"));
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupVideoDownloads);
  } else {
    setupVideoDownloads();
  }
})();
