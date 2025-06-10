import axios from "axios";

const api = axios.create({
  baseURL: "https://babaggins-api.onrender.com",
  // Você pode adicionar headers ou configs globais aqui se necessário
});

export async function cadastrarItemApi({
  personagemNome,
  nome,
  descricao,
  quantidade,
}) {
  const res = await api.get("/personagens");
  const encontrado = res.data.find(
    (p) => p.nome.toLowerCase().trim() === personagemNome.toLowerCase().trim()
  );

  if (!encontrado) {
    throw new Error("Personagem não encontrado.");
  }

  await api.post("/itens", {
    personagem_id: encontrado.id,
    nome_item: nome,
    descricao,
    quantidade,
  });
}

export async function cadastrarPersonagemApi({ nome, dinheiro }) {
  await api.post("/personagens", {
    nome,
    dinheiro,
  });
}

export async function getPersonagensApi() {
  const res = await api.get("/personagens");
  return res.data;
}

export async function distribuirDinheiroApi(valorTotal) {
  const personagens = await getPersonagensApi();
  const quantidade = personagens.length;
  if (quantidade === 0) {
    throw new Error("Não há personagens para distribuir dinheiro.");
  }
  const valorPorPersonagem = Math.floor(valorTotal / quantidade);
  for (const personagem of personagens) {
    await api.put(`/personagens/${personagem.id}/dinheiro`, {
      valor: valorPorPersonagem,
    });
  }
}

export async function getItensGrupoApi() {
  const res = await api.get("/itens");
  const personagens = await api.get("/personagens");
  const personagemMap = Object.fromEntries(
    personagens.data.map((p) => [p.id, p.nome])
  );

  return res.data.map((item) => ({
    nome: item.nome_item,
    quantidade: item.quantidade,
    descricao: item.descricao,
    personagemNome: personagemMap[item.personagem_id],
  }));
}

export async function buscarPersonagemApi(nomeBusca) {
  const res = await api.get("/personagens");
  const encontrado = res.data.find(
    (p) => p.nome.toLowerCase() === nomeBusca.trim().toLowerCase()
  );
  if (!encontrado) {
    return { personagemData: null, itensData: [] };
  }
  const personagemRes = await api.get(`/personagens/${encontrado.id}`);
  const itensRes = await api.get(`/itens/${encontrado.id}`);
  return { personagemData: personagemRes.data[0], itensData: itensRes.data };
}

export async function alterarDinheiroApi(personagemId, valor) {
  const res = await api.put(`/personagens/${personagemId}/dinheiro`, { valor });
  return res.data.dinheiro;
}

export async function aumentarQuantidadeApi(item, quantidade = 1) {
  const novaQuantidade = item.quantidade + quantidade;
  await api.put(`/itens/${item.id}`, {
    ...item,
    quantidade: novaQuantidade,
  });
  return novaQuantidade;
}

export async function diminuirQuantidadeApi(item, quantidade = 1) {
  const novaQuantidade = item.quantidade - quantidade;
  await api.put(`/itens/${item.id}`, {
    ...item,
    quantidade: novaQuantidade,
  });
  return novaQuantidade;
}

export async function removerItemApi(itemId) {
  await api.delete(`/itens/${itemId}`);
}
