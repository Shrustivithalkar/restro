const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const con = require('./db_conn.js'); // Your database connection module

const app = express();
const publicpath = path.join(__dirname, 'public');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicpath)); // Serve static files (CSS, JS, images, etc.)

// Routes
app.get('/Home', (req, res) => {
    res.sendFile(path.join(publicpath, 'Home.html'));
});

app.get('/Login', (req, res) => {
    res.sendFile(path.join(publicpath, 'Login.html'));
});

app.get('/Registration', (req, res) => {
    res.sendFile(path.join(publicpath, 'Registration.html'));
});

app.post('/RegistrationValidation', async (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body?.username

    const address = req.body.address;
    const gender = req.body.gender;
    const hobbies = Array.isArray(req.body.hobbies) ? req.body.hobbies.join(',') : req.body.hobbies;


    // Hash the password
    let hashedPassword = ""

    try {
       hashedPassword = await  bcrypt.hash(password, 10)
       console.log(hashedPassword)
    } catch (err) {
        console.error('Hashing error:', err);
        return res.status(500).send('Encryption error');
    }

      // Insert data into the database
      const sql = "INSERT INTO user (fullname, username, email, password) VALUES (?, ?, ?, ?)";
      const values = [fullname,username, email, hashedPassword];

      con.query(sql, values, (err, result) => {
          if (err) {
              console.error("Error executing query:", err);
              return res.status(500).send('Database error');
          }
          console.log("Data inserted successfully:", result);
          res.redirect('/Home'); // Redirect to the home page after successful registration
      });
    

    // Hash the password
    // bcrypt.hash(password, 10, (err, hashedPassword) => {
    //     if (err) {
    //         console.error('Hashing error:', err);
    //         return res.status(500).send('Encryption error');
    //     }
    // });
});

app.post('/LoginValidation', (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;

    const sql = 'SELECT * FROM user WHERE email = ?';
    con.query(sql, [email], function (err, result) {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const storedHash = result[0].password;
        bcrypt.compare(pass, storedHash, function (err, isMatch) {
            if (err) {
                console.error('Compare error:', err);
                return res.status(500).send('Encryption error');
            }

            if (isMatch) {
                res.sendFile(path.join(publicpath, 'video.html')); // Successful login
            } else {
                res.status(401).send('Invalid email or password');
            }
        });
    });
});

// Fallback route for unmatched paths
app.get('*', (req, res) => {
    res.sendFile(path.join(publicpath, 'Pagenotfound.html'));
});

// Start the server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
