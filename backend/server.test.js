const request = require('supertest');
const app = require('./server');
const { Pool } = require('pg');

// Mock the pg Pool to avoid actual database connections
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Get a reference to the mocked pool
const pool = new Pool();

describe('Todo API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should retrieve all incomplete tasks', async () => {
      // Create dates that will be serialized to match the response format
      const mockDate = new Date();
      const mockDateString = mockDate.toISOString();
      
      // Mock the database response with string dates
      const mockTasks = [
        { id: 1, title: 'Test Task 1', description: 'Description 1', created_at: mockDateString },
        { id: 2, title: 'Test Task 2', description: 'Description 2', created_at: mockDateString }
      ];
      pool.query.mockResolvedValue({ rows: mockTasks });

      // Make the request
      const response = await request(app).get('/api/tasks');
      
      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(pool.query.mock.calls[0][0]).toContain('WHERE is_completed = false');
    });

    it('should handle database errors', async () => {
      // Mock a database error
      pool.query.mockRejectedValue(new Error('Database error'));

      // Make the request
      const response = await request(app).get('/api/tasks');
      
      // Verify the response
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { title: 'New Task', description: 'New Description' };
      const mockDate = new Date();
      const mockDateString = mockDate.toISOString();
      
      const createdTask = { 
        id: 3, 
        ...newTask, 
        created_at: mockDateString 
      };
      
      pool.query.mockResolvedValue({ rows: [createdTask] });

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdTask);
      expect(pool.query.mock.calls[0][0]).toContain('INSERT INTO tasks');
      expect(pool.query.mock.calls[0][1]).toEqual([newTask.title, newTask.description]);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'Missing title' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/tasks/:id/complete', () => {
    it('should mark a task as complete', async () => {
      const taskId = 1;
      const mockDate = new Date();
      const mockDateString = mockDate.toISOString();
      
      const completedTask = { 
        id: taskId, 
        title: 'Test Task', 
        is_completed: true,
        completed_at: mockDateString
      };
      
      pool.query.mockResolvedValue({ rows: [completedTask] });

      const response = await request(app)
        .put(`/api/tasks/${taskId}/complete`);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(completedTask);
      
      // Check just the query string contains the expected text
      expect(pool.query.mock.calls[0][0]).toContain('UPDATE tasks');
      expect(pool.query.mock.calls[0][1]).toEqual([taskId.toString()]);
    });

    it('should handle non-existent tasks', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/tasks/999/complete');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});