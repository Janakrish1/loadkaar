const controllers = {};

controllers.user = require('./user');
controllers.employerTasks = require('./employerTasks');
controllers.employerTaskDetails = require('./employerTaskDetails');

module.exports = controllers;