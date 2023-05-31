const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const randomstring = require('randomstring');
const nodeMailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
const environment = require('./config');
const authToken = require('./auth/authToken')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", `${environment.HOST}`);
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const open_db = (mode) => {
  return new sqlite3.Database('./database.db', mode, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the SQlite database.');
  });
};

const close_db = (db) => {
  db.close((err) => {
    if (err) return console.error(err.message);
    console.log('Closed the database connection.');
  });
};

let nodeMailerEmail = 'projektzaliczeniowyPK@gmail.com';

const transporter = nodeMailer.createTransport(
  {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:
    {
      user: "***",
      pass: "***"
    }
  });

let db = open_db(sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

db.run(
  `
  CREATE TABLE IF NOT EXISTS Users 
  (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    isActive INTEGER NOT NULL,
    nickname VARCHAR(20) UNIQUE,
    city VARCHAR(20),
    country VARCHAR(30),
    facebook VARCHAR(20),
    twitter VARCHAR(20),
    github VARCHAR(20),
    linkedin VARCHAR(20),
    snapchat VARCHAR(20),
    youtube VARCHAR(20),
    instagram VARCHAR(20),
    skype VARCHAR(20)
  );
`);
close_db(db);

app.get('/', async (req, res) => {
  res.send(`Server listening at port ${port}!`);
});

app.post('/api/user/account/delete', async (req, res) => {

  db = open_db(sqlite3.OPEN_READWRITE)

  try {
    var token = authToken.JWTdecode(req.body.id)

    db.get(`SELECT * FROM Users WHERE id = '${token.id}'`, (err, row) => {
      if (row.password == req.body.password)
      {
        query = `
          DELETE FROM Users
          WHERE id = '${token.id}'
        `;

        res.send({status: true});
      }
      else {
        res.send({status: 'wrongPassword'});
      }
    });

  } catch (error) {
    res.send({status: false});;
  }

  close_db(db);
});

app.post('/api/user/account/details', async (req, res) => {

  db = open_db(sqlite3.OPEN_READWRITE)

  const values = ['nickname', 'email', 'city', 'country']

  try {
    var token = authToken.JWTdecode(req.body.id);

    db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, (err, row) => {
      if (row && req.body.email == row.email && token.id != row.id)
      {
        res.send({status: 'emailExist'});
        return;
      } else {
        db.get(`SELECT * FROM Users WHERE nickname = '${req.body.nickname}'`, (err, row) => {
          if (row && req.body.nickname == row.nickname && token.id != row.id)
          {
            res.send({status: 'nicknameExist'});
            return;
          } else {
            db.get(`SELECT * FROM Users WHERE id = '${token.id}'`, (err, row) => {
              if (req.body.passwordChange == false) {
                for (var index = 0; index < values.length; index++) {
    
                  var queryEmpty = `
                    UPDATE Users
                    SET ${values[index]} = null 
                    WHERE id = '${token.id}'
                  `;
    
                  var query = `
                    UPDATE Users
                    SET ${values[index]} = '${req.body[values[index]]}'
                    WHERE id = '${token.id}'
                  `;
    
                  if (req.body[values[index]] == "") {
                    db.run(queryEmpty);
                  } else {
                    db.run(query);
                  }
                }
                res.send({status: true})
              } else {
                if (req.body.oldPassword != row.password)
                {
                  res.send({status: 'wrongPassword'})
                } else {
                  for (var index = 0; index < values.length; index++) {
    
                    var queryEmpty = `
                      UPDATE Users
                      SET ${values[index]} = null 
                      WHERE id = '${token.id}'
                    `;
      
                    var query = `
                      UPDATE Users
                      SET ${values[index]} = '${req.body[values[index]]}'
                      WHERE id = '${token.id}'
                    `;
      
                    if (req.body[values[index]] == "") {
                      db.run(queryEmpty);
                    } else {
                      db.run(query);
                    }
                  }
    
                  db.run(`
                    UPDATE Users
                    SET password = '${req.body.newPassword}'
                    WHERE id = '${token.id}'
                  `);
    
                  res.send({status: true})
                } 
              }
            });
          }
        });
      }
    });

  } catch (error) {
    res.send(false);
  }

  close_db(db);
});

