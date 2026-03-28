export default function handler(req, res) {
    const provider = req.query.provider;
    const name = req.query.name;

    if (provider === 'github') {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const state = Buffer.from(JSON.stringify({ name })).toString('base64');
        const redirectUri = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}&scope=read:user`;
        
        res.redirect(302, redirectUri);
    } else {
        res.status(400).json({ error: 'Unsupported provider' });
    }
}