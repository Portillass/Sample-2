import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/eval', { expr });
      setResult(res.data.result);
    } catch (err) {
      setResult('Error contacting backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Go + React Calculator</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={expr}
          onChange={e => setExpr(e.target.value)}
          placeholder="Enter expression like 1+1"
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 8 }}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 16, fontWeight: 'bold' }}>Result: {result}</div>
      )}
    </div>
  );
};

export default App;
