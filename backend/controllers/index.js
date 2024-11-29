const controllers = {};

controllers.user = require('./user');
controllers.employerTasks = require('./employerTasks');
controllers.employerTaskDetails = require('./employerTaskDetails');
controllers.vehicles = require("./vehicles");
controllers.employerPayment = require('./employerPayment');

module.exports = controllers;