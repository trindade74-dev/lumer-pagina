const container = document.getElementById("produto-pagina");
const id = new URLSearchParams(location.search).get("id");
const produto = id ? obterProduto(id) : null;

if (!produto) {
  container.innerHTML = `
    <div class="produto-nao-encontrado">
      <p>Não achamos essa peça 🤍</p>
      <a href="catalogo.html" class="btn">Ver o catálogo</a>
    </div>`;
} else {
  const tamanhos = listaTamanhos(produto);

  container.innerHTML = `
    <nav class="breadcrumb" aria-label="Caminho">
      <a href="catalogo.html">Catálogo</a>
      <span aria-hidden="true">/</span>
      <a href="catalogo.html?categoria=${produto.cat}">${nomeCategoria(produto.cat)}</a>
    </nav>

    <div class="produto-layout">
      <div class="produto-foto-grande">
        <img src="img/produtos/${produto.img}.png" alt="${produto.nome} em prata 925">
      </div>

      <div class="produto-painel">
        <h1>${produto.nome}</h1>
        <p class="produto-preco-grande${produto.preco == null ? " consultar" : ""}">${formatarPreco(produto.preco)}</p>

        ${tamanhos.length ? `
        <div class="bloco-tamanho">
          <span class="bloco-label">Tamanho</span>
          <div class="tamanhos" id="tamanhos" role="radiogroup" aria-label="Escolha o tamanho">
            ${tamanhos.map((t) => `<button type="button" class="tamanho-chip" data-tam="${t}" role="radio" aria-checked="false">${t}</button>`).join("")}
          </div>
          <p class="tamanho-aviso" id="tamanho-aviso" hidden>Escolha um tamanho pra continuar</p>
        </div>` : ""}

        <div class="bloco-qtd">
          <span class="bloco-label">Quantidade</span>
          <div class="qtd-stepper">
            <button type="button" id="qtd-menos" aria-label="Diminuir quantidade">−</button>
            <span id="qtd-valor">1</span>
            <button type="button" id="qtd-mais" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>

        <button type="button" id="btn-adicionar" class="btn-adicionar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Adicionar ao carrinho
        </button>

        <div class="produto-detalhes">
          <p><strong>Material:</strong> Prata 925</p>
          <p><strong>Garantia:</strong> contra defeitos de fabricação</p>
          <p><strong>Envio:</strong> pra todo o Brasil</p>
          <p><strong>Cuidados:</strong> evite perfume, creme e água — guarde num local seco</p>
        </div>

        <a href="catalogo.html?categoria=${produto.cat}" class="voltar-link">← Ver mais peças de ${nomeCategoria(produto.cat).toLowerCase()}</a>
      </div>
    </div>`;

  // Estado desta página, lido pela animação de "adicionar ao carrinho" em efeitos.js
  window.EstadoProduto = { produto, tamanho: null, qtd: 1 };

  const tamanhosEl = document.getElementById("tamanhos");
  const avisoEl = document.getElementById("tamanho-aviso");
  if (tamanhosEl) {
    tamanhosEl.addEventListener("click", (e) => {
      const chip = e.target.closest(".tamanho-chip");
      if (!chip) return;
      tamanhosEl.querySelectorAll(".tamanho-chip").forEach((c) => {
        c.classList.remove("selecionado");
        c.setAttribute("aria-checked", "false");
      });
      chip.classList.add("selecionado");
      chip.setAttribute("aria-checked", "true");
      window.EstadoProduto.tamanho = chip.dataset.tam;
      avisoEl.hidden = true;
    });
  }

  document.addEventListener("produto:tamanho-faltando", () => {
    if (!avisoEl) return;
    avisoEl.hidden = false;
    tamanhosEl.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const qtdValor = document.getElementById("qtd-valor");
  document.getElementById("qtd-menos").addEventListener("click", () => {
    window.EstadoProduto.qtd = Math.max(1, window.EstadoProduto.qtd - 1);
    qtdValor.textContent = window.EstadoProduto.qtd;
  });
  document.getElementById("qtd-mais").addEventListener("click", () => {
    window.EstadoProduto.qtd = Math.min(99, window.EstadoProduto.qtd + 1);
    qtdValor.textContent = window.EstadoProduto.qtd;
  });
}
