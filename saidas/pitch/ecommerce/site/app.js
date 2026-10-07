// Categorias do carrossel da home. A imagem é placeholder tirada do catálogo em PDF.
const categorias = [
  { slug: "aneis",     nome: "Anéis",     img: "img/aneis-mao.png" },
  { slug: "colares",   nome: "Colares",   img: "img/colares-busto.png" },
  { slug: "pulseiras", nome: "Pulseiras", img: "img/pulseiras-pedra.png", foco: "85% 50%" },
  { slug: "trios",     nome: "Trios",     img: "img/trios-caixa.png" },
  { slug: "brincos",   nome: "Brincos",   img: "img/brincos-busto.png" },
];

const stage = document.getElementById("stage");
let ativo = 0;

const cards = categorias.map((c, i) => {
  const el = document.createElement("a");
  el.className = "cat";
  el.href = `catalogo.html?categoria=${c.slug}`;
  el.innerHTML = `
    <div class="photo"><img src="${c.img}" alt="${c.nome} em prata 925" loading="lazy"${c.foco ? ` style="object-position: ${c.foco}"` : ""}></div>
    <span class="label">${c.nome}</span>`;
  // Clicar num card lateral traz ele pro centro; o do centro abre a categoria.
  el.addEventListener("click", (e) => {
    if (i !== ativo) { e.preventDefault(); irPara(i); }
  });
  stage.appendChild(el);
  return el;
});

function posicao(i) {
  const n = categorias.length;
  const d = (i - ativo + n) % n;
  if (d === 0) return "center";
  if (d === 1) return "right";
  if (d === n - 1) return "left";
  return d <= n / 2 ? "hidden-right" : "hidden-left";
}

function render() {
  cards.forEach((el, i) => {
    const pos = posicao(i);
    el.dataset.pos = pos;
    el.tabIndex = pos.startsWith("hidden") ? -1 : 0;
    el.setAttribute("aria-hidden", pos.startsWith("hidden"));
    el.setAttribute("aria-current", pos === "center" ? "true" : "false");
  });
}

function irPara(i) {
  ativo = (i + categorias.length) % categorias.length;
  render();
}

document.querySelector(".arrow-prev").addEventListener("click", () => irPara(ativo - 1));
document.querySelector(".arrow-next").addEventListener("click", () => irPara(ativo + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") irPara(ativo - 1);
  if (e.key === "ArrowRight") irPara(ativo + 1);
});

// Swipe no celular
let toqueX = null;
stage.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
stage.addEventListener("touchend", (e) => {
  if (toqueX === null) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  if (Math.abs(dx) > 40) irPara(ativo + (dx < 0 ? 1 : -1));
  toqueX = null;
});

render();
