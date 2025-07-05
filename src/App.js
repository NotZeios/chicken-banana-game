import React, { useState } from 'react';
import './App.css';
import chickenImg from './assets/chicken.png';
import bananaImg from './assets/banana.png';

const CHICKEN_IMG = chickenImg;
const BANANA_IMG = bananaImg;

function getShuffledTiles() {
  const tiles = Array(18).fill({ type: 'chickenban', img: CHICKEN_IMG })
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
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [scores, setScores] = useState({ chicken: 0, banana: 0 });
  const [playerSide, setPlayerSide] = useState(null); // 'chicken' or 'banana'

  const chickenLeft = tiles.filter((tile, i) => tile.type === 'chicken' && !revealed[i]).length;
  const bananaLeft = tiles.filter((tile, i) => tile.type === 'banana' && !revealed[i]).length;

  function handleTileClick(idx) {
    if (gameOver || revealed[idx] || !playerSide) return;

    const type = tiles[idx].type;
    if (type !== playerSide) {
      setGameOver(true);
      setWinner(type === 'chicken' ? 'Banana Player' : 'Chicken Player');
      setScores(prev =>
        type === 'chicken'
          ? { ...prev, banana: prev.banana + 1 }
          : { ...prev, chicken: prev.chicken + 1 }
      );
      const updatedRevealed = [...revealed];
      updatedRevealed[idx] = true;
      setRevealed(updatedRevealed);
      return;
    }

    const updatedRevealed = [...revealed];
    updatedRevealed[idx] = true;
    setRevealed(updatedRevealed);

    const newLeft = playerSide === 'chicken' ? chickenLeft - 1 : bananaLeft - 1;
    if (newLeft === 0) {
      setGameOver(true);
      setWinner(playerSide === 'chicken' ? 'Chicken Player' : 'Banana Player');
      setScores(prev =>
        playerSide === 'chicken'
          ? { ...prev, chicken: prev.chicken + 1 }
          : { ...prev, banana: prev.banana + 1 }
      );
    }
  }

  function handleRestart() {
    setTiles(getShuffledTiles());
    setRevealed(Array(36).fill(false));
    setGameOver(false);
    setWinner('');
    setPlayerSide(null);
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
      {!playerSide && (
        <div style={{ margin: '20px 0' }}>
          <b>Choose your side:</b>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setPlayerSide('chicken')}
              style={{ marginRight: 20, padding: '10px 20px', fontSize: 16, background: '#ffe5e5' }}
            >
              Play as Chicken
            </button>
            <button
              onClick={() => setPlayerSide('banana')}
              style={{ padding: '10px 20px', fontSize: 16, background: '#fffbe5' }}
            >
              Play as Banana
            </button>
          </div>
        </div>
      )}
      <p>
        Two players: <b>Chicken</b> and <b>Banana</b>.<br />
        {!playerSide
          ? <>Pick your side to start!</>
          : gameOver
            ? <span style={{ color: 'green', fontWeight: 'bold' }}>{winner} wins!</span>
            : <>Click your tiles as fast as you can!<br />If you click the wrong tile, you lose!</>
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
              cursor: gameOver || revealed[idx] || !playerSide ? 'not-allowed' : 'pointer',
              padding: 0,
            }}
            onClick={() => handleTileClick(idx)}
            disabled={gameOver || revealed[idx] || !playerSide}
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