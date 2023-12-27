const express = require("express");
const bodyParser = require("body-parser");
const { getReplaceWords } = require("./words");
var cors = require('cors')
const server = require('./server');
const WordSchema = require('./models/word/model');
const FeedbackSchema = require('./models/feedback/model');
const moment = require('moment');
const {GROUP} = require('./utils/constant');
let words = [];

// var whitelist = ['127.0.0.1:3000','http://localhost:3000','https://restrict-words.herokuapp.com', 'https://www.facebook.com'];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

const app = express();


app.use((req, res, next) => {
  setTimeout(next, 500);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static( "public"));

app.get("/", async (req, res) => {
  const responseWords = await WordSchema.list();

  let data = [];
  for(let i = 0; i < responseWords.length; i++) {
    data.push(responseWords[i].word);
  }

  if(data.length > 0) {
    data.sort(function (a, b) {
      return b.length - a.length;
    });
    words = data;
  }

  return res.render("index");
});

// facebook - privacy policy link
app.get("/privacy-policy", (req, res) => {
  res.render("privacy-policy");
});

// submit change text
app.post("/submit", async function (req, res) {
  // set list word when exist data
  if(!words || words.length <= 0) {
    const responseWords = await WordSchema.list();
    let data = [];
    for(let i = 0; i < responseWords.length; i++) {
      data.push(responseWords[i].word);
    }
  
    if(data.length > 0) {
      data.sort(function (a, b) {
        return b.length - a.length;
      });
      words = data;
    }
  }

  let sentence = req.body.sentence;
  let characters = req.body.characters;

  const replaceWords = getReplaceWords(words, characters);

  for (let i = 0; i < words.length; i++) {
    const regex = new RegExp(words[i], "gi");
    sentence = sentence.replace(regex, replaceWords[i]);
  }

  if (sentence.indexOf("##") != -1) {
    sentence = sentence.replace(/\##/g, "<br/>");
  }

  return res.status(200).json({
    sentence: sentence,
  });
});


// submit feedback
app.post('/submit-feedback', async function (req, res) {
  const bodyWord = req.body.word;
  const bodyGroup = req.body.group;

  let payload = {
    word: bodyWord,
    group: bodyGroup
  };

  if(bodyGroup === '0') {
    payload.otherGroup = req.body.otherGroup;
  }

  const response = await FeedbackSchema.create(payload);

  let noti = {
    status: false,
    code: 500
  }

  if(response && response._id) {
    noti.status = true;
    noti.code = 200;
  }

  return res.status(noti.code).json({
    success: noti.status
  });
})



app.get('/admin-feedback', async function (req, res, next) {

  if(words.length <= 0) {
    words = await WordSchema.list();
  }

  const results = await FeedbackSchema.list();

  let feedbacks = [];

  for(let i = 0; i < results.length; i ++) {
    const result = results[i];

    feedbacks.push({
      id: result._id,
      word: result.word,
      group: result.group,
      otherGroup: result.otherGroup || null,
      date: moment(result).format('DD/MM/YYYY'),
    })
  }
  
  const response = {
    feedbacks: feedbacks,
    groups: GROUP
  };

  return res.render("admin", response);
})


app.post('/admin-delete-word', async function (req, res, next) {
  const id = req.body.id;

  if(id) {
    const response = await FeedbackSchema.remove(id);
    if(response && response._id) {
      return res.status(200).json({
        success: true
      })
    } else {
      return res.status(400).json({
        success: false
      })
    }
  }
})

app.post('/admin-merge-word', async function (req, res, next) {

  if(words.length <= 0) {
    words = await WordSchema.list();
  }

  let listWord = []
  for(let i = 0; i < words.length; i ++) {
    if(words[i]) {
      listWord.push(words[i].word);
    }
  }
  
  const id = req.body.id;

  if(id) {
    const response = await FeedbackSchema.getById(id);
    if(response && response._id) {

      const groupId = response.group;

      const words = response.word.split(',');
      if(words && words.length > 0) {
        for(let i = 0; i < words.length; i ++) {
          if(words[i]) {
            let word = words[i].trim().toLowerCase();

            if(listWord.indexOf(word) === -1) {
              let payload = {
                word: word,
                group: groupId
              };

              const rsCreateWord = await WordSchema.create(payload);
              console.log('rsCreateWord', rsCreateWord);
              
              const rsRemoveFeedBack = await FeedbackSchema.remove(id);
              console.log('rsRemoveFeedBack', rsRemoveFeedBack);
            }
          }
        }
      }
    }

    return res.status(200).json({
      success: true
    })
  }
})




// // Page not found
app.use((req, res, next) => {
  return res.json({
    status: 0,
    error: 'API not found'
  })
})

// Check cheating system
app.use((err, req, res, next) => {
  return res.json({
    status: 0,
    error: 'Error'
  })
})

server.init(app);