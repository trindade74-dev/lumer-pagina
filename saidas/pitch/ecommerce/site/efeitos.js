// Efeitos de interface com a biblioteca Motion (https://motion.dev), carregada
// via CDN em formato ESM — sem precisar de npm install nem bundler, já que o
// site é HTML/CSS/JS puro. Cobre: entrada suave de cada página, o "selo" do
// carrinho pulsando quando muda, e a animação de "voar até o carrinho" ao
// adicionar um produto (baseada no exemplo "Motion along a path").
import {
  animate,
  arc,
  hover,
  press,
  motionValue,
  stagger,
} from "https://cdn.jsdelivr.net/npm/motion@12/+esm";

const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeEntrada = [0.22, 0.8, 0.24, 1];

// ---------------------------------------------------------------
// Entrada suave: cada página marca no <body data-pagina="..."> quais
// grupos de elementos devem subir e aparecer ao carregar.
// ---------------------------------------------------------------
function entrada(selector, { atraso = 0, deslocamento = 16 } = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  if (reduzMovimento) {
    els.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    return;
  }
  els.forEach((el) => { el.style.opacity = "0"; });
  animate(
    els,
    { opacity: [0, 1], y: [deslocamento, 0] },
    { duration: 0.6, delay: stagger(0.07, { startDelay: atraso }), ease: easeEntrada },
  );
}

const pagina = document.body.dataset.pagina;
if (pagina === "home") {
  entrada(".topbar");
  entrada(".hero h1, .hero .subtitle, .hero .btn", { atraso: 0.08 });
  entrada(".carousel", { atraso: 0.22, deslocamento: 24 });
} else if (pagina === "catalogo") {
  entrada(".banner-bar");
  entrada(".catalogo-title, .filtros", { atraso: 0.05 });
  entrada(".grid .produto", { atraso: 0.18, deslocamento: 20 });
} else if (pagina === "produto") {
  entrada(".topbar");
  entrada(".produto-pagina .produto-foto-grande", { atraso: 0.05, deslocamento: 20 });
  entrada(".produto-pagina .produto-painel > *", { atraso: 0.12 });
} else if (pagina === "carrinho") {
  entrada(".topbar");
  entrada(".carrinho-pagina > *", { atraso: 0.08, deslocamento: 20 });
}

// ---------------------------------------------------------------
// Selo do carrinho: um pequeno pulso sempre que o conteúdo muda.
// ---------------------------------------------------------------
document.addEventListener("carrinho:mudou", () => {
  if (reduzMovimento) return;
  document.querySelectorAll(".cart-badge").forEach((b) => {
    animate(b, { scale: [1, 1.4, 1] }, { duration: 0.45, ease: "easeOut" });
  });
  document.querySelectorAll(".cart-link").forEach((a) => {
    animate(a, { scale: [1, 1.12, 1] }, { duration: 0.4, ease: "easeOut" });
  });
});

// Feedback de toque/hover nos botões principais, se existirem.
document.querySelectorAll(".btn, .btn-adicionar").forEach((btn) => {
  if (reduzMovimento) return;
  hover(btn, () => {
    animate(btn, { scale: 1.02 }, { type: "spring", stiffness: 400, damping: 20 });
    return () => animate(btn, { scale: 1 }, { type: "spring", stiffness: 400, damping: 20 });
  });
  press(btn, () => {
    animate(btn, { scale: 0.97 }, { duration: 0.1 });
    return () => animate(btn, { scale: 1 }, { type: "spring", stiffness: 400, damping: 15 });
  });
});

// ---------------------------------------------------------------
// "Adicionar ao carrinho" voando até o ícone do carrinho — só existe
// na página de produto. Adaptado do exemplo "Motion along a path".
// ---------------------------------------------------------------
const btnAdicionar = document.getElementById("btn-adicionar");
const fotoProduto = document.querySelector(".produto-foto-grande img");
const linkCarrinho = document.querySelector(".cart-link");

if (btnAdicionar && fotoProduto && linkCarrinho) {
  const CESTO_BOX = 40; // tamanho aproximado do ícone no cabeçalho
  let voando = false;

  btnAdicionar.addEventListener("click", async () => {
    if (voando || btnAdicionar.disabled) return;
    const estado = window.EstadoProduto;
    if (!estado) return;

    // Validação (tamanho obrigatório quando o produto tem tamanhos)
    if (estado.produto.tam && !estado.tamanho) {
      document.dispatchEvent(new CustomEvent("produto:tamanho-faltando"));
      return;
    }

    // window.carrinhoAdicionar vem de carrinho-dados.js (script clássico —
    // suas funções de nível superior ficam acessíveis em window)
    window.carrinhoAdicionar(estado.produto, estado.tamanho, estado.qtd);

    if (reduzMovimento) return; // o item já foi adicionado; sem animação

    voando = true;
    btnAdicionar.disabled = true;

    const origemEl = fotoProduto;
    const from = origemEl.getBoundingClientRect();
    const to = linkCarrinho.getBoundingClientRect();
    const tamanhoFantasma = Math.min(from.width, from.height, 150);

    const fantasma = origemEl.cloneNode(true);
    fantasma.className = "produto-voando";
    fantasma.style.width = `${tamanhoFantasma}px`;
    fantasma.style.height = `${tamanhoFantasma}px`;
    fantasma.style.left = `${from.left + from.width / 2 - tamanhoFantasma / 2}px`;
    fantasma.style.top = `${from.top + from.height / 2 - tamanhoFantasma / 2}px`;
    document.body.appendChild(fantasma);

    const escala = CESTO_BOX / tamanhoFantasma;
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    const probeX = motionValue(0);
    const probeY = motionValue(0);

    await Promise.all([
      animate(
        fantasma,
        { x: dx, y: dy, scale: escala, opacity: [1, 1, 0] },
        {
          duration: 0.5,
          ease: [0.74, 0.18, 0.93, 0.69],
          path: arc({ strength: 0.5, peak: 0.15, rotate: 0.9, direction: "cw" }),
          opacity: { inherit: true, times: [0, 0.95, 1] },
        },
      ),
      animate(probeX, dx, { duration: 0.5 }),
      animate(probeY, dy, { duration: 0.5 }),
    ]);

    fantasma.remove();

    animate(
      linkCarrinho,
      { x: 0, y: 0 },
      {
        type: "spring",
        stiffness: 500,
        damping: 12,
        x: { inherit: true, velocity: probeX.getVelocity() * 0.05 },
        y: { inherit: true, velocity: probeY.getVelocity() * 0.05 },
      },
    );

    // Pisca "Adicionado ✓" por um instante antes de voltar ao texto normal.
    const textoOriginal = btnAdicionar.textContent;
    btnAdicionar.textContent = "Adicionado ✓";
    setTimeout(() => { btnAdicionar.textContent = textoOriginal; }, 900);

    btnAdicionar.disabled = false;
    voando = false;
  });
}
