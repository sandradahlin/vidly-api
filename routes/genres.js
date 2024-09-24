const express = require("express");
const Joi = require("joi");
const Genre = require("../models/Genre");
const router = express.Router();

// const genres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Drama" },
//   { id: 3, name: "Comedy" },
// ];

router.get("/", async (req, res) => {
  // const genres = await Genre.find({name: "Drama"}) // filter by property
  const genres = await Genre.find().sort("name"); // find all
  res.send(genres);

  // const genres = await Genre.find({ name: "Action" }).limit(10).sort({
  //   name: 1,
  // }); // find based on query
  //  .select({name:1, tags: 1}) //return only selected properties

  // More complex queries
  // ***** Comparison operators ***
  // eq (equal)
  // ne ( not equal)
  // gt (greater than)
  // gte ( greater than or equal to)
  // lt (less than)
  // lte ( less than or equal to)
  // in
  // in (not in)
  //   const genres = await Genre
  //   .find({ price: {$gt: 10} })
  //   .find({ price: {$gt: 10, $lte: 20} })
  //   .find({ price: {$in: [10, 15,20] }})

  // ***** Logical operators ******
  //   const genres = await Genre
  //   .find()
  //   .or([{author: "Spielberg"}, {isPublished: true}]) // each object is a filter, return either the ones where the author is Spielberg or the ones that are published
  //   .or([{price: { $gte: 15 }}, {name: /.*by.*/}]) // price greather than or equal to 15 and the name contains by
  //   .and([]) // also takes in objetcs as filters - similar to find method
  //   .limit(10)
  //   .sort({
  //     name: 1,
  //   });

  // **** Filtering with regular expressions ***
  //   const genres = await Genre
  //     // starts with
  //     .find({ author: /^Speil/ })
  //     //end with
  //     .find({ author: /berg$/ })
  //     //contains
  //     .find({ author: /.*ber.*/ }); // there are characters before and after, put /i in the end for case insensitive

  // .count() // returns the number of documents
  // pagination
  // .skip() - for pagination  ----> .skip((pageNumber -1) * pageSize ).limit(pageSize)
});

// ***************** Updating document in db **************
// async function updateCourse(id){
//     // **************1st approach: quesry first, findById(), modify its properites, and save()
//     const course = Course.findById(id)
//     if(!course) return;
//     course.isPublished = true
//     // // course.set({isPublished: true})// same but diff syntax

//     await course.save()

//     //*********** */ 2nd approach: update first - update directly in database and show the updated doc
//     // check mongodb update operators
//     const result = await Course.update({_id: id}, {
//         $set: {
//             author: "Paul",
//             isPublished: false
//         }
//     });
//    to delete the subdocument - we use $unset
// const result = await Course.update({_id: id}, {
  //         $unset: {
  //             author: "",
  //         }
  //     });
// there is also findByIdAndUpdate, we get the document before the update, if we add the object with new: true in the end, we will get the updated one directly
//     const course = await Course.findByIdAndUpdate(id, {
//         $set: {
//             author: "Jack",
//             isPublished: true
//         }
//     }, {new: true});
// }

// Remove document
// Course.deleteOne({_id: id}) // returns result
// Course.deleteMany() // delete more than one
// Course.findByIdAndRemove(id) // if we want to show the course

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Bad request");
  const genre = await Genre.findById(id);
  // const genre = genres.find((genre) => genre.id === Number(req.params.id));
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id || !name) return res.status(400).send("Bad request");

  const genre = await Genre.findByIdAndUpdate(id, { name }, { new: true });
  // const genre = genres.find((genre) => genre.id === Number(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with this id cannot be found.");

  res.send(genre);
});

// should only be called by authenticated user
router.post("/", async (req, res) => {

  // const token = req.header('x-auth-token')
  // res.status(401)

  
  // const {error} = validateGenre(req.body)
  // if(error) return res.status(400).send(error.details[0].message)
  if (!req.body || !req.body.name) return res.status(400).send("Bad request");
  const { name } = req.body;
  let genre = new Genre({
    name,
  });

  genre = await genre.save();
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Bad request");
  const genre = await Genre.findByIdAndRemove(id);
  if (!genre)
    return res.status(404).send("The genre with this id cannot be found.");
  res.send(genre);
});

const validateGenre = (genre) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
};

module.exports = router;

// Modelling relationships ****************
// two approaches

// Using references ( Normalization ) ****************
// let author = {
//   name: "Paul",
// };

// let course = {
//   author: "id", // --reference to the author
// };

// model
// const Course = mongoose.model(
//   "Course",
//   new mongoose.Schema({
//     name: String,
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Author",
//     },
//   })
// );

// Using Embedded Documents ( Denormalization ) *****************

// let course = {
//   author: {
//     name: "Paul" // --- embedded
//   }
// };

//model
// const authorSchema = new mongoose.Schema({
//   name: String,
//   bio: String,
// })
// const Author = mongoose.model('Author', authorSchema)
// const Course = mongoose.model('Course', new mongoose.Schema({
// name: String,
// author: authorSchema
// }))

// if it's array of subdocuments *****
// // const Course = mongoose.model('Course', new mongoose.Schema({
// name: String,
// authors: [authorSchema]
// }))
// new Course({name: 'name', [new Author({name:'author1'}), new Author({name:'authjor2'})]})

// also possible adding by 
// const course = await Course.findById(id)
// course.authors.push(new Author({name:"john"}))
// course.save()

// and removing by
// const course = await Course.findById(id)
// const author = course.authors.id(id) // find author
// author.remove()
// course.save()


// Hybrid approach *************************
// let author = {
//   name: "Paul",
//   // 50 other props
// };
// let course = {
//   author: {
//     id: "ref",
//     name: "Paul",
//   },
// };
