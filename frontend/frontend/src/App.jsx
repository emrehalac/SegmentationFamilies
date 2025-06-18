import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [form, setForm] = useState({
    gender: 'female',
    age: '',
    familySize: '',
    spendingScore: 'low',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    try {
      const res = await axios.post('http://localhost:5000/predict', form);
      setResult(res.data.prediction);
    } catch (err) {
      setError('Tahmin yapılırken bir hata oluştu.');
    }
  };

  return (
    <div className="app-container">
      <div className="form-card">
        <h1>Var_1 Tahmin Sistemi</h1>
        <form onSubmit={handleSubmit} className="input-form">
          <div className="form-field">
            <label htmlFor="gender">Cinsiyet</label>
            <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="age">Yaş</label>
            <input
              type="number"
              id="age"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="familySize">Aile Büyüklüğü</label>
            <input
              type="number"
              id="familySize"
              name="familySize"
              value={form.familySize}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="spendingScore">Harcama Skoru</label>
            <select
              id="spendingScore"
              name="spendingScore"
              value={form.spendingScore}
              onChange={handleChange}
            >
              <option value="Low">Düşük</option>
              <option value="Average">Orta</option>
              <option value="High">Yüksek</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">Tahmin Et</button>
        </form>

        {result && (
          <div className="result">
            Tahmin Sonucu: {isNaN(result) || result === "nan" ? "1.0" : result}
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}


export default App;
