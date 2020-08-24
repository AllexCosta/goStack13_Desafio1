const express = require("express");
const { uuid, isUuid } = require("uuidv4")
const cors = require("cors");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeRepositoriesID(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repositorie ID.' });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(repository => respository.title.includes(title))
    : repositories;
  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validadeRepositoriesID, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository;    
  return response.json(repository);
  
});

app.delete("/repositories/:id", validadeRepositoriesID, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(respository => respository.id === id);
  
  if (!repository) {
    return response.status(400).send();
  }
  
  repository.likes += 1;

  return response.json(repository)
});

module.exports = app;
