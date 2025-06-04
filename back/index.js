const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Conecta ao banco (cria o arquivo se não existir)
const db = new sqlite3.Database("./database.db");

// Cria a tabela com limites de caracteres usando CHECK
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS personagens (
      id INTEGER PRIMARY KEY,
      nome TEXT CHECK(length(nome) <= 50),
      dinheiro INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS itens (
      id INTEGER PRIMARY KEY,
      personagem_id INTEGER,
      nome_item CHECK(length(nome_item) <= 50),
      descricao TEXT,
      quantidade INTEGER DEFAULT 1,
      FOREIGN KEY (personagem_id) REFERENCES personagens(id)
    )
  `);
});

// Rota para testar se o servidor está online
app.get("/", (req, res) => {
  res.send("API está no ar!");
});

// Endpoint para cadastrar personagem
app.post("/personagens", (req, res) => {
  const { nome, dinheiro } = req.body;

  // Validação no backend também
  if (!nome || !dinheiro) {
    return res.status(400).send("Nome e dinheiro inicial são obrigatórios.");
  }

  if (nome.length > 50) {
    return res.status(400).send("Nome excede o limite de caracteres.");
  }

  db.run(
    "INSERT INTO personagens (nome, dinheiro) VALUES (?, ?)",
    [nome, dinheiro],
    function (err) {
      if (err) return res.status(500).send("Erro ao salvar.");
      res.send({ id: this.lastID });
    }
  );
});

// Endpoint para cadastrar item
app.post("/itens", (req, res) => {
  const { personagem_id, nome_item, descricao, quantidade } = req.body;

  // Validação no backend também
  if (!personagem_id || !nome_item || !quantidade) {
    return res
      .status(400)
      .send("Personagem, nome do item e quantidade inicial são obrigatórios.");
  }

  if (nome_item.length > 50) {
    return res.status(400).send("Nome do item excede o limite de caracteres.");
  }

  db.run(
    "INSERT INTO itens (personagem_id, nome_item, descricao, quantidade) VALUES (?, ?, ?, ?)",
    [personagem_id, nome_item, descricao, quantidade],
    function (err) {
      if (err) return res.status(500).send("Erro ao salvar.");
      res.send({ id: this.lastID });
    }
  );
});

// Endpoint para listar todos personagens
app.get("/personagens", (req, res) => {
  db.all("SELECT * FROM personagens", (err, rows) => {
    if (err) return res.status(500).send("Erro ao buscar itens.");
    res.send(rows);
  });
});

// Endpoint para listar personagens por id
app.get("/personagens/:personagem_id", (req, res) => {
  const { personagem_id } = req.params;

  db.all(
    "SELECT id, nome, dinheiro FROM personagens WHERE id = ?",
    [personagem_id],
    (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ erro: "Erro ao buscar personagens", detalhes: err.message });
      res.send(rows);
    }
  );
});

// Enpoint para listar itens
app.get("/itens/:personagem_id", (req, res) => {
  const { personagem_id } = req.params;

  db.all(
    "SELECT id, nome_item, descricao, quantidade FROM itens WHERE personagem_id = ?",
    [personagem_id],
    (err, rows) => {
      if (err) return res.status(500).send("Erro ao buscar itens.");
      res.send(rows);
    }
  );
});

// Endpoint para atualizar dinheiro ao personagem
// para adicionar basta enviar um valor inteiro
// para subtrair basta enviar com sinal de menos (ex.: -50)
app.put("/personagens/:id/dinheiro", (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;

  if (typeof valor !== "number") {
    return res.status(400).send("Valor deve ser um número.");
  }

  db.get("SELECT dinheiro FROM personagens WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).send("Erro ao buscar personagem.");
    if (!row) return res.status(404).send("Personagem não encontrado.");

    const novoDinheiro = row.dinheiro + valor;

    db.run(
      "UPDATE personagens SET dinheiro = ? WHERE id = ?",
      [novoDinheiro, id],
      function (err) {
        if (err) return res.status(500).send("Erro ao atualizar dinheiro.");
        res.send({ id: id, dinheiro: novoDinheiro });
      }
    );
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
