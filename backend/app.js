const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Recipe = require("./models/recipe");

require('dotenv').config();

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-jcyqy.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch(error => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.post("/api/recipe", (req, res, next) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  recipe
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

app.get("/api/recipe/:_id", (req, res, next) => {
  Recipe.findOne({
    _id: req.params._id
  })
    .then(recipes => {
      res.status(200).json(recipes);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
});

app.put("/api/recipe/:_id", (req, res, next) => {
  const recipe = new Recipe({
    _id: req.params._id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  Recipe.updateOne({ _id: req.params.id }, recipe)
    .then(() => {
      res.status(201).json({
        message: "Recipe updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

app.delete('/api/recipe/:_id', (req, res, next) => {
  Recipe.deleteOne({_id: req.params._id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

app.use("/api/recipe", (req, res, next) => {
  Recipe.find()
    .then(recipes => {
      res.status(200).json(recipes);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});
module.exports = app;
