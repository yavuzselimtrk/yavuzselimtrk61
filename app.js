// ===== Basit PIN (opsiyonel) =====
const USE_PIN = false;        // PIN kapısı istiyorsan true yap
const PIN_CODE = "2704";      // örnek: ikinizin tarihi :)
const gate = document.getElementById('gate');
const pinInput = document.getElementById('pinInput');
const pinBtn = document.getElementById('pinBtn');
const pinError = document.getElementById('pinError');

if (USE_PIN) {
  gate.classList.remove('hide');
  pinBtn.addEventListener('click', () => {
    if (pinInput.value === PIN_CODE) gate.classList.add('hide');
    else pinError.textContent = "Hatalı PIN 🤍";
  });
  pinInput?.addEventListener('keydown', e => { if (e.key === 'Enter') pinBtn.click(); });
}

// ===== Tema =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') root.classList.add('light');
themeBtn.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// ===== Fotoğraf Verileri =====
// img/ klasörüne görselleri koy; buradan listeye ekle.
// w,h alanları opsiyonel (lightbox için yararlı). tags ile filtre çalışır.
const PHOTOS = [
  { src:'./img/img1.jpg',  w:1600, h:1067, title:'İlk kahve',            date:'2024-04-21', tags:['kahve','ilkler'] },
  { src:'./img/img2.jpg',  w:1600, h:2000, title:'Sahil yürüyüşü',       date:'2024-06-10', tags:['sahil','yaz'] },
  { src:'./img/img3.jpg',  w:1600, h:1067, title:'Gün batımı',           date:'2024-08-17', tags:['günbatımı','tatil'] },
  { src:'./img/img4.jpg',  w:1600, h:1200, title:'Doğum günü pastası',   date:'2025-02-10', tags:['doğum günü','ev'] },
  { src:'./img/img5.jpg',  w:1700, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img6.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img7.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img8.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img9.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img10.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img11.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img12.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img13.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img14.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  { src:'./img/img15.jpg',  w:1600, h:1200, title:'Kar manzarası',        date:'2025-01-05', tags:['kış','manzara'] },
  // ... istediğin kadar ekle
];

// ===== Etiketleri çıkar (dinamik) =====
const allTags = Array.from(new Set(PHOTOS.flatMap(p => p.tags || [])));
const tagChips = document.getElementById('tagChips');
let activeTag = 'tümü';
function drawChips(){
  tagChips.innerHTML = '';
  const tags = ['tümü', ...allTags];
  tags.forEach(t => {
    const b = document.createElement('button');
    b.className = 'chip' + (t===activeTag ? ' active' : '');
    b.textContent = t;
    b.addEventListener('click', ()=>{
      activeTag = t;
      drawChips();
      drawGrid();
    });
    tagChips.appendChild(b);
  });
}
drawChips();

// ===== Arama =====
const searchInput = document.getElementById('searchInput');
let q = '';
searchInput.addEventListener('input', () => {
  q = (searchInput.value || '').toLowerCase().trim();
  drawGrid();
});

// ===== Favoriler =====
const FAV_KEY = 'myGalleryFavs';
const favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
function toggleFav(src){
  if (favs.has(src)) favs.delete(src); else favs.add(src);
  localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favs)));
}

// ===== Grid çizimi =====
const gallery = document.getElementById('gallery');
function matchFilters(p){
  const hitTag = (activeTag==='tümü') || (p.tags||[]).includes(activeTag);
  const text = (p.title||'') + ' ' + (p.tags||[]).join(' ') + ' ' + (p.date||'');
  const hitQ = q ? text.toLowerCase().includes(q) : true;
  return hitTag && hitQ;
}
function cardHTML(p){
  const fav = favs.has(p.src) ? ' active' : '';
  const caption = p.title || '';
  const tags = (p.tags||[]).map(t => `<span class="tag">${t}</span>`).join('');
  return `
    <article class="card" data-src="${p.src}">
      <img class="ph" src="${p.src}" alt="${caption}" loading="lazy" decoding="async" />
      <div class="meta">
        <div>
          <div class="caption">${caption}</div>
          <div class="tags">${tags}</div>
        </div>
        <button class="fav${fav}" title="Favori">❤</button>
      </div>
    </article>
  `;
}
function drawGrid(){
  const items = PHOTOS.filter(matchFilters)
    .sort((a,b)=>(b.date||'').localeCompare(a.date||'')); // yeni üstte
  if (items.length===0){
    gallery.innerHTML = `<p style="opacity:.7;text-align:center">Hiç sonuç yok 🥲</p>`;
    return;
  }
  gallery.innerHTML = items.map(cardHTML).join('');
}
drawGrid();

// ===== Lightbox =====
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbClose= document.getElementById('lbClose');

let currentIndex = -1;
let currentList = [];

function openLB(idx){
  currentList = PHOTOS.filter(matchFilters)
    .sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  currentIndex = idx;
  const p = currentList[currentIndex];
  if (!p) return;
  lbImg.src = p.src;
  lbImg.alt = p.title || '';
  lbCap.textContent = p.title || '';
  lb.classList.remove('hide');
}
function closeLB(){ lb.classList.add('hide'); }
function prev(){ if (currentIndex>0) openLB(currentIndex-1); }
function next(){ if (currentIndex<currentList.length-1) openLB(currentIndex+1); }

gallery.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;

  // Favori
  if (e.target.classList.contains('fav')){
    const src = card.dataset.src;
    e.target.classList.toggle('active');
    toggleFav(src);
    return;
  }

  // Görseli aç
  const src = card.dataset.src;
  const items = PHOTOS.filter(matchFilters)
    .sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const idx = items.findIndex(p => p.src===src);
  openLB(idx);
});

