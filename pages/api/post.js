import { supabaseAdmin } from '../../lib/supabaseServer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const body = String(req.body.body || '').trim();
  const country_code = String(req.body.country || '').trim().toUpperCase();
  const city = String(req.body.city || '').trim();

  if (!body || !country_code || !city) return res.status(400).json({ error: 'Missing fields' });
  if (country_code.length !== 2) return res.status(400).json({ error: 'Country must be 2 letters' });
  if (body.length > 280) return res.status(400).json({ error: 'Too long' });

  const sb = supabaseAdmin();
  const { data, error } = await sb.from('posts')
    .insert({ body, country_code, city })
    .select('id')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ ok: true });
}
