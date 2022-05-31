
async function getSuraList(el) {
  const res = await fetch("./src/data/surah-title.json");
  const data = await res.json();
  
  console.log("HERE", { data })

  let html = ""; 
  for(let surah of data) {
    html += `<div class="surah"><a href="/surah.html?surah=${surah.transliteration}">${surah.name} (${surah.transliteration}) - ${surah.nAyah}</a></div>`;
  }

  // console.log(this, e)
  el.innerHTML = html;
  
}

async function getAyahList(el) {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  const res = await fetch(`./src/data/surah/${params.surah}.json`);
  const data = await res.json();
  
  

  let html = ""; 
  for(let surah of data) {
    // html += `<div class="ayah">${surah.arabic} <br /> <br /> ${surah.translation}</div>`;
    html += `
        <div class="ayah-item">
          <div class="controls">
            <span>Bookmark</span>
            <span>Share</span>
          </div>
          <div class="ayah-text">
            <div class="arabic">${surah.arabic}</div>
            <div class="translation">${surah.translation}</div>
          </div>
        </div>
    `;
  }


  el.innerHTML = html;

  const title = document.getElementById('surah-title');

  title.innerText = `${params.surah}`;
  
  const bismillah = document.getElementById('bismillah');

  if(params.surah === "Al-Faatiha") {
    bismillah.remove();
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