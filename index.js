const http = require("http");
const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("postData", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(express.json());

const customMorganFormat =
  ":method :url :status :res[content-length] :response-time ms :postData";

app.use(express.json());
app.use(morgan(customMorganFormat));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

let info = {
  content: `Phonebook has info for ${persons.length} people`,
  time: new Date().toString(),
};

const updateInfo = () => {
  info.content = `Phonebook has info for ${persons.length} people`;
  info.time = new Date().toString();
};

app.get("/info", (request, response) => {
  updateInfo();
  response.send(`
      <p>${info.content}</p>
      <p>${info.time}</p>
    `);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  updateInfo();

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  person = persons.filter((person) => person.id !== id);
  updateInfo();

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
