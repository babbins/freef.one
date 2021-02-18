import "regenerator-runtime/runtime";
import "focus-visible";
import "./styles.css";
import * as Tone from "tone";
import { throttle } from "lodash";
import audioUrl from "./audio/og.m4a";

document.getElementById("app").innerHTML = `
  <h1>freefone</h1>
  <button disabled class="toggle-play" >play</button>
  <div>
    <span>delayTime: </span>
    <span class="delay"></span>
  </div>
  <div>
    <span>resonance: </span>
    <span class="resonance"></span>
  </div>
`;

const player = new Tone.Player({
  url: audioUrl,
  onload: () => {
    Array.from(document.querySelectorAll("button")).forEach((b) =>
      b.removeAttribute("disabled")
    );
  }
}).toDestination();

// sync the Players to the Transport like this
player.sync().start(0);
player.volume.value = -10;

const filter = new Tone.LowpassCombFilter({
  delayTime: 0.1,
  resonance: 0.1
}).toDestination();

player.connect(filter);

const togglePlayBtn = document.querySelector("button.toggle-play");
const delaySpan = document.querySelector("span.delay");
const resonanceSpan = document.querySelector("span.resonance");

let isAudioContextStarted = false;
let isPlaying = false;
togglePlayBtn.addEventListener("click", async () => {
  if (isPlaying) {
    Tone.Transport.pause();
    togglePlayBtn.innerText = "play";
  } else {
    if (!isAudioContextStarted) {
      await Tone.start();
      isAudioContextStarted = true;
    }
    Tone.Transport.start();
    togglePlayBtn.innerText = "pause";
  }

  isPlaying = !isPlaying;
});

const setFilter = throttle((x, y) => {
  const delayTime = x / window.innerWidth;
  const resonance = y / window.innerHeight;
  if (delayTime > 0 && delayTime < 1) {
    delaySpan.innerHTML = delayTime;
    filter.delayTime.value = delayTime;
  }
  if (resonance > 0 && resonance < 1) {
    resonanceSpan.innerHTML = resonance;
    filter.resonance.value = resonance;
  }
}, 50);

document.addEventListener("mousemove", (event) => {
  if (event.target === togglePlayBtn) return;
  setFilter(event.offsetX, event.offsetY);
});
