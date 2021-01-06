const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const createRouter = function (collection) {

  const router = express.Router();

  router.get('/', (req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .findOne({ _id: ObjectID(id) })
      .then((doc) => res.json(doc))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  //create route 
  router.post('/', (req, res) => {
    //access the new sighting from the req body 
    const newSighting = req.body;
    //insert the sighting(from the body) into the collection 
    collection.insertOne(newSighting)
    //access the result of the updated collection/db   
    .then((result) => {
    //return the new sighting (not all of the sightings)
    res.json(result.ops[0])
    })
    .catch ((err) => {
      console.error(err);
      res.status(500);
      res.json({status: 500, error: err });
    });  
  });

  //destroy route 
  router.delete('/:id', (req, res) => {
    //access the ID from the req
    const id = req.params.id;
    //delete the sighting from the collection using the id 
    collection.deleteOne({_id: ObjectID(id)})
    //send the result/updated collection back in json format
    .then(result => {
      res.json(result)
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({status: 500, error: err});
    });
  });

  //update route
  router.put('/:id', (req, res) => {
  //get the id of the object/sighting
  const id = req.params.id;
  //get the updated sightings from the body 
  const updatedSightings = req.body;
  //update the db with the updateOne method - search via id, then set values of properties
  collection.updateOne(
    {_id: ObjectID(id)},
    {$set: updatedSightings}
  )
  //confirm the update was successful by accessing the result
  .then((result) => {
    res.json(result)
  })
  .catch((err)=>{
    console.error(err);
    res.status(500);
    res.json({status:500, error: err });
  });
  });
  return router;
};

module.exports = createRouter;