app.post('/api/user/account/socialmedia', async (req, res) => {

  db = open_db(sqlite3.OPEN_READWRITE)

  try {
    var token = authToken.JWTdecode(req.body.id)

    var values = ['facebook', 'twitter', 'github', 
            'linkedin', 'snapchat', 'youtube', 'instagram', 'skype']

    for (var index = 0; index < values.length; index++) {

      var updateSocialMediaEmpty = `
        UPDATE Users
        SET ${values[index]} = null 
        WHERE id = '${token.id}'
      `;

      var updateSocialMedia = `
        UPDATE Users 
        SET ${values[index]} = '${req.body[values[index]]}'
        WHERE id = '${token.id}'
      `;

      if (req.body[values[index]] == "") {
        db.run(updateSocialMediaEmpty);
      } else {
        db.run(updateSocialMedia);
      }
    }

    res.send(true);
  } catch (error) {
    res.send(false)
  }

  close_db(db);
});

app.post('/api/user/account', async (req, res) => {

  db = open_db(sqlite3.OPEN_READONLY)

  try {
    var token = authToken.JWTdecode(req.body.id)

    db.get(`SELECT * FROM Users WHERE id = '${token.id}'`, (err, row) => {
      res.send({
        "email": row.email,
        "nickname": row.nickname,
        "city": row.city,
        "country": row.country,
        "facebook": row.facebook,
        "twitter": row.twitter,
        "github": row.github,
        "linkedin": row.linkedin,
        "snapchat": row.snapchat,
        "youtube": row.youtube,
        "instagram": row.instagram,
        "skype": row.skype
      });
    });
  } catch (error) {
    res.send(false)
  }

  close_db(db);
});

app.post('/api/auth/register', async (req, res) => {

  db = open_db(sqlite3.OPEN_READWRITE)

  db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, (err, row) => {
    if (row && row.email == req.body.email)
    {
      res.send(false);
    } else {

      let userId = uuidv4();

      db.run(
        `INSERT INTO Users(id, email, password, isActive) 
        VALUES ('${userId}', '${req.body.email}', '${req.body.password}', 0)`
      );

      let mailOptions = 
      {
        from: `"Artistic Project Manager" <'${nodeMailerEmail}'>`,
        to: req.body.email,
        subject: 'Welcome to Artistic Project Manager!',
        html: `<p>Hello, <strong>${req.body.email}</strong>,</p>
        <p>Thank you for your registration in Artistic Project Manager.</p>
        <p>Feel free to change your account details in account settings.</p>
        <p>You can log in by <a href="http://localhost:8080/login">clicking here!</a></p>
        <p>Sincerely,</br><strong>Artistic Project Manager Team</strong></p>`
      };

      transporter.sendMail(mailOptions, (error, info) =>
      {
        if (error) {
          console.log(error);
        } else {
          console.log("Mail message: %s was sent.", info.messageId);
        }
      });

      res.send(true);
    }
  });

  close_db(db);
});

app.post('/api/auth/login', async (req, res) => {

  db = open_db(sqlite3.OPEN_READONLY)

  db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, (err, row) => {
    if (row && row.email == req.body.email && row.password == req.body.password)
    {
      var token = authToken.JWTencode({id: `${row.id}`})

      res.send({
        "status": true,
        "token": token
      });
    } else {
      res.send(false);
    }
   });

  close_db(db);
});

app.post('/api/auth/forgotPassword', async (req, res) => {

  db = open_db(sqlite3.OPEN_READWRITE)

  db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, (err, row) => {
    if ( row && row.email == req.body.email)
    {

      let temporaryPassword = randomstring.generate(10);
      let passwordHashed = Buffer.from(`${temporaryPassword}`,'binary').toString('base64');

      db.run(`UPDATE Users SET password = '${passwordHashed}'
      WHERE email = '${req.body.email}'`)

      let mailOptions = 
      {
        from: `"Artistic Project Manager" <'${nodeMailerEmail}'>`,
        to: req.body.email,
        subject: 'Your password reset request',
        html: `<p>Hello, <strong>${req.body.email}</strong>,</p>
        <p>Your request to reset password was succesfully received by our system.</p>
        <p>Your temporary password is: <strong>${temporaryPassword}</strong></p>
        <p>Please log in to your account and change your password in your account settings!</p>
        <p>Sincerely,</br><strong>Artistic Project Manager Team</strong></p>`
      };

      transporter.sendMail(mailOptions, (error, info) =>
      {
        if (error) {
          console.log(error);
        } else {
          console.log("Mail message: %s was sent.", info.messageId);
        }
      });

      res.send(true);
    } else {
      res.send(false);
    }
  });

   close_db(db);
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}!`);
});
