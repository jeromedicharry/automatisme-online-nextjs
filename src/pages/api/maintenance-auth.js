export default function handler(req, res) {
  console.log('[API] Maintenance auth called', {
    method: req.method,
    body: req.body
  });
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.MAINTENANCE_PASSWORD;

  if (password === correctPassword) {
    // Définir un cookie qui expire dans 24h
    res.setHeader('Set-Cookie', [
      `maintenance_password=${password}; Max-Age=86400; Path=/; HttpOnly; SameSite=Lax`,
    ]);

    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ message: 'Invalid password' });
  }
}
