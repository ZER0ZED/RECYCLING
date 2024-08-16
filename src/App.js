import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';

const SYMBOLS = ['♠', '♥', '♦', '♣', '♤', '♡', '♢', '♧', '♚', '♛', '♜', '♝', '♞', '♟', '☀', '☁', '☂', '☃', '☄', '★', '☆', '☎', '☏', '☐', '☑', '☒', '☓', '☖', '☗', '☘', '☙', '☚', '☛', '☜', '☝', '☞', '☟', '☠', '☡', '☢', '☣', '☤', '☥', '☦', '☧', '☨', '☩', '☪', '☫', '☬', '☭', '☮', '☯', '☰', '☱', '☲'];

const generateCardSymbols = () => {
  const order = 7; // For 8 symbols per card, 57 total cards
  const projective_plane = constructProjectivePlane(order);
  const allSymbols = projective_plane.map(line =>
    line.map(point => SYMBOLS[point])
  );
  return allSymbols;
};

// Export for testing purposes and external use
export { generateCardSymbols, constructProjectivePlane, verifyProjectivePlane };

function constructProjectivePlane(order) {
  const q = order;
  const n = q * q + q + 1; // Total number of points and lines in the projective plane

  // Helper function for finite field addition
  const add = (a, b) => ((a + b) % q);

  // Helper function for finite field multiplication
  const multiply = (a, b) => ((a * b) % q);

  // Generate all points
  const points = [];
  for (let x = 0; x < q; x++) {
    for (let y = 0; y < q; y++) {
      points.push([x, y]);
    }
  }
  for (let x = 0; x < q; x++) {
    points.push([x, 'inf']);
  }
  points.push(['inf', 'inf']);

  // Generate lines (cards)
  const plane = [];

  // Lines of the form y = mx + b
  for (let m = 0; m < q; m++) {
    for (let b = 0; b < q; b++) {
      const line = [];
      for (let x = 0; x < q; x++) {
        const y = add(multiply(m, x), b);
        line.push(points.findIndex(p => p[0] === x && p[1] === y));
      }
      line.push(points.findIndex(p => p[0] === m && p[1] === 'inf'));
      plane.push(line);
    }
  }

  // Vertical lines of the form x = k
  for (let k = 0; k < q; k++) {
    const line = [];
    for (let y = 0; y < q; y++) {
      line.push(points.findIndex(p => p[0] === k && p[1] === y));
    }
    line.push(points.findIndex(p => p[0] === 'inf' && p[1] === 'inf'));
    plane.push(line);
  }

  // Line at infinity
  const infinityLine = [];
  for (let x = 0; x < q; x++) {
    infinityLine.push(points.findIndex(p => p[0] === x && p[1] === 'inf'));
  }
  infinityLine.push(points.findIndex(p => p[0] === 'inf' && p[1] === 'inf'));
  plane.push(infinityLine);

  // Ensure we have exactly n cards with q + 1 symbols each
  if (plane.length !== n) {
    console.error(`Generated ${plane.length} cards instead of expected ${n}`);
  }

  // Verify that each line has q + 1 points
  for (let i = 0; i < plane.length; i++) {
    if (plane[i].length !== q + 1) {
      console.error(`Line ${i} has ${plane[i].length} points instead of ${q + 1}`);
    }
  }

  // Verify that each pair of lines intersects at exactly one point
  for (let i = 0; i < plane.length; i++) {
    for (let j = i + 1; j < plane.length; j++) {
      const intersection = plane[i].filter(point => plane[j].includes(point));
      if (intersection.length !== 1) {
        console.error(`Lines ${i} and ${j} intersect at ${intersection.length} points instead of 1`);
      }
    }
  }

  console.log('Generated plane:', plane);
  return plane;
}

function verifyProjectivePlane(plane) {
  const n = plane.length;
  const q = 7; // Order of the projective plane
  const expectedN = q * q + q + 1; // Expected number of cards
  const errors = [];
  let totalUniqueSymbols = new Set();

  if (n !== expectedN) {
    errors.push(`Total number of cards is ${n} instead of ${expectedN}`);
  }

  for (let i = 0; i < n; i++) {
    if (plane[i].length !== q + 1) {
      errors.push(`Card ${i} has ${plane[i].length} symbols instead of ${q + 1}`);
    }
    plane[i].forEach(symbol => totalUniqueSymbols.add(symbol));

    for (let j = i + 1; j < n; j++) {
      const intersection = plane[i].filter(symbol => plane[j].includes(symbol));
      if (intersection.length !== 1) {
        errors.push(`Cards ${i} and ${j} share ${intersection.length} symbols instead of 1`);
      }
    }
  }

  if (totalUniqueSymbols.size !== expectedN) {
    errors.push(`Total number of unique symbols is ${totalUniqueSymbols.size} instead of ${expectedN}`);
  }

  if (errors.length > 0) {
    console.error("Verification failed:");
    errors.forEach(error => console.error(error));
    return false;
  }

  console.log("Verification passed successfully!");
  return true;
}

function App() {
  const [cardSymbols, setCardSymbols] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    const symbols = generateCardSymbols();
    setCardSymbols(symbols);
    const result = verifyProjectivePlane(symbols);
    setVerificationResult(result ? "Verification passed!" : "Verification failed.");
  }, []);

  const handleVerify = () => {
    const result = verifyProjectivePlane(cardSymbols);
    setVerificationResult(result ? "Verification passed!" : "Verification failed.");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Symbol Matching Game</h1>
      </header>
      <button onClick={handleVerify}>Verify Cards</button>
      {verificationResult && <p>{verificationResult}</p>}
      <div className="card-grid">
        {cardSymbols.map((symbols, index) => (
          <Card key={index} symbols={symbols} />
        ))}
      </div>
    </div>
  );
}

export default App;
