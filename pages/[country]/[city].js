import { useState, useEffect } from 'react';

export default function CityPage({ country, city }) {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);

  async function load() {
    const r = await fetch(`/api/feed?country=${country}&city=${encodeURIComponent(city)}`);
    const j = await r.json();
    setItems(j.items || []);
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    const r = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: text, country, city })
    });
    if (r.ok) { setText(''); load(); }
  }

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      <h1>#{city} · #{country}</h1>
      <form onSubmit={submit} style={{ marginTop: 12 }}>
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          maxLength={280}
          placeholder="What’s happening right now?"
          style={{ width:'100%', height:80 }}
        />
        <div style={{ marginTop: 8 }}>
          <button disabled={!text.trim()}>Post</button>
        </div>
      </form>
      <section style={{ marginTop: 16 }}>
        {items.map(p => (
          <article key={p.id} style={{ border:'1px solid #ddd', borderRadius:12, padding:12, marginBottom:10 }}>
            <div style={{ opacity:.6, fontSize:12 }}>{new Date(p.created_at).toLocaleString()}</div>
            <p style={{ whiteSpace:'pre-wrap', marginTop:6 }}>{p.body}</p>
          </article>
        ))}
        {items.length === 0 && <p>No posts yet. Be the first!</p>}
      </section>
    </main>
  );
}

export async function getServerSideProps(ctx) {
  const { country, city } = ctx.params;
  return { props: { country: String(country).toUpperCase(), city: decodeURIComponent(String(city)) } };
}
