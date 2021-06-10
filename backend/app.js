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

app.post("/highscore", (req, res, next) => {
  const highscoredata = JSON.stringify(req.body);
  console.log(highscoredata);
  db.findOne({ token: req.body.token }, function (err, doc) {
    if (doc == null) {
      console.log("invalid token");
      res.status(401).json({
        message: "invalid token",
      });
    } else {
      db.update(
        { token: req.body.token },
        {
          $set: { highscore: req.body.highscore },
        },
        function (err, numreplaced) {
          if (err) console.log(err);
        }
      );
      res.status(200).json({ message: "highscore posted" });
    }
    res.send();
  });
});

//doesn't f*#$ing work
app.get("/highscore", (req, res, next) => {
  console.log("get highscores");
  db.find({ highscores: { $exists: true } }, function (err, docs) {
    console.log(docs.length);
    let scores = "{highscores: [";
    docs.forEach((element) => {
      scores += JSON.stringify(element);
    });
    scores += "]}";
    res.status(200).json(scores);
    console.log("found highscores:\n" + scores);
    res.send();
  });
});

module.exports = app;
