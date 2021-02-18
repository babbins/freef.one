import "./styles.css";
import * as Tone from "tone";
import { setLogger } from "tone/build/esm/core/util/Debug";

const player = new Tone.Player("/audio/cutthroat.mp3").toMaster();
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
  <span>Mouse X:  </span>
  <span class="x"></span>
  <span>Mouse Y:  </span>
  <span class="y"></span>
  <span>delayTime: </span>
  <span class="delay"></span>
  <span>resonance: </span>
  <span class="resonance"></span>
`;

const playBtn = document.querySelector("button.play");
const pauseBtn = document.querySelector("button.pause");
const delayBtn = document.querySelector("button.delay");
const xSpan = document.querySelector("span.x");
const ySpan = document.querySelector("span.y");
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

document.addEventListener("mousemove", (event) => {
  // console.log(window.innerWidth, event.offsetX);
  xSpan.innerHTML = event.offsetX;
  ySpan.innerHTML = event.offsetY;
  const delayTime = event.offsetX / window.innerWidth;
  const resonance = event.offsetY / window.innerHeight;
  if (delayTime > 0 && delayTime < 1) {
    delaySpan.innerHTML = delayTime;
    filter.delayTime.value = delayTime;
  }
  if (resonance > 0 && resonance < 1) {
    resonanceSpan.innerHTML = resonance;
    filter.resonance.value = resonance;
  }
});
