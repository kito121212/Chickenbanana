const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let game = {
  tiles: [],
  clicked: Array(36).fill(false),
  revealed: Array(36).fill(false),
  scores: { chicken: 0, banana: 0 },
  winner: "",
  selectedIndex: null,
};

function generateTiles() {
  const t = [...Array(18).fill("banana"), ...Array(18).fill("chicken")];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

io.on("connection", (socket) => {
  console.log("🔌 Player connected");

  if (game.tiles.length === 0) {
    game.tiles = generateTiles();
  }

  socket.emit("init", game);

  socket.on("tileSelect", (index) => {
    game.selectedIndex = index;
    io.emit("update", game);
  });

  socket.on("guess", (choice) => {
    const idx = game.selectedIndex;
    const tile = game.tiles[idx];
    game.clicked[idx] = true;
    game.revealed[idx] = true;

    if (choice === tile) {
      game.scores[choice]++;
      if (game.scores[choice] === 18) {
        game.winner = `${choice.toUpperCase()} wins by completing all correct tiles!`;
      }
    } else {
      const opponent = choice === "chicken" ? "banana" : "chicken";
      game.winner = `${opponent.toUpperCase()} wins! ${choice} made a mistake.`;
    }

    game.selectedIndex = null;
    io.emit("update", game);
  });

  socket.on("restart", () => {
    game = {
      tiles: generateTiles(),
      clicked: Array(36).fill(false),
      revealed: Array(36).fill(false),
      scores: { chicken: 0, banana: 0 },
      winner: "",
      selectedIndex: null,
    };
    io.emit("update", game);
  });

  socket.on("disconnect", () => {
    console.log("❌ Player disconnected");
  });
});

server.listen(4000, () => console.log("✅ Server running on http://localhost:4000"));
