const { test, describe } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../app');

describe('API (no database)', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  test('GET /api/predictions/history without token returns 401', async () => {
    const res = await request(app).get('/api/predictions/history');
    assert.strictEqual(res.status, 401);
    assert.ok(typeof res.body.message === 'string');
  });

  test('POST /api/auth/login with missing fields returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.message);
  });

  test('GET /api/students without token returns 401', async () => {
    const res = await request(app).get('/api/students');
    assert.strictEqual(res.status, 401);
  });
});
