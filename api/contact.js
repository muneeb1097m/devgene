const axios = require('axios');
const crypto = require('crypto');

function hashData(data) {
    if (!data) return null;
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, studio, engine } = req.body;
    const pixelId = process.env.FB_PIXEL_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    // Client metadata
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        const timestamp = Math.floor(Date.now() / 1000);
        
        const payload = {
            data: [
                {
                    event_name: 'Lead',
                    event_time: timestamp,
                    action_source: 'website',
                    event_source_url: req.headers.referer || 'https://devgene.live',
                    user_data: {
                        em: [hashData(email)],
                        fn: [hashData(name)],
                        client_user_agent: userAgent,
                        client_ip_address: ipAddress
                    },
                    custom_data: {
                        studio_name: studio,
                        engine: engine
                    }
                }
            ]
        };

        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
            payload
        );

        console.log('FB CAPI Response:', response.data);
        return res.status(200).json({ success: true, message: 'Event sent successfully' });
    } catch (error) {
        console.error('FB CAPI Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ 
            error: 'Failed to send event', 
            details: error.response ? error.response.data : error.message 
        });
    }
};
