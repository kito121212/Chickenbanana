import React, { useState } from "react";
import "./App.css";

const imageUrls = {
  banana: "https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768",
  chicken: "https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg",
};

function getRandomImages() {
  const tiles = [...Array(18).fill("banana"), ...Array(18).fill("chicken")];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

function App() {
  const [images, setImages] = useState(getRandomImages());
  const [clicked, setClicked] = useState(Array(36).fill(false));
  const [revealed, setRevealed] = useState(Array(36).fill(false));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [scores, setScores] = useState({ chicken: 0, banana: 0 });
  const [winner, setWinner] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerRole, setPlayerRole] = useState(null);

  const handleTileClick = (index) => {
    if (clicked[index] || revealed[index] || winner || selectedIndex !== null) return;
    setSelectedIndex(index);
  };

  const handleGuess = (choice) => {
    if (selectedIndex === null || winner) return;

    const actual = images[selectedIndex];
    const newRevealed = [...revealed];
    const newClicked = [...clicked];
    newRevealed[selectedIndex] = true;
    newClicked[selectedIndex] = true;

    setRevealed(newRevealed);
    setClicked(newClicked);

    if (choice === actual) {
      const newScores = { ...scores };
      newScores[choice]++;
      setScores(newScores);

      const maxScore = Math.max(newScores.chicken, newScores.banana);
      if (maxScore >= 18) {
        const winnerPlayer = playerRole === choice ? "Player 1" : "Player 2";
        setWinner(`${winnerPlayer} wins by completing their tiles!`);
      }
    } else {
      const mistakePlayer = playerRole === "chicken" ? "Player 1" : "Player 2";
      const opponent = mistakePlayer === "Player 1" ? "Player 2" : "Player 1";
      setWinner(`${opponent} wins! ${mistakePlayer} made a mistake.`);
    }

    setSelectedIndex(null);
  };

  const startGame = () => {
    setImages(getRandomImages());
    setClicked(Array(36).fill(false));
    setRevealed(Array(36).fill(false));
    setScores({ chicken: 0, banana: 0 });
    setWinner("");
    setIsGameStarted(true);
    setSelectedIndex(null);
  };

  const choosePlayer = (role) => {
    setPlayerRole(role);
    startGame();
  };

  return (
    <div className="container">
      <h1>🐔 Chicken vs Banana 🍌</h1>

      {!isGameStarted ? (
        <div className="choose-player">
          <h2>Choose your side:</h2>
          <button className="start-btn" onClick={() => choosePlayer("chicken")}>
            I am Player 1
          </button>
          <button className="start-btn" onClick={() => choosePlayer("banana")}>
            I am Player 2
          </button>
        </div>
      ) : (
        <>
          <div className="grid">
            {images.map((tile, index) => (
              <div key={index} className="square">
                <div
                  className={`tile-cover ${revealed[index] ? "flipped" : ""} ${selectedIndex === index ? "selected" : ""}`}
                  onClick={() => handleTileClick(index)}
                  style={{
                    backgroundColor: revealed[index] ? "transparent" : "#bbb",
                    backgroundImage: revealed[index] ? `url(${imageUrls[tile]})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="tile-number">{index + 1}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedIndex !== null && !winner && (
            <div className="guess-buttons">
              <button onClick={() => handleGuess("chicken")} className="start-btn">
                I pick Chicken 🐔
              </button>
              <button onClick={() => handleGuess("banana")} className="start-btn">
                I pick Banana 🍌
              </button>
            </div>
          )}

          {winner && <h2 className="winner">{winner}</h2>}

          <button className="restart-btn" onClick={startGame}>
            Restart Game
          </button>
        </>
      )}
    </div>
  );
}

export default App;