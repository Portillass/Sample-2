import { useState } from 'react'
import './App.css'

const buttons = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '+', '='],
  ['C'],
];

function App() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleButtonClick = (val) => {
    if (val === 'C') {
      setExpr('');
      setResult('');
      setError('');
      return;
    }
    if (val === '=') {
      if (!expr) {
        setError('Enter an expression');
        return;
      }
      calculate();
      return;
    }
    setError('');
    setResult('');
    setExpr((prev) => prev + val);
  };

  const calculate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expr }),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError('Failed to get result.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="amazing-calculator-container">
      <header className="amazing-header">
        <h1>The Best Calculator</h1>
      </header>
      <div className="amazing-display">
        {result ? result : expr || '0'}
      </div>
      {error && <div className="amazing-error">{error}</div>}
      <div className="amazing-buttons-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {buttons.flat().map((btn, idx) => (
          <button
            key={idx}
            className={`amazing-btn ${btn === '+' ? 'plus' : ''} ${btn === '=' ? 'equals' : ''} ${btn === 'C' ? 'clear' : ''}`}
            onClick={() => handleButtonClick(btn)}
            disabled={loading || (btn === '=' && !expr)}
            style={btn === 'C' ? { gridColumn: 'span 4' } : {}}
          >
            {btn}
          </button>
        ))}
      </div>
      <div className="amazing-footer"></div>
    </div>
  );
}

export default App
