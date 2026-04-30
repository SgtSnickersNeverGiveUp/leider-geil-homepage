const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  try {
    const { filename, fileBase64 } = JSON.parse(event.body);
    const buffer = Buffer.from(fileBase64, 'base64');
    const path = `avatars/${Date.now()}_${filename}`;
    const { error } = await supabase.storage.from('avatars').upload(path, buffer, { contentType: 'image/jpeg' });
    if (error) return { statusCode: 500, body: JSON.stringify(error) };
    const { publicURL } = supabase.storage.from('avatars').getPublicUrl(path);
    return { statusCode: 200, body: JSON.stringify({ url: publicURL }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};