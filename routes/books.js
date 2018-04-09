var express = require('express');
var router = express.Router();
var Article = require("../models").Article;

/* GET articles listing. */
router.get('/', function(req, res, next) {
  Article.findAll({order: [["createdAt", "DESC"]]}).then(function(articles){
    res.render("articles/index", {articles: articles, title: "My Awesome Blog" });
  }).catch(function(error){
      res.send(500, error);
   });
});

/* POST create article. */
router.post('/', function(req, res, next) {
  Article.create(req.body).then(function(article) {
    res.redirect("/articles/" + article.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("articles/new", {article: Article.build(req.body), errors: error.errors, title: "New Article"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

/* Create a new article form. */
router.get('/new', function(req, res, next) {
  res.render("articles/new", {article: {}, title: "New Article"});
});

/* Edit article form. */
router.get("/:id/edit", function(req, res, next){
  Article.findById(req.params.id).then(function(article){
    if(article) {
      res.render("articles/edit", {article: article, title: "Edit Article"});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* Delete article form. */
router.get("/:id/delete", function(req, res, next){
  Article.findById(req.params.id).then(function(article){
    if(article) {
      res.render("articles/delete", {article: article, title: "Delete Article"});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* GET individual article. */
router.get("/:id", function(req, res, next){
  Article.findById(req.params.id).then(function(article){
    if(article) {
      res.render("articles/show", {article: article, title: article.title});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* PUT update article. */
router.put("/:id", function(req, res, next){
  Article.findById(req.params.id).then(function(article){
    if(article) {
      return article.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(article){
    res.redirect("/articles/" + article.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var article = Article.build(req.body);
        article.id = req.params.id;
        res.render("articles/edit", {article: article, errors: error.errors, title: "Edit Article"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* DELETE individual article. */
router.delete("/:id", function(req, res, next){
  Article.findById(req.params.id).then(function(article){
    if(article) {
      return article.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/articles");
  }).catch(function(error){
      res.send(500, error);
   });
});


module.exports = router;