lbClose.addEventListener('click', closeLB);
lbPrev.addEventListener('click', prev);
lbNext.addEventListener('click', next);
window.addEventListener('keydown', e=>{
  if (lb.classList.contains('hide')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
});

// İlk yüklemede hafif animasyon için küçük gecikmeli yeniden çizim
setTimeout(()=>drawGrid(),60);
// ===== AÇILIŞ (Intro) kontrolü =====
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');
  const body  = document.body;

  // intro’yu kısa gecikmeyle kapat
  setTimeout(() => {
    intro?.classList.add('is-done');         // fade out
    body.classList.add('page-in');           // içerik fade/slide-in
    // kartları sırayla görünür yap
    revealCardsStagger();
  }, 500); // istersen 800-1200ms yap
});

// Kartları sırayla görünür yap (stagger)
function revealCardsStagger() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((el, i) => {
    // gecikmeyi CSS değişkeni ile veriyoruz
    el.style.setProperty('--d', `${Math.min(i * 60, 600)}ms`);
    requestAnimationFrame(() => el.classList.add('reveal'));
  });
}

// Scroll’da görünende reveal (ekstra pürüzsüzlük için)
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      el.classList.add('reveal');
      io.unobserve(el);
    }
  });
}, { rootMargin: '60px 0px' });

// drawGrid sonrası kartlar yeniden yaratılıyor olabilir, ona göre bağla:
const _drawGrid = drawGrid;
drawGrid = function() {
  _drawGrid();                       // mevcut fonksiyonunuzu çalıştır
  document.querySelectorAll('.card').forEach((el, i) => {
    el.classList.remove('reveal');
    el.style.setProperty('--d', `${Math.min(i * 50, 600)}ms`);
    io.observe(el);
  });
};
/* ===== ROMANTİK HERO DAVRANIŞI ===== */

// 1) Birlikte olduğunuz tarih (gün sayacı için)
const START_DATE = "2024-10-19"; // 💞 19 Ekim 2024'ten beri birlikteyiz


function updateDaysTogether(){
  const daysEl = document.getElementById('daysTogether');
  if(!daysEl) return;
  const start = new Date(START_DATE + "T00:00:00");
  const now = new Date();
  const days = Math.max(0, Math.floor((now - start) / 86400000));
  daysEl.textContent = days.toString();
}

// 2) Foto sayısı
function updatePhotosCount(){
  const el = document.getElementById('photosCount');
  if(!el) return;
  el.textContent = (Array.isArray(PHOTOS) ? PHOTOS.length : 0);
}

// 3) Typewriter (romantik döngü)
const phrases = [
  "Birlikte gülüş…",
  "Aynı gökyüzüne bakış…",
  "Sessiz sarılış…",
  "Seninle her an, anı…"
];
let tpIndex = 0, chIndex = 0, typing = true;
function typeLoop(){
  const el = document.getElementById('typewriter');
  if(!el) return;
  const current = phrases[tpIndex];

  if(typing){
    chIndex++;
    el.textContent = current.slice(0, chIndex);
    if(chIndex === current.length){
      typing = false;
      setTimeout(typeLoop, 1100); // bekleme
      return;
    }
  }else{
    chIndex--;
    el.textContent = current.slice(0, chIndex);
    if(chIndex === 0){
      typing = true;
      tpIndex = (tpIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, typing ? 55 : 35);
}

// 4) Butonlar
const btnStart = document.getElementById('btnStart');
const btnLatest = document.getElementById('btnLatest');

btnStart?.addEventListener('click', () => {
  // hero'yu kaldır, galeriyi göster
  document.querySelector('.wrap')?.classList.remove('hidden');
  document.getElementById('hero')?.classList.add('hidden');

  // ilk kez açıldığında kartlara “reveal” efekti uygulayalım (eğer grid çizimi hazırsa)
  if (typeof drawGrid === 'function') {
    drawGrid();
  }
  // galerinin üstüne kaydır
  setTimeout(()=>document.querySelector('.wrap')?.scrollIntoView({ behavior:'smooth' }), 50);
});

btnLatest?.addEventListener('click', () => {
  // aynı şekilde aç, sonra en yeni foto karta kaydır (ilk kart)
  document.querySelector('.wrap')?.classList.remove('hidden');
  document.getElementById('hero')?.classList.add('hidden');
  if (typeof drawGrid === 'function') drawGrid();
  setTimeout(()=>{
    const firstCard = document.querySelector('.grid .card');
    firstCard?.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 120);
});

// 5) Kalplerin rastgele uçması
(function floatingHearts(){
  const container = document.querySelector('.hearts');
  if(!container) return;
  const W = () => window.innerWidth;
  const spawn = () => {
    const s = document.createElement('span');
    s.textContent = '❤';
    const left = Math.random() * (W() - 20);
    s.style.left = `${left}px`;
    s.style.animationDuration = (8 + Math.random()*6) + 's';
    s.style.fontSize = (16 + Math.random()*14) + 'px';
    s.style.opacity = (0.5 + Math.random()*0.4).toString();
    container.appendChild(s);
    setTimeout(()=> s.remove(), 15000);
  };
  // başlangıçta birkaç tane
  for(let i=0;i<8;i++) setTimeout(spawn, i*300);
  // düzenli üret
  setInterval(spawn, 900);
})();

// 6) İlk kurulum
updateDaysTogether();
updatePhotosCount();
typeLoop();
