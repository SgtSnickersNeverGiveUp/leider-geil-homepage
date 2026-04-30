const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function verifyAuth(event) {
  const auth = event.headers.authorization || '';
  return auth.startsWith('Bearer ');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  if (!verifyAuth(event)) return { statusCode: 401, body: 'Unauthorized' };
  try {
    const payload = JSON.parse(event.body);
    const { name, role, clanRole, games, avatar, bio, funTags } = payload;
    const { data, error } = await supabase.from('members').insert([{
      name, role, clan_role: clanRole, games: games || [], avatar, bio, fun_tags: funTags || []
    }]).select().single();
    if (error) return { statusCode: 500, body: JSON.stringify(error) };
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};