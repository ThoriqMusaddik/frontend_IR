import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || "https://kompas-scraper.up.railway.app";

function App() {
  const [keyword, setKeyword] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const handleScrape = async () => {
    const [start_date, end_date] = dateRange.split(' - ');

    if (!keyword || !start_date || !end_date) {
      setError('Harap isi kata kunci dan rentang tanggal dengan benar.');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/scrape`, {
        params: { keyword, start_date, end_date },
      });
      setData(res.data);
      setError('');
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError('Terjadi kesalahan saat mengambil data.');
    }
  };

  const handleDownload = () => {
    if (data.length === 0) return;

    const csvHeader = "Judul,Tanggal,Link\n";
    const csv = csvHeader + data.map(d => `"${d.title}","${d.date}","${d.link}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_scraping_kompas.csv';
    a.click();
  };

  return (
    <div className="main-container">
      <h1 className="title">Web Scraping Berita Kriminal Kompas.tv</h1>

      <div className="form-row">
        <div style={{ gridRow: 1, gridColumn: 1 }}>
          <label className="form-label">Kata Kunci</label>
          <input
            className="form-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Pembunuhan"
          />
        </div>

        <div style={{ gridRow: 1, gridColumn: 2, alignSelf: 'end' }}>
          <button className="btn btn-blue" onClick={handleScrape}>Mulai Scraping</button>
        </div>

        <div style={{ gridRow: 2, gridColumn: 1 }}>
          <label className="form-label">Rentang Tanggal</label>
          <input
            className="form-input"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="2024-01-01 - 2024-04-01"
          />
        </div>

        <div style={{ gridRow: 2, gridColumn: 2, alignSelf: 'end' }}>
          <button className="btn btn-blue2" onClick={handleDownload} disabled={data.length === 0}>
            Unduh Data
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="hasil-title">Hasil Scraping</div>
      <div className="hasil-list">
        {data.length === 0 && !error && <div>Tidak ada data ditemukan.</div>}
        {data.map((item, idx) => (
          <div className="hasil-card" key={idx}>
            <div className="hasil-judul">{item.title}</div>
            <div className="hasil-tanggal">{item.date}</div>
            <a
              className="hasil-link"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat Berita
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;