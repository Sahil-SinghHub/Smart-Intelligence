const http = require('http');

// Helper to make request
const makeRequest = (path, method, body = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) options.headers['Authorization'] = `Bearer ${token}`;
        if (body) options.headers['Content-Length'] = body.length;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        });

        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
};

const run = async () => {
    try {
        console.log('--- Testing Auth ---');
        // 1. Register/Login to get token
        const user = JSON.stringify({ name: 'Test', email: 'test' + Date.now() + '@test.com', password: 'password' });
        const authRes = await makeRequest('/auth/register', 'POST', user);
        console.log('Register:', authRes.statusCode);

        const token = JSON.parse(authRes.data).token;
        if (!token) throw new Error('No token');

        console.log('--- Testing AI Suggest ---');
        // 2. Test Suggest
        const suggestRes = await makeRequest('/ai/suggest-concepts?subject=Physics&topic=Gravity', 'GET', null, token);
        console.log('Suggest:', suggestRes.statusCode, suggestRes.data);

        console.log('--- Testing Add Topic ---');
        // 3. Test Add Topic
        const topic = JSON.stringify({
            subject: 'Physics',
            topicName: 'Gravity',
            difficulty: 'Medium',
            priority: 'Medium',
            keyPoints: ['Force', 'Mass']
        });
        const addRes = await makeRequest('/topics/add', 'POST', topic, token);
        console.log('Add Topic:', addRes.statusCode, addRes.data);

    } catch (e) {
        console.error(e);
    }
};

run();
