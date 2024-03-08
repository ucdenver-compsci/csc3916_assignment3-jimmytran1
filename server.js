/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

router.route('/movies')
.get((req, res) => {
    Movie.find({
        title: { $exists: true, $ne: null },
        releaseDate: { $exists: true, $ne: null },
        genre: { $exists: true, $ne: null },
        actors: { $exists: true, $ne: null }
    }, (err, movies) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(movies);
        }
    });
})
    .post((req, res) => {
        const { title, releaseDate, genre, actors } = req.body;
    
        if (!title ||  !releaseDate || !genre || !actors || actors.length === 0) {
            return res.status(400).json({ error: 'Title, release date, genre, and at least one actor are required' });
        }
    
        try {
            const movie = new Movie({ title, releaseDate, genre, actors });
            movie.save();
            res.status(200).json(movie);
        } catch (error) {
            console.error('Error creating movie:', error);
            res.status(500).json({ error: 'Failed to create movie' });
        }
    })
    .delete(authController.isAuthenticated, (req, res) => {
        // Assuming the movie's ID is passed in the URL as a parameter
        const movieId = req.params.id;
        // Use the Movie model to delete the movie by its ID
        Movie.findByIdAndRemove(movieId, (err, deletedMovie) => {
            if (err) {
                // If there's an error, send a server error response
                return res.status(500).json({ message: "Internal server error", error: err });
            }
            if (!deletedMovie) {
                // If no movie is found, send a not found response
                return res.status(404).json({ message: "Movie not found" });
            }
            // If the deletion is successful, send a success response
            // You could also return the deletedMovie if you need to use it
            return res.status(200).json({ message: "Movie successfully deleted" });
        });
    })
    
    .put(authJwtController.isAuthenticated, (req, res) => {
        console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);
        res.json(o);
    }
    );

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


