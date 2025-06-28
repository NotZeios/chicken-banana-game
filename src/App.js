import React, { useState } from 'react';
import './App.css';
import chickenImg from './assets/chicken.png';
import bananaImg from './assets/banana.png';

const CHICKEN_IMG = chickenImg;
const BANANA_IMG = bananaImg;

function getShuffledTiles() {
  const tiles = Array(18).fill({ type: 'chicken', img: CHICKEN_IMG })
    .concat(Array(18).fill({ type: 'banana', img: BANANA_IMG }));
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

function App() {
  const [tiles, setTiles] = useState(getShuffledTiles());
  const [revealed, setRevealed] = useState(Array(36).fill(false));
  const [player, setPlayer] = useState('chicken');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [scores, setScores] = useState({ chicken: 0, banana: 0 });

  const chickenLeft = tiles.filter((tile, i) => tile.type === 'chicken' && !revealed[i]).length;
  const bananaLeft = tiles.filter((tile, i) => tile.type === 'banana' && !revealed[i]).length;

  function handleTileClick(idx) {
    if (gameOver || revealed[idx]) return;

    if (tiles[idx].type === player) {
      const updatedRevealed = [...revealed];
      updatedRevealed[idx] = true;
      setRevealed(updatedRevealed);

      if (player === 'chicken' && chickenLeft === 1) {
        setGameOver(true);
        setWinner('Chicken Player');
        setScores(prev => ({ ...prev, chicken: prev.chicken + 1 }));
      } else if (player === 'banana' && bananaLeft === 1) {
        setGameOver(true);
        setWinner('Banana Player');
        setScores(prev => ({ ...prev, banana: prev.banana + 1 }));
      } else {
        setPlayer(player === 'chicken' ? 'banana' : 'chicken');
      }
    } else {
      setGameOver(true);
      const winPlayer = player === 'chicken' ? 'Banana Player' : 'Chicken Player';
      setWinner(winPlayer);
      setScores(prev =>
        player === 'chicken'
          ? { ...prev, banana: prev.banana + 1 }
          : { ...prev, chicken: prev.chicken + 1 }
      );
    }
  }

  function handleRestart() {
    setTiles(getShuffledTiles());
    setRevealed(Array(36).fill(false));
    setGameOver(false);
    setWinner('');
    setPlayer('chicken');
  }

  return (
    <div className="container">
      <h1>
        <span className="chicken-header">Chicken</span>
        <span> </span>
        <span className="banana-header">Banana</span>
      </h1>
      <div style={{ marginBottom: 16, fontSize: 18 }}>
        <b>Score:</b> 
        <span style={{ color: '#e53e3e', marginLeft: 10 }}>Chicken: {scores.chicken}</span>
        <span style={{ color: '#222', margin: '0 10px' }}>|</span>
        <span style={{ color: '#ecc94b' }}>Banana: {scores.banana}</span>
      </div>
      <p>
        Two players: <b>Chicken</b> and <b>Banana</b>.<br />
        {gameOver
          ? <span style={{ color: 'green', fontWeight: 'bold' }}>{winner} wins!</span>
          : <>Current turn: <b>{player.charAt(0).toUpperCase() + player.slice(1)} Player</b></>
        }
      </p>
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 60px)',
          gap: '8px',
          justifyContent: 'center'
        }}
      >
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            className="square"
            style={{
              width: 60,
              height: 60,
              background: revealed[idx] ? '#f0f0f0' : '#ddd',
              border: '2px solid #aaa',
              cursor: gameOver || revealed[idx] ? 'not-allowed' : 'pointer',
              padding: 0,
            }}
            onClick={() => handleTileClick(idx)}
            disabled={gameOver || revealed[idx]}
          >
            {revealed[idx] ? (
              <img src={tile.img} alt={tile.type} style={{ width: '90%', height: '90%' }} />
            ) : (
              <span style={{ fontSize: 18 }}>{idx + 1}</span>
            )}
          </button>
        ))}
      </div>
      <button onClick={handleRestart} style={{ marginTop: 20, padding: '10px 20px', fontSize: 16 }}>
        Restart Game
      </button>
    </div>
  );
}

export default App;