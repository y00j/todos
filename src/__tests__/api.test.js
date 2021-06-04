const request = require("supertest");
let app = require("../index");

beforeEach(() => {
    jest.resetModules();
    app = require("../index");
})
describe("GET /todoTasks", () => {
    test("It should respond with an array of todos", async () => {
        const response = await request(app).get("/api/todoTasks");
        expect(response.body.todoTasks).toEqual(
            ["Math Assignment", "Complete Web App"]
        );
    });
});

describe("POST /addTask", () => {
    test("It should add the task and respond with an array including the added task", async () => {
        const response = await request(app)
            .post("/api/addTask")
            .send({task: "newTask"});
        expect(response.body.todoTasks).toEqual(
            ["Math Assignment", "Complete Web App", "newTask"]
        );
    });
});

describe("POST /removeTasks", () => {
    test("It remove a task from todoTasks, and add them to completeTasks", async () => {
        const response = await request(app)
            .post("/api/removeTasks")
            .send({selectedTasks: ["Math Assignment"]});
        expect(response.body).toEqual({
            todoTasks: ["Complete Web App"],
            completeTasks: ["Node Project", "Math Assignment"]
        });
    });
});