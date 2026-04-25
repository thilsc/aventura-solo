import React, { useState, useEffect, useCallback } from 'react';

/* ── helper: find page by id (string or number) ── */
function findPage(pages, id) {
  return pages.find(p => String(p.id) === String(id));
}

/* ── Stat Bar ── */
function StatBar({ label, current, max, type }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="stat-item">
      <span className="stat-label">{label}</span>
      <div className="stat-bar-track">
        <div
          className={`stat-bar-fill ${type}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="stat-value">{current}/{max}</span>
    </div>
  );
}

/* ── Shelf / Home Screen ── */
function ShelfScreen({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/books/shelf.json')
      .then(r => r.json())
      .then(data => { setBooks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const icons = ['📖', '🏰', '⚔️', '🐉', '🗺️', '🔮'];

  if (loading) {
    return (
      <div className="loading-spinner">
        <span className="spinner-rune">᛭</span>
        <span>Carregando aventuras…</span>
      </div>
    );
  }

  return (
    <div className="shelf-screen">
      <h1 className="shelf-title">Aventura Solo</h1>
      <p className="shelf-subtitle">Escolha sua aventura e escreva seu destino</p>

      <div className="book-grid">
        {books.map((book, i) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => onSelectBook(book)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelectBook(book)}
          >
            <span className="book-card-icon">{icons[i % icons.length]}</span>
            <div className="book-card-title">{book.title}</div>
            <div className="book-card-desc">{book.description}</div>
            <div className="book-card-cta">
              Começar aventura <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Book / Game Screen ── */
function BookScreen({ book, onReturnShelf }) {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [hp, setHp] = useState({ current: 10, max: 10 });
  const [ht, setHt] = useState({ current: 10, max: 10 });
  const [history, setHistory] = useState([]);

  /* Load JSON */
  useEffect(() => {
    setLoading(true);
    fetch(`/books/${book.filename}`)
      .then(r => r.json())
      .then(data => {
        setBookData(data);
        const firstPage = data.pages[0];
        setCurrentPageId(firstPage.id);
        if (data.characteristics) {
          setHp({ ...data.characteristics.hp });
          setHt({ ...data.characteristics.ht });
        }
        // Restore from sessionStorage
        const saved = sessionStorage.getItem(`book_${book.id}`);
        if (saved) {
          const s = JSON.parse(saved);
          setCurrentPageId(s.pageId);
          setHp(s.hp);
          setHt(s.ht);
          setHistory(s.history || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [book]);

  /* Persist state */
  useEffect(() => {
    if (!bookData || !currentPageId) return;
    sessionStorage.setItem(`book_${book.id}`, JSON.stringify({
      pageId: currentPageId,
      hp,
      ht,
      history,
    }));
  }, [book.id, bookData, currentPageId, hp, ht, history]);

  const handleOption = useCallback((option) => {
    setHistory(h => [...h, currentPageId]);
    setCurrentPageId(String(option.id));
  }, [currentPageId]);

  const handleBack = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCurrentPageId(prev);
  }, [history]);

  const handleRestart = useCallback(() => {
    if (!bookData) return;
    sessionStorage.removeItem(`book_${book.id}`);
    const firstPage = bookData.pages[0];
    setCurrentPageId(firstPage.id);
    if (bookData.characteristics) {
      setHp({ ...bookData.characteristics.hp });
      setHt({ ...bookData.characteristics.ht });
    }
    setHistory([]);
  }, [bookData, book.id]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <span className="spinner-rune">᛭</span>
        <span>Abrindo o livro…</span>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="end-card">
        <div className="end-title">Erro ao carregar</div>
        <p className="end-text">Não foi possível carregar o livro.</p>
        <button className="btn btn-primary" onClick={onReturnShelf}>Voltar</button>
      </div>
    );
  }

  const currentPage = findPage(bookData.pages, currentPageId);
  const isEnd = !currentPage || !currentPage.options || currentPage.options.length === 0;

  return (
    <div className="book-screen">
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button className="btn btn-ghost" onClick={onReturnShelf} style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}>
          ← Prateleira
        </button>
        <span style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: 600 }}>
          {book.title}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {history.length > 0 && (
            <button className="btn btn-ghost" onClick={handleBack} style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}>
              ↩ Voltar
            </button>
          )}
          <button className="btn btn-ghost" onClick={handleRestart} style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}>
            ↺ Reiniciar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <StatBar label="HP" current={hp.current} max={hp.max} type="hp" />
        <StatBar label="HT" current={ht.current} max={ht.max} type="ht" />
      </div>

      {/* Section number */}
      {currentPage && (
        <div className="section-badge">
          <div className="section-badge-inner">{currentPage.id}</div>
        </div>
      )}

      {/* Page text */}
      {currentPage && (
        <div className="page-card">
          <p className="page-text">{currentPage.text}</p>
        </div>
      )}

      {/* Options or End */}
      {isEnd ? (
        <div className="end-card">
          <div className="end-title">⚔ Fim da Aventura</div>
          <p className="end-text">Sua jornada chegou ao fim. O que você fará agora?</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleRestart}>Jogar Novamente</button>
            <button className="btn btn-ghost" onClick={onReturnShelf}>Escolher Outro Livro</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="ornament-divider">✦</div>
          <p className="options-title">O que você faz?</p>
          <div className="options-grid">
            {currentPage.options.map((opt, idx) => (
              <button
                key={idx}
                className="option-btn"
                onClick={() => handleOption(opt)}
              >
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'Cinzel, serif', fontSize: '0.8rem', minWidth: '1.5rem' }}>
                  {idx + 1}.
                </span>
                {opt.text}
                <span className="option-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Root App ── */
export default function App() {
  const [selectedBook, setSelectedBook] = useState(() => {
    const saved = sessionStorage.getItem('selected_book');
    return saved ? JSON.parse(saved) : null;
  });

  const handleSelectBook = (book) => {
    sessionStorage.setItem('selected_book', JSON.stringify(book));
    setSelectedBook(book);
  };

  const handleReturnShelf = () => {
    sessionStorage.removeItem('selected_book');
    setSelectedBook(null);
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div>
          <div
            className="navbar-brand"
            onClick={handleReturnShelf}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleReturnShelf()}
          >
            ⚔ Aventura Solo
          </div>
          {selectedBook && (
            <div className="navbar-subtitle">{selectedBook.title}</div>
          )}
        </div>
      </nav>

      <main className="main-content">
        {selectedBook ? (
          <BookScreen book={selectedBook} onReturnShelf={handleReturnShelf} />
        ) : (
          <ShelfScreen onSelectBook={handleSelectBook} />
        )}
      </main>

      <footer className="footer">
        Copyright © {new Date().getFullYear()} · Aventura Solo
      </footer>
    </div>
  );
}
