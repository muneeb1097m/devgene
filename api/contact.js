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

    const { name, email, studio, engine, eventId } = req.body;
    const pixelId = process.env.FB_PIXEL_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    // Client metadata
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // 1. Send to LeadConnector Webhook (GoHighLevel)
    const webhookUrl = 'https://services.leadconnectorhq.com/hooks/imPNGtEejgfIYrixy2yE/webhook-trigger/da0d67f0-a138-46b4-9940-12da0a166be1';
    
    try {
        await axios.post(webhookUrl, {
            name,
            email,
            studio,
            engine,
            eventId,
            source: 'DevGene Landing Page'
        });
        console.log('LeadConnector Webhook Sent');
    } catch (webhookError) {
        console.error('Webhook Error:', webhookError.message);
        // We continue even if webhook fails, to ensure FB tracking still works
    }

    // 2. Send to Facebook Conversions API
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        
        const payload = {
            data: [
                {
                    event_name: 'Lead',
                    event_time: timestamp,
                    event_id: eventId,
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
            ],
            test_event_code: 'TEST45362' // Added from your screenshot to help testing
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
