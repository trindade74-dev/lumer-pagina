// Carrinho de compras: guardado no localStorage do navegador (cada visitante
// tem o seu). Não é um carrinho com pagamento — serve só pra montar o pedido
// e encaminhar pro WhatsApp da Lumér, que a dona confirma manualmente.
const CARRINHO_CHAVE = "lumer-carrinho";

function carrinhoLer() {
  try {
    const dados = JSON.parse(localStorage.getItem(CARRINHO_CHAVE));
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function carrinhoSalvar(itens) {
  try {
    localStorage.setItem(CARRINHO_CHAVE, JSON.stringify(itens));
  } catch {
    // localStorage indisponível (modo privado etc.) — segue sem persistir
  }
  document.dispatchEvent(new CustomEvent("carrinho:mudou", { detail: { itens } }));
  carrinhoAtualizarSelos();
}

// Dois itens do mesmo produto só se juntam se tiverem o mesmo tamanho.
function carrinhoAdicionar(produto, tamanho, qtd) {
  const itens = carrinhoLer();
  const existente = itens.find((i) => i.id === produto.id && i.tamanho === tamanho);
  if (existente) {
    existente.qtd += qtd;
  } else {
    itens.push({
      id: produto.id,
      nome: produto.nome,
      img: produto.img,
      preco: produto.preco,
      tamanho: tamanho || null,
      qtd,
    });
  }
  carrinhoSalvar(itens);
}

function carrinhoAtualizarQtd(id, tamanho, qtd) {
  let itens = carrinhoLer();
  if (qtd <= 0) {
    itens = itens.filter((i) => !(i.id === id && i.tamanho === tamanho));
  } else {
    const item = itens.find((i) => i.id === id && i.tamanho === tamanho);
    if (item) item.qtd = qtd;
  }
  carrinhoSalvar(itens);
}

function carrinhoRemover(id, tamanho) {
  carrinhoAtualizarQtd(id, tamanho, 0);
}

function carrinhoLimpar() {
  carrinhoSalvar([]);
}

function carrinhoContagem() {
  return carrinhoLer().reduce((soma, i) => soma + i.qtd, 0);
}

function carrinhoSubtotal() {
  const itens = carrinhoLer();
  const comPreco = itens.filter((i) => i.preco != null);
  const temSemPreco = itens.some((i) => i.preco == null);
  const total = comPreco.reduce((soma, i) => soma + i.preco * i.qtd, 0);
  return { total, temSemPreco };
}

// Atualiza o número no ícone do carrinho em qualquer página que o tenha.
function carrinhoAtualizarSelos() {
  const n = carrinhoContagem();
  document.querySelectorAll(".cart-badge").forEach((el) => {
    el.textContent = n;
    el.style.display = n > 0 ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", carrinhoAtualizarSelos);
