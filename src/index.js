import "./styles.css";
import * as Tone from "tone";
import { throttle } from "lodash";

const player = new Tone.Player("/audio/og.m4a").toMaster();
// sync the Players to the Transport like this
player.sync().start(0);
player.volume.value = -10;

const filter = new Tone.LowpassCombFilter({
  delayTime: 0.1,
  resonance: 0.1
}).toDestination();

player.connect(filter);

document.getElementById("app").innerHTML = `
  <h1>freefone</h1>
  <button class="play" >play</button>
  <button class="pause">pause</button>
  <button class="delay">more delayyyy</button>
  <div>
    <span>delayTime: </span>
    <span class="delay"></span>
  </div>
  <div>
    <span>resonance: </span>
    <span class="resonance"></span>
  </div>
`;

const playBtn = document.querySelector("button.play");
const pauseBtn = document.querySelector("button.pause");
const delayBtn = document.querySelector("button.delay");
const delaySpan = document.querySelector("span.delay");
const resonanceSpan = document.querySelector("span.resonance");

playBtn.addEventListener("click", () => {
  Tone.loaded().then(() => {
    Tone.Transport.start();
  });
});

pauseBtn.addEventListener("click", () => {
  Tone.loaded().then(() => {
    Tone.Transport.pause();
  });
});

delayBtn.addEventListener("click", () => {
  if (filter.delayTime.value < 1) {
    filter.delayTime.value += 0.1;
  }
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
}, 500);

document.addEventListener("mousemove", (event) => {
  setFilter(event.offsetX, event.offsetY);
});
