import React, { useEffect, useState } from "react";
import "./App.css";

// Chicken and Banana image URLs
const imageUrls = [
  "https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768", // Banana
  "https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg", // Chicken
];

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
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [winner, setWinner] = useState("");
  const [chickenScore, setChickenScore] = useState(0);
  const [bananaScore, setBananaScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [wrongPickEffect, setWrongPickEffect] = useState(false);

  const handleClick = (index) => {
    if (!isGameStarted || clicked[index] || winner) return;

    const tile = images[index];
    const isCorrect = currentPlayer === tile;

    // Reveal the tile
    setClicked((prev) => {
      const newClicked = [...prev];
      newClicked[index] = true;
      return newClicked;
    });

    // Update score if correct
    if (isCorrect) {
      if (currentPlayer === "chicken") {
        setChickenScore((prev) => {
          const newScore = prev + 1;
          if (newScore >= 10) setWinner("🐔 Chicken Player wins!");
          return newScore;
        });
      } else {
        setBananaScore((prev) => {
          const newScore = prev + 1;
          if (newScore >= 10) setWinner("🍌 Banana Player wins!");
          return newScore;
        });
      }
    } else {
      // Incorrect choice - trigger visual effect and switch player
      setWrongPickEffect(true);
      setTimeout(() => {
        setWrongPickEffect(false);
        setCurrentPlayer((prev) => (prev === "chicken" ? "banana" : "chicken"));
      }, 1000);
    }
  };

  const resetBoard = () => {
    setImages(getRandomImages());
    setClicked(Array(36).fill(false));
  };

  const startGame = () => {
    const randomPlayer = Math.random() < 0.5 ? "chicken" : "banana";
    setCurrentPlayer(randomPlayer);
    setIsGameStarted(true);
    resetBoard();
    setWinner("");
  };

  const handleRestart = () => {
    setChickenScore(0);
    setBananaScore(0);
    setWinner("");
    setIsGameStarted(false);
    setCurrentPlayer("");
    resetBoard();
  };

  return (
    <div className="container">
      <h1>Chicken Banana Game - Minesweeper!</h1>

      <div className="scores">
        <p>🐔 Chicken Score: {chickenScore}</p>
        <p>🍌 Banana Score: {bananaScore}</p>
      </div>

      {!isGameStarted ? (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <h3 className={`${wrongPickEffect ? "shake wrong-pick" : ""} `}>
          🔄 {currentPlayer === "chicken" ? "Chicken" : "Banana"} Player's Turn
        </h3>
      )}

      <div className="grid">
        {images.map((tile, index) => (
          <div key={index} className="square">
            <div
              className={`tile-cover  ${clicked[index] ? "flipped" : ""} ${
                wrongPickEffect &&
                clicked[index] &&
                images[index] !== currentPlayer
                  ? "wrong-tile"
                  : ""
              }`}
              onClick={() => handleClick(index)}
              style={{
                backgroundColor: clicked[index] ? "transparent" : "lightgray",
                backgroundImage: clicked[index]
                  ? `url(${tile === "banana" ? imageUrls[0] : imageUrls[1]})`
                  : "none",
                backgroundSize: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {winner && <h2 className="winner-message">{winner}</h2>}

      <button className="restart-button" onClick={handleRestart}>
        Restart Full Game
      </button>
    </div>
  );
}

export default App;

//sadfsadfasfsad
