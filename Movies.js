require('dotenv').config();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Movie schema
const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    releaseDate: Date,
    genre: {
      type: String,
      enum: [
        'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
      ],
    },
    actors: [{
      actorName: String,
      characterName: String,
    }],
  });

  const Movie = mongoose.model('Movie', MovieSchema);

  // const movies = [
  //   {
  //     title: "The Dark Knight",
  //     releaseDate: "2008-07-18",
  //     genre: "Action",
  //     actors: [
  //       { actorName: "Christian Bale", characterName: "Bruce Wayne / Batman" },
  //       { actorName: "Heath Ledger", characterName: "Joker" },
  //       { actorName: "Aaron Eckhart", characterName: "Harvey Dent / Two-Face" }
  //     ]
  //   },
  //   {
  //     title: "Inception",
  //     releaseDate: "2010-07-16",
  //     genre: "Science Fiction",
  //     actors: [
  //       { actorName: "Leonardo DiCaprio", characterName: "Dom Cobb" },
  //       { actorName: "Joseph Gordon-Levitt", characterName: "Arthur" },
  //       { actorName: "Ellen Page", characterName: "Ariadne" }
  //     ]
  //   },
  //   {
  //     title: "Forrest Gump",
  //     releaseDate: "1994-07-06",
  //     genre: "Drama",
  //     actors: [
  //       { actorName: "Tom Hanks", characterName: "Forrest Gump" },
  //       { actorName: "Robin Wright", characterName: "Jenny Curran" },
  //       { actorName: "Gary Sinise", characterName: "Lieutenant Dan Taylor" }
  //     ]
  //   },
  //   {
  //     title: "The Lord of the Rings: The Return of the King",
  //     releaseDate: "2003-12-17",
  //     genre: "Fantasy",
  //     actors: [
  //       { actorName: "Elijah Wood", characterName: "Frodo Baggins" },
  //       { actorName: "Viggo Mortensen", characterName: "Aragorn" },
  //       { actorName: "Ian McKellen", characterName: "Gandalf" }
  //     ]
  //   },
  //   {
  //     title: "Pulp Fiction",
  //     releaseDate: "1994-10-14",
  //     genre: "Thriller",
  //     actors: [
  //       { actorName: "John Travolta", characterName: "Vincent Vega" },
  //       { actorName: "Samuel L. Jackson", characterName: "Jules Winnfield" },
  //       { actorName: "Uma Thurman", characterName: "Mia Wallace" }
  //     ]
  //   }
  // ];
  


// movies.forEach(movieData => {
//   const movie = new Movie(movieData);
//   movie.save()
//     .then(() => console.log("`Saved ${movie.title}`")
//     .catch(err => console.error("`Error saving ${movie.title}`", err)));
//   });
  
// return the model
module.exports = mongoose.model('Movie', MovieSchema);

