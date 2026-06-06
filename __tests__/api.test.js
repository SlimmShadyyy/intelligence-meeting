// __tests__/api.test.js
const request = require('supertest');
const app = require('../src/server'); 

describe('API Core & Health Check', () => {
    it('should return 200 UP on /health', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('UP');
    });

    it('should include a traceId in the response', async () => {
        const response = await request(app).get('/health');
        expect(response.headers['x-trace-id']).toBeDefined();
    });

    it('should fail gracefully on 404 routes', async () => {
        const response = await request(app).get('/api/does-not-exist');
        expect(response.status).toBe(404);
    });
});