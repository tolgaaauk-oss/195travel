import { supabaseAdmin } from '../../lib/supabaseServer';

export default async function handler(req, res) {
  const country = String(req.query.country || '').toUpperCase();
  const city = String(req.query.city || '');

  if (!country || !city) return res.status(400).json({ items: [] });

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('posts')
    .select('id, body, country_code, city, created_at')
    .eq('country_code', country)
    .eq('city', city)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ items: data || [] });
}
