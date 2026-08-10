const request = require("supertest");

const mockFind = jest.fn();
const mockSave = jest.fn();

jest.mock("mongoose", () => {
  const mockUser = jest.fn(function (data) {
    return {
      ...data,
      save: mockSave,
    };
  });

  mockUser.find = mockFind;

  return {
    connect: jest.fn().mockResolvedValue(),
    Schema: jest.fn(),
    model: jest.fn(() => mockUser),
  };
});

const app = require("../index");

describe("GET /", () => {
  it("returns Hello World", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});

describe("GET /users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all users", async () => {
    const users = [
      {
        name: "Tony",
        email: "tony@example.com",
      },
      {
        name: "John",
        email: "john@example.com",
      },
    ];

    mockFind.mockResolvedValue(users);

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array when there are no users", async () => {
    mockFind.mockResolvedValue([]);

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("POST /users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user", async () => {
    const user = {
      name: "Tony",
      email: "tony@example.com",
    };

    mockSave.mockResolvedValue(user);

    const response = await request(app).post("/users").send(user);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Tony");
    expect(response.body.email).toBe("tony@example.com");
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when creating a user fails", async () => {
    mockSave.mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/users").send({
      name: "Tony",
      email: "tony@example.com",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Error creating user",
    });
  });
});
