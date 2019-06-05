import Plyr from "plyr";

let playButton;

function renderVideo() {
  document.removeEventListener("scroll", onScroll);
  const elem = document.getElementById("intro__video");
  elem.style.display = "block";

  elem.innerHTML = `
<iframe
  src="https://www.youtube.com/embed/9kEMzXw7P2A?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
  allowfullscreen
  allowtransparency
>
</iframe>
`;

  new Plyr(elem);
}

function onScroll() {
  if (!playButton) return;

  if (playButton.getBoundingClientRect().top - window.innerHeight <= 0) {
    renderVideo();
  }
}

function onDomContentLoaded() {
  playButton = document.querySelector(".intro__play-button");
  document.addEventListener("scroll", onScroll);
}

document.addEventListener("DOMContentLoaded", onDomContentLoaded);
