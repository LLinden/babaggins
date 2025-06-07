require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Cria as tabelas se não existirem
async function criarTabelas() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS personagens (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(50) CHECK(length(nome) <= 50),
      dinheiro INTEGER DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS itens (
      id SERIAL PRIMARY KEY,
      personagem_id INTEGER REFERENCES personagens(id),
      nome_item VARCHAR(50) CHECK(length(nome_item) <= 50),
      descricao TEXT,
      quantidade INTEGER DEFAULT 1
    )
  `);
}
criarTabelas();

// Rota para testar se o servidor está online
app.get("/", (req, res) => {
  res.send("API está no ar!");
});

// Endpoint para cadastrar personagem
app.post("/personagens", async (req, res) => {
  const { nome, dinheiro } = req.body;
  if (!nome || !dinheiro) {
    return res.status(400).send("Nome e dinheiro inicial são obrigatórios.");
  }
  if (nome.length > 50) {
    return res.status(400).send("Nome excede o limite de caracteres.");
  }
  try {
    const result = await pool.query(
      "INSERT INTO personagens (nome, dinheiro) VALUES ($1, $2) RETURNING id",
      [nome, dinheiro]
    );
    res.send({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).send("Erro ao salvar.");
  }
});

// Endpoint para cadastrar item
app.post("/itens", async (req, res) => {
  const { personagem_id, nome_item, descricao, quantidade } = req.body;
  if (!personagem_id || !nome_item || !quantidade) {
    return res
      .status(400)
      .send("Personagem, nome do item e quantidade inicial são obrigatórios.");
  }
  if (nome_item.length > 50) {
    return res.status(400).send("Nome do item excede o limite de caracteres.");
  }
  try {
    const result = await pool.query(
      "INSERT INTO itens (personagem_id, nome_item, descricao, quantidade) VALUES ($1, $2, $3, $4) RETURNING id",
      [personagem_id, nome_item, descricao, quantidade]
    );
    res.send({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).send("Erro ao salvar.");
  }
});

// Endpoint para listar todos personagens
app.get("/personagens", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM personagens");
    res.send(result.rows);
  } catch (err) {
    res.status(500).send("Erro ao buscar itens.");
  }
});

// Endpoint para listar personagens por id
app.get("/personagens/:personagem_id", async (req, res) => {
  const { personagem_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, nome, dinheiro FROM personagens WHERE id = $1",
      [personagem_id]
    );
    res.send(result.rows);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar personagens", detalhes: err.message });
  }
});

// Enpoint para listar todos os itens
app.get("/itens", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM itens");
    res.send(result.rows);
  } catch (err) {
    res.status(500).send("Erro ao buscar itens.");
  }
});

// Enpoint para listar itens por personagem
app.get("/itens/:personagem_id", async (req, res) => {
  const { personagem_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, nome_item, descricao, quantidade FROM itens WHERE personagem_id = $1",
      [personagem_id]
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send("Erro ao buscar itens.");
  }
});

// Endpoint para atualizar dinheiro ao personagem
app.put("/personagens/:id/dinheiro", async (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;
  if (typeof valor !== "number") {
    return res.status(400).send("Valor deve ser um número.");
  }
  try {
    const row = await pool.query(
      "SELECT dinheiro FROM personagens WHERE id = $1",
      [id]
    );
    if (row.rows.length === 0)
      return res.status(404).send("Personagem não encontrado.");
    const novoDinheiro = row.rows[0].dinheiro + valor;
    await pool.query("UPDATE personagens SET dinheiro = $1 WHERE id = $2", [
      novoDinheiro,
      id,
    ]);
    res.send({ id: id, dinheiro: novoDinheiro });
  } catch (err) {
    res.status(500).send("Erro ao atualizar dinheiro.");
  }
});

// Atualizar um item (ex: quantidade)
app.put("/itens/:id", async (req, res) => {
  const { id } = req.params;
  const { nome_item, descricao, quantidade } = req.body;
  if (quantidade < 0) {
    return res.status(400).send("A quantidade não pode ser negativa.");
  }
  try {
    const result = await pool.query(
      "UPDATE itens SET nome_item = $1, descricao = $2, quantidade = $3 WHERE id = $4 RETURNING *",
      [nome_item, descricao, quantidade, id]
    );
    if (result.rowCount === 0)
      return res.status(404).send("Item não encontrado.");
    res.send(result.rows[0]);
  } catch (err) {
    res.status(500).send("Erro ao atualizar item.");
  }
});

// Deletar um item
app.delete("/itens/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM itens WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).send("Item não encontrado.");
    res.send({ mensagem: "Item removido com sucesso", id });
  } catch (err) {
    res.status(500).send("Erro ao deletar item.");
  }
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
