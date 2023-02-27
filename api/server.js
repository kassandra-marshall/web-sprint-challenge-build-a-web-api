const express = require('express');
const server = express();

server.use(express.json())

// Configure your server here
const projectsRouter = require('../api/projects/projects-router');
const actionsRouter = require('../api/actions/actions-router');

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

module.exports = server;
