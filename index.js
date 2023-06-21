//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "This is a personal BLOG site.You can post new posts just by visiting '/compose' page.Click on 'Read More' to visit that specific Post. ";
const aboutContent = "Hi , This is Sai teja's personal blog.\nBut you can contribute for his blog too.\nAppend the url with '/compose' to visit compose page and add your stuff.";
const contactContent = "Kariveda Sai Teja Reddy.         Instagram:@saitejakariveda.         Email-address:karivedasaitejareddy@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main(){
  await mongoose.connect("mongodb+srv://saiteja:saiteja@cluster0.u1uz09s.mongodb.net/blog");
}

var postSchema= new mongoose.Schema({
  title:String,
  content:String
});

var Post = mongoose.model("post",postSchema);


let posts = [];

app.get("/",async function(req, res){

  posts=await Post.find({});
 // console.log(posts);

  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  Post.insertMany([post]);

  res.redirect("/");

});

app.get("/posts/:postId",async function(req, res){
  const reqPostId=await Post.findById(req.params.postId);

  

    
      res.render("post", {
        title: reqPostId.title,
        content: reqPostId.content
      });
    
  

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
