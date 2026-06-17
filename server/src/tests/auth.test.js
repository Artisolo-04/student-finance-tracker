import request from 'supertest'
import app from '../app.js'

const testUser = {
  full_name: 'Test User',
  email: `test_${Date.now()}@fintrack.com`,
  password: 'password123'
}

let authToken = ''

describe('Auth API', () => {

  describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser)
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user.email).toBe(testUser.email)
      authToken = res.body.token
    })

    it('should reject duplicate email', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser)
      expect(res.status).toBe(409)
      expect(res.body.error).toBe('Email already registered')
    })

    it('should reject missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' })
      expect(res.status).toBe(400)
    })

    it('should reject short password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        full_name: 'Test', email: 'short@test.com', password: '123'
      })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Password must be at least 6 characters')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password
      })
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user.email).toBe(testUser.email)
      authToken = res.body.token
    })

    it('should reject wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword'
      })
      expect(res.status).toBe(401)
      expect(res.body.error).toBe('Invalid email or password')
    })

    it('should reject unknown email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'ghost@nowhere.com',
        password: 'password123'
      })
      expect(res.status).toBe(401)
    })

    it('should reject missing fields', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: testUser.email })
      expect(res.status).toBe(400)
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
      expect(res.status).toBe(200)
      expect(res.body.user.email).toBe(testUser.email)
    })

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me')
      expect(res.status).toBe(401)
    })

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer faketoken123')
      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/health', () => {
    it('should return server status ok', async () => {
      const res = await request(app).get('/api/health')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('ok')
    })
  })

})
