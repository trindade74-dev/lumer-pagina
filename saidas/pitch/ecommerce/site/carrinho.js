const container = document.getElementById("carrinho-pagina");

function montarMensagem(nome, endereco, presente) {
  const itens = carrinhoLer();
  const linhas = itens.map((i) => {
    const tam = i.tamanho ? ` (Tam: ${i.tamanho})` : "";
    const precoTexto = i.preco != null ? formatarPreco(i.preco) : "Consultar valor";
    return `• ${i.nome}${tam} — Qtd: ${i.qtd} — ${precoTexto}`;
  }).join("\n");
  const { total, temSemPreco } = carrinhoSubtotal();
  const subtotalLinha = itens.length
    ? `\n\n*Subtotal:* ${formatarPreco(total)}${temSemPreco ? " + itens a consultar" : ""}`
    : "";
  return `Olá! Gostaria de fazer um pedido na Lumér 🤍\n\n` +
    `*Nome:* ${nome}\n` +
    `*Endereço:* ${endereco}\n` +
    `*É pra presente?* ${presente ? "Sim 🎁" : "Não"}\n\n` +
    `*Itens do pedido:*\n${linhas}${subtotalLinha}\n\n` +
    `Aguardo a confirmação, obrigada! 🤍`;
}

function linhaItem(item) {
  const { total: subtotal } = carrinhoSubtotal();
  const precoTexto = item.preco != null ? formatarPreco(item.preco) : "Consultar valor";
  const totalTexto = item.preco != null ? formatarPreco(item.preco * item.qtd) : "—";
  return `
    <li class="carrinho-item" data-id="${item.id}" data-tam="${item.tamanho || ""}">
      <div class="carrinho-item-foto"><img src="img/produtos/${item.img}.png" alt="${item.nome}"></div>
      <div class="carrinho-item-info">
        <span class="carrinho-item-nome">${item.nome}</span>
        ${item.tamanho ? `<span class="carrinho-item-tam">Tam: ${item.tamanho}</span>` : ""}
        <button type="button" class="carrinho-item-remover">Remover</button>
      </div>
      <span class="carrinho-item-preco">${precoTexto}</span>
      <div class="qtd-stepper qtd-stepper--pequeno">
        <button type="button" class="qtd-menos" aria-label="Diminuir quantidade">−</button>
        <span class="qtd-valor">${item.qtd}</span>
        <button type="button" class="qtd-mais" aria-label="Aumentar quantidade">+</button>
      </div>
      <span class="carrinho-item-total">${totalTexto}</span>
    </li>`;
}

function render() {
  const itens = carrinhoLer();

  if (!itens.length) {
    container.innerHTML = `
      <div class="carrinho-vazio">
        <h1>Seu carrinho está vazio</h1>
        <p>Dá uma olhada nas nossas peças em prata 925 🤍</p>
        <a href="catalogo.html" class="btn">Ver o catálogo</a>
      </div>`;
    return;
  }

  const { total, temSemPreco } = carrinhoSubtotal();

  container.innerHTML = `
    <h1>Seu carrinho</h1>
    <a href="catalogo.html" class="voltar-link">← Continuar vendo peças</a>

    <ul class="carrinho-lista">
      <li class="carrinho-cabecalho">
        <span>Produto</span><span></span><span>Preço</span><span>Qtd</span><span>Total</span>
      </li>
      ${itens.map(linhaItem).join("")}
    </ul>

    <div class="carrinho-resumo">
      <span>Subtotal</span>
      <strong>${formatarPreco(total)}${temSemPreco ? " + a consultar" : ""}</strong>
    </div>

    <form class="checkout-form" id="checkout-form">
      <h2>Finalizar pedido</h2>
      <p class="checkout-aviso">Isso não fecha a compra — envia o resumo pro WhatsApp da Lumér, e a Raphaella confirma com você.</p>

      <label class="campo">
        <span>Nome</span>
        <input type="text" name="nome" required autocomplete="name" placeholder="Seu nome completo">
      </label>

      <label class="campo">
        <span>Endereço de entrega</span>
        <textarea name="endereco" rows="2" required autocomplete="street-address" placeholder="Rua, número, bairro, cidade"></textarea>
      </label>

      <div class="campo">
        <span>É pra presente?</span>
        <div class="presente-escolha" role="radiogroup" aria-label="É pra presente?">
          <button type="button" class="presente-opcao selecionado" data-presente="nao" aria-checked="true" role="radio">Não</button>
          <button type="button" class="presente-opcao" data-presente="sim" aria-checked="false" role="radio">Sim 🎁</button>
        </div>
      </div>

      <button type="submit" class="btn btn-whatsapp">Enviar pedido pelo WhatsApp</button>
    </form>`;

  container.querySelectorAll(".carrinho-item").forEach((li) => {
    const { id, tam } = li.dataset;
    const tamanho = tam || null;
    li.querySelector(".qtd-mais").addEventListener("click", () => {
      const item = carrinhoLer().find((i) => i.id === id && i.tamanho === tamanho);
      carrinhoAtualizarQtd(id, tamanho, (item?.qtd || 0) + 1);
    });
    li.querySelector(".qtd-menos").addEventListener("click", () => {
      const item = carrinhoLer().find((i) => i.id === id && i.tamanho === tamanho);
      carrinhoAtualizarQtd(id, tamanho, (item?.qtd || 1) - 1);
    });
    li.querySelector(".carrinho-item-remover").addEventListener("click", () => {
      carrinhoRemover(id, tamanho);
    });
  });

  let presente = false;
  const opcoesPresente = container.querySelectorAll(".presente-opcao");
  opcoesPresente.forEach((btn) => {
    btn.addEventListener("click", () => {
      presente = btn.dataset.presente === "sim";
      opcoesPresente.forEach((b) => b.setAttribute("aria-checked", String(b === btn)));
      opcoesPresente.forEach((b) => b.classList.toggle("selecionado", b === btn));
    });
  });

  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = new FormData(e.target);
    const nome = dados.get("nome").trim();
    const endereco = dados.get("endereco").trim();
    if (!nome || !endereco) return;

    const msg = montarMensagem(nome, endereco, presente);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    carrinhoLimpar();
    container.innerHTML = `
      <div class="carrinho-vazio">
        <h1>Pedido enviado! 🤍</h1>
        <p>Abrimos o WhatsApp com o resumo do seu pedido — é só confirmar o envio por lá que a Raphaella já recebe.</p>
        <a href="catalogo.html" class="btn">Continuar vendo peças</a>
      </div>`;
  });
}

// Re-renderiza sempre que o carrinho mudar (inclusive pelos próprios
// botões desta página, pra manter uma única fonte de verdade).
document.addEventListener("carrinho:mudou", render);
render();
