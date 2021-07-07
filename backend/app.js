var express = require("express");
var cors = require("cors");
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var Datastore = require("nedb");
const { element } = require("protractor");

//app.use(cors());
//app.use(urlencoded(extended: false))

db = new Datastore();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, OPTIONS, POST, PUT, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

app.use((req, res, next) => {
  console.log("\n");
  next();
});
app.get("", (req, res, next) => {
  db.find({}, function (err, docs) {
    console.log(docs.length);
    res.status(200).json(docs);
    res.send();
  });
});
app.post("/login", (req, res, next) => {
  const loginData = JSON.stringify(req.body);
  console.log(loginData);

  db.findOne({ email: req.body.email }, function (err, doc) {
    if (doc == null) {
      console.log("email not found");
      res.status(401).json({ message: "email not found" });
    } else if (doc.password != req.body.password) {
      console.log("wrong password");
      res.status(401).json({ message: "wrong password" });
    } else {
      let token = Math.ceil(Math.random() * 1000);
      doc.token = token;
      db.update(
        { email: req.body.email },
        { $set: { token: token } },
        function (err, numreplaced) {
          if (err) console.log(err);
        }
      );
      res.status(200).json({
        message: "login successful",
        token: token,
      });
    }
    res.send();
  });
});

app.post("/signup", (req, res, next) => {
  const signupData = JSON.stringify(req.body);
  console.log(signupData);
  var doc = {
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    postCode: req.body.postCode,
  };
  console.log(doc);

  let found = false;
  db.find({ email: req.body.email }, function (err, docs) {
    if (err) console.log(err);
    console.log(JSON.stringify(docs));
    if (docs.length > 0) {
      found = true;
    }

    if (found) {
      console.log("403 user already signed up");
      res.status(403).json({
        message: "user already signed up",
      });
    } else {
      db.insert(doc, function (err, newDoc) {
        if (err) console.log(err);
      });
      console.log("200 signup successful");
      res.status(200).json({
        message: "signup successful",
      });
    }
    res.send();
  });
});

app.get("/profile", (req, res, next) => {
  db.findOne({ email: req.query.email }, function (err, doc) {
    if (doc == null) {
      console.log("email: " + req.query.email + " not found");
      res.status(401).json({ message: "email not found" });
    } else if (doc.token != req.query.token) {
      console.log("wrong token");
      res.status(401).json({ message: "wrong token" });
    } else {
      res.status(200).json({
        message: "profile data received",
        email: doc.email,
        highscore: doc.highscore,
        address: doc.address,
        postCode: doc.postCode,
      });
    }
    //res.send();
  });
});

// inserting scores in db.
app.post("/highscore", (req, res, next) => {
  const highscoredata = JSON.stringify(req.body);
  console.log(highscoredata);
  var doc = {
    token: req.body['token'],
    score: req.body['score'],
    email: req.body['email'],
  };

  db.find({token: req.body['token'] }, function (err, docs) {

    if (doc.email == null || doc.token == null) {
      console.log("invalid token");
      res.status(401).json({
        message: "invalid token",
      });
    } 
    else {
    
    console.log("valid token");
    console.log(docs);
    if (docs.length > 0) {
      docs.forEach(element => {
        if(element.score < req.body['score']){
          console.log("old score is smaller then new");
          db.update(
            { email: req.body['email'] },
            { $set: { score: req.body['score'] } },
            function (err, numreplaced)
            {
              if (err) console.log(err);
            }
          );
        }

      });
    }
    else
    {
      db.insert(doc, function (err, newDoc) {
        if (err) console.log(err);
        else{
          console.log("success");
        }
      });
      console.log("200 score posted.");
      res.status(200).json({
        message: "score posted",
      });
    }
  }
  });

  console.log(doc);
});

// fetching scores from db.
app.get("/highscore", (req, res, next) => {
  console.log("fetching scores");
  db.find({}, function (err, docs) {
    if (err)
    console.log(err);
    console.log(JSON.stringify(docs));
    if(docs.length >0){
      console.log(docs);
      res.status(200).json(docs);
      res.send();
    }
    else{
      console.log("empty");
    }
  });
});


module.exports = app;
