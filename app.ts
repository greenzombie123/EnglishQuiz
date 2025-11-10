import express from "express";
import type { Request, Response, NextFunction } from "express";
import views from "./dirNames.ts";
import { body, matchedData, validationResult } from "express-validator";

// Create a server
const server = express();

// Have Express get views from views directory and set view engine to ejs
server.set("views", views);
server.set("view engine", "ejs");

// Set up Express to parse forms and JSON 
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Serve static files from views directory
server.use(express.static(views[0] as string));

server.listen(3000, (error) => {
  if (error) throw error;

  console.log("Running server on port 3000");
});