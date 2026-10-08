// Produtos extraídos do catálogo em PDF. Nomes descritivos provisórios (só os "Virgínia"
// vêm do catálogo); preço null = "Consultar valor", como no catálogo atual.
const WHATSAPP = "61000000000";

const categorias = [
  { slug: "todas",     nome: "Todas" },
  { slug: "aneis",     nome: "Anéis" },
  { slug: "colares",   nome: "Colares" },
  { slug: "brincos",   nome: "Brincos" },
  { slug: "trios",     nome: "Trios" },
  { slug: "pulseiras", nome: "Pulseiras" },
];

const produtos = [
  { cat: "aneis", nome: "Solitário Virgínia 10mm",        img: "anel-solitario-virginia-10mm", tam: "14, 16, 18" },
  { cat: "aneis", nome: "Anel Solitário Oval",            img: "anel-02", tam: "18" },
  { cat: "aneis", nome: "Anel Navete Cravejado",          img: "anel-03", tam: "14, 16, 18" },
  { cat: "aneis", nome: "Anel Gota Verde",                img: "anel-04", tam: "14, 16, 17" },
  { cat: "aneis", nome: "Anel Aberto Ponto de Luz",       img: "anel-05", tam: "16, 18" },
  { cat: "aneis", nome: "Anel Coração Cravejado",         img: "anel-06", tam: "16" },
  { cat: "aneis", nome: "Anel Solitário Cravejado",       img: "anel-07", tam: "18" },
  { cat: "aneis", nome: "Anel Coração Vazado",            img: "anel-08", tam: "16" },
  { cat: "aneis", nome: "Anel Solitário Oval Cravejado",  img: "anel-09", tam: "16" },
  { cat: "aneis", nome: "Anel Solitário Delicado",        img: "anel-10", tam: "14" },

  { cat: "colares", nome: "Colar Virgínia 10mm",               img: "colar-virginia-10mm" },
  { cat: "colares", nome: "Colar Corações Cravejados",         img: "colar-01" },
  { cat: "colares", nome: "Colar Coração Halo",                img: "colar-02" },
  { cat: "colares", nome: "Colar Ponto de Luz Verde",          img: "colar-03" },
  { cat: "colares", nome: "Colar Círculo Cravejado",           img: "colar-04" },
  { cat: "colares", nome: "Colar Espírito Santo",              img: "colar-05" },
  { cat: "colares", nome: "Colar Coração Gargantilha",         img: "colar-06" },
  { cat: "colares", nome: "Colar Infinito com Coração",        img: "colar-07" },
  { cat: "colares", nome: "Colar Coração e Patinha",           img: "colar-08" },
  { cat: "colares", nome: "Colar Gota Amarela",                img: "colar-09" },
  { cat: "colares", nome: "Conjunto Colar e Brincos Gota",     img: "conjunto-colar-brincos-gota" },
  { cat: "colares", nome: "Conjunto Colar e Brincos Ponto de Luz", img: "conjunto-colar-brincos-ponto-de-luz" },

  { cat: "brincos", nome: "Brinco Virgínia 8mm / 10mm",   img: "brinco-virginia-8mm-10mm" },
  { cat: "brincos", nome: "Brinco Coração com Trio",      img: "brinco-02" },
  { cat: "brincos", nome: "Brinco Mandala Cravejada",     img: "brinco-03" },
  { cat: "brincos", nome: "Brinco Coração Cristal",       img: "brinco-04" },
  { cat: "brincos", nome: "Brinco Azul Royal",            img: "brinco-05" },
  { cat: "brincos", nome: "Brinco Gota Verde Halo",       img: "brinco-06" },
  { cat: "brincos", nome: "Brinco Ferradura",             img: "brinco-07" },
  { cat: "brincos", nome: "Brinco Gota Cravejada",        img: "brinco-08" },
  { cat: "brincos", nome: "Brincos Mini Delicados",       img: "brinco-09" },

  { cat: "trios", nome: "Trio Pontos de Luz Flor",        img: "trio-brincos-01" },
  { cat: "trios", nome: "Trio Pontos de Luz",             img: "trio-brincos-02" },

  { cat: "pulseiras", nome: "Pulseira Virgínia Ponto de Luz", img: "pulseira-virginia-ponto-de-luz" },
  { cat: "pulseiras", nome: "Pulseira Virgínia 3 Zircônias",  img: "pulseira-virginia-3-zirconias" },
  { cat: "pulseiras", nome: "Pulseira Trevo Verde",           img: "pulseira-01" },
  { cat: "pulseiras", nome: "Pulseira Gotas Turquesa",        img: "pulseira-02" },
  { cat: "pulseiras", nome: "Pulseira Gotas Rosé",            img: "pulseira-03" },
  { cat: "pulseiras", nome: "Pulseira Coração",               img: "pulseira-06" },
  { cat: "pulseiras", nome: "Pulseira Gotas Azuis",           img: "pulseira-07" },
].map((p) => ({ preco: null, ...p }));

const grid = document.getElementById("grid");
const filtros = document.getElementById("filtros");

function formatarPreco(v) {
  return v == null ? "Consultar valor" : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function linkWhatsApp(p) {
  const msg = `Olá! Vi no catálogo da Lumér e tenho interesse na peça: ${p.nome}${p.tam ? ` (tamanhos: ${p.tam})` : ""} 🤍`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function renderGrid(slug) {
  const lista = slug === "todas" ? produtos : produtos.filter((p) => p.cat === slug);
  grid.innerHTML = lista.map((p) => `
    <li class="produto">
      <a href="${linkWhatsApp(p)}" target="_blank" rel="noopener">
        <div class="produto-foto"><img src="img/produtos/${p.img}.png" alt="${p.nome} em prata 925" loading="lazy"></div>
        <div class="produto-info">
          <span class="produto-nome">${p.nome}</span>
          <span class="produto-preco${p.preco == null ? " consultar" : ""}">${formatarPreco(p.preco)}</span>
        </div>
        ${p.tam ? `<span class="produto-tam">Tam: ${p.tam}</span>` : ""}
      </a>
    </li>`).join("");
}

function selecionar(slug, atualizarUrl = true) {
  if (!categorias.some((c) => c.slug === slug)) slug = "todas";
  filtros.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", b.dataset.slug === slug));
  renderGrid(slug);
  if (atualizarUrl) {
    const url = slug === "todas" ? "catalogo.html" : `catalogo.html?categoria=${slug}`;
    history.replaceState(null, "", url);
  }
}

filtros.innerHTML = categorias.map((c) =>
  `<button role="tab" data-slug="${c.slug}">${c.nome}</button>`).join("");
filtros.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) selecionar(b.dataset.slug);
});

selecionar(new URLSearchParams(location.search).get("categoria") || "todas", false);
