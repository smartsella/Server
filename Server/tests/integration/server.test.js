import request from 'supertest'
import app from '../../src/app.js'

describe('Server routes', () => {
  test('GET /health returns ok status', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok', message: 'Server is running' })
  })
})
