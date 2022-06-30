
let surahList = [];



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
      <div class="ayah-item">
        <div class="controls">
          <span>
            <img src="src/img/icons/play.svg" alt="">
          </span>
          <span>
            <img src="src/img/icons/bookmark.svg" alt="">
          </span>
          <span>
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

function registerEvents() {
  const surahList = document.getElementById("surah-list");
  const ayahList = document.getElementById("ayah-list");
  console.log(ayahList)
  if(surahList) {
    getSuraList(surahList);
  }

  if(ayahList) {
    getAyahList(ayahList);
  }
}

registerEvents()