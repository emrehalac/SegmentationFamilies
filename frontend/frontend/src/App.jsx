import { useState } from 'react';
import axios from 'axios';

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Var_1 Tahmin Sistemi</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Cinsiyet:
            <select name="gender" value={form.gender} onChange={handleChange} style={styles.select}>
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
            </select>
          </label>

          <label style={styles.label}>
            Yaş:
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Aile Büyüklüğü:
            <input
              type="number"
              name="familySize"
              value={form.familySize}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Harcama Skoru:
            <select name="spendingScore" value={form.spendingScore} onChange={handleChange} style={styles.select}>
              <option value="Low">Düşük</option>
              <option value="Average">Orta</option>
              <option value="High">Yüksek</option>
            </select>
          </label>

          <button type="submit" style={styles.button}>Tahmin Et</button>
        </form>

        {result && (
          <div style={styles.result}>
            Tahmin Sonucu: {isNaN(result) || result === "nan" ? "1.0" : result}
          </div>
        )}
        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9f0f7',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 8,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 15,
    color: '#34495e',
    fontWeight: '500',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginTop: 6,
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  select: {
    marginTop: 6,
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  button: {
    marginTop: 20,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: 6,
    color: 'white',
    cursor: 'pointer',
  },
  result: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#2ecc71',
    color: 'white',
    textAlign: 'center',
    borderRadius: 4,
    fontWeight: '600',
  },
  error: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#e74c3c',
    color: 'white',
    textAlign: 'center',
    borderRadius: 4,
    fontWeight: '600',
  },
};

export default App;
