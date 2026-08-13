const request = require('supertest');

const mockFind = jest.fn();
const mockSave = jest.fn();
const mockSendToQueue = jest.fn();

jest.mock('mongoose', () => {
  const mockTest = jest.fn(function (data) {
    return {
      ...data,
      _id: 'mocked_id',
      save: mockSave,
    };
  });

  mockTest.find = mockFind;

  return {
    connect: jest.fn().mockResolvedValue(),
    Schema: jest.fn(),
    model: jest.fn(() => mockTest),
  };
});

const { app, setChannel } = require('../index');

describe('GET /', () => {
  it('returns Hello World', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});

describe('GET /tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all tasks', async () => {
    const tasks = [
      {
        title: 'Task 1',
        description: 'Description 1',
        userId: 'user1',
      },
      {
        title: 'Task 2',
        description: 'Description 2',
        userId: 'user2',
      },
    ];

    mockFind.mockResolvedValue(tasks);

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(tasks);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });

  it('returns an empty array when there are no tasks', async () => {
    mockFind.mockResolvedValue([]);

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('POST /tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    setChannel({
      assertQueue: jest.fn(),
      sendToQueue: mockSendToQueue,
    });
  });

  it('creates a task and sends a RabbitMQ message', async () => {
    const response = await request(app).post('/tasks').send({
      title: 'Test task',
      description: 'Test description',
      userId: '123',
    });

    expect(response.status).toBe(201);

    expect(mockSendToQueue).toHaveBeenCalledWith(
      'task_created',
      expect.any(Buffer)
    );
  });

  it('returns 500 when creating a task fails', async () => {
    mockSave.mockRejectedValue(new Error('Database error'));

    const response = await request(app).post('/tasks').send({
      title: 'Task 1',
      description: 'Description 1',
      userId: 'user1',
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Error creating task',
    });
  });
});
