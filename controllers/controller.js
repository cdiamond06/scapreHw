var express = require("express");

var router = express.Router();

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var SavedArticle = require("../models/SavedArticle.js");