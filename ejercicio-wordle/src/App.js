import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [targetWord] = useState("REACT");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      const key = e.key.toUpperCase();

      if (key === "ENTER" && currentGuess.length === 5) {
        if (currentGuess === targetWord) {
          setGameOver(true);
          setMessage("¡Ganaste! 🎉");
        } else if (guesses.length >= 5) {
          setGameOver(true);
          setMessage(`Perdiste. La palabra era: ${targetWord}`);
        }
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess("");
      } else if (key === "BACKSPACE") {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess(currentGuess + key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentGuess, gameOver, guesses, targetWord]);

  const resetGame = () => {
    setCurrentGuess("");
    setGuesses([]);
    setGameOver(false);
    setMessage("");
  };

  const renderTile = (rowIndex, colIndex) => {
    const guess = guesses[rowIndex] || "";
    const letter = guess[colIndex] || "";
    const isCorrect = targetWord[colIndex] === letter;
    const isPresent = targetWord.includes(letter) && !isCorrect;

    let className = "tile";
    if (isCorrect) className += " correct";
    else if (isPresent) className += " present";

    return (
      <div key={colIndex} className={className}>
        {letter}
      </div>
    );
  };

  return (
    <div className="app">
      <h1>Wordle Sencillo</h1>
      <div className="board">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: 5 }).map((_, colIndex) =>
              rowIndex === guesses.length ? (
                <div key={colIndex} className="tile">
                  {currentGuess[colIndex] || ""}
                </div>
              ) : (
                renderTile(rowIndex, colIndex)
              )
            )}
          </div>
        ))}
      </div>
      <p>Usa el teclado para escribir. Enter para enviar.</p>
      
      {gameOver && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{message}</h2>
            <button className="reset-button" onClick={resetGame}>
              Volver a jugar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;