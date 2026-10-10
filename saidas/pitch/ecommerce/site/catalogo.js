// PRODUTOS, CATEGORIAS, WHATSAPP e formatarPreco vêm de dados-produtos.js
const grid = document.getElementById("grid");
const filtros = document.getElementById("filtros");

function renderGrid(slug) {
  const lista = slug === "todas" ? PRODUTOS : PRODUTOS.filter((p) => p.cat === slug);
  grid.innerHTML = lista.map((p) => `
    <li class="produto">
      <a href="produto.html?id=${p.id}">
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
  if (!CATEGORIAS.some((c) => c.slug === slug)) slug = "todas";
  filtros.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", b.dataset.slug === slug));
  renderGrid(slug);
  if (atualizarUrl) {
    const url = slug === "todas" ? "catalogo.html" : `catalogo.html?categoria=${slug}`;
    history.replaceState(null, "", url);
  }
}

filtros.innerHTML = CATEGORIAS.map((c) =>
  `<button role="tab" data-slug="${c.slug}">${c.nome}</button>`).join("");
filtros.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) selecionar(b.dataset.slug);
});

selecionar(new URLSearchParams(location.search).get("categoria") || "todas", false);
