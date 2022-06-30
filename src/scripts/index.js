
let surahList = [];

let audioTimestamps = [];
let currentlyPlaying;
let audioTimeouts;


async function getSuraList(el) {
  const res = await fetch("./src/data/surah-title.json");
  const data = await res.json();
  surahList = [...data];

  let html = ""; 
  for(let surah of surahList) {
    const { transliteration, name, order, nAyah, translation } = surah;
    html += `
    <a class="surah" href="./surah.html?surah=${surah.transliteration}">
      <div class="number-box">
        <div class="number">
          ${order}
        </div>
      </div>
      <div class="left">
        <span>${name}</span>
        <small>${translation}</small>
      </div>
      <div class="right">
        <span>${transliteration}</span>
        <small>${nAyah} ayahs</small>
      </div>
    </a>
    `;
  }
  el.innerHTML = html;
  
}

async function getAyahList(el) {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  const res = await fetch(`./src/data/surah/${params.surah}.json`);
  const data = await res.json();
  
  let html = ""; 
  
  let arabicNumbers = "٠١٢٣٤٥٦٧٨٩";

  for(const [idx, surah] of data.entries()) {
    html += `
      <div class="ayah-item"" data-idx="${idx}">
        <div class="controls">
          <span id="play-btn" onclick="playSurah(${idx})" >
            <img src="src/img/icons/play.svg" alt="">
          </span>
          <span id="copy-btn" onclick="copyText('${surah.arabic}', '${surah.translation}')">
            <img src="src/img/icons/copy.svg" alt="">
          </span>
        </div>
        <div class="ayah-text">
          <div class="arabic">${surah.arabic} <span class="ayah-number">${arabicNumbers[idx+1]}</div>
          <div class="translation">${surah.translation}</div>
        </div>
      </div>
    `;
  }


  el.innerHTML = html;

  const title = document.getElementById('surah-title');
  
  if(title) {
    title.innerText = `${params.surah}`;
  }
  
  const bismillah = document.getElementById('bismillah');

  if(params.surah === "Al-Faatiha") {
    bismillah?.remove();
  }

}

async function copyText(arabic, translation) {
  
  const text = 
    `${arabic}
   
  ${translation}
  
  https://oss.meedcodes.com/last-ten-surah/surah.html?surah=${location.search}
  `;
  
  await navigator.clipboard.writeText(text);
  alert("Copied to clipboard");
}

async function getAudioData() {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  const res = await fetch(`./src/data/surah-audio-timestamp/${params.surah}.json`);
  const data = await res.json();
  audioTimestamps = [...data];
}

function updateAudioSrc() {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  const audio = document.getElementsByTagName("audio")[0];
  if(audio) {
    audio.src = `./src/data/surah-audio/${params.surah}.mp3`;
  }
}

function playSurah(idx) {
  clearTimeout(audioTimeouts);

  /**
   * @type HTMLMediaElement
   */
  const audio = document.getElementsByTagName("audio")[0];
  const el = document.querySelector(`[data-idx="${idx}"]`);
  console.log(el);

  if(el) {
    /**
     * @type HTMLImageElement | null
     */
    const playBtn = el.querySelector("#play-btn > img");

    if(playBtn) {
      
      if(currentlyPlaying) {
        if(el.isEqualNode(currentlyPlaying)) {
          playBtn.src = "src/img/icons/play.svg";
          audio.pause();
          currentlyPlaying = null;
          return;
        }else {
          currentlyPlaying.querySelector("#play-btn > img").src = "src/img/icons/play.svg";
          playBtn.src = "src/img/icons/pause.svg";
        }
      }else {
        console.log('HERE')
        playBtn.src = "src/img/icons/pause.svg";
      }
    }
  }
  
  
  if(audio) {
    audio.currentTime = audioTimestamps[idx];
    currentlyPlaying = el;
    
    audio.play();

    if(idx !== audioTimestamps.length - 1) {
      audioTimeouts = setTimeout(() => {
        audio.pause();
        currentlyPlaying.querySelector("#play-btn > img").src = "src/img/icons/play.svg";
        currentlyPlaying = null;
      }, ((audioTimestamps[idx + 1] - audioTimestamps[idx]) * 1000));
    }
  }
}

function load() {
  const surahList = document.getElementById("surah-list");
  const ayahList = document.getElementById("ayah-list");
  if(surahList) {
    getSuraList(surahList);
  }

  if(ayahList) {
    getAyahList(ayahList);
    updateAudioSrc();
    getAudioData();
  }
}

load()