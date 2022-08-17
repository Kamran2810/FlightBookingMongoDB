const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");

//middlewares
const app = express();
app.use(express.json());

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("App running on PORT 3000");
    });
    db = getDb();
  }
});

//For Flights

//Get all Flight Details

app.get("/flights", (req, res) => {
  let flights = [];

  db.collection("flights")
    .find()
    .forEach((flight) => flights.push(flight))
    .then(() => {
      res.status(200).json(flights);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the flights" });
    });
});

//Get Particular Flight Details

app.get("/flights/:flightno", (req, res) => {
  db.collection("flights")
    .findOne({ flightno: req.params.flightno })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not fetch the flight details" });
    });
});

//Add a Flight detail

app.post("/flights", (req, res) => {
  const flight = req.body;

  db.collection("flights")
    .insertOne(flight)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new the doocument" });
    });
});

// For Bookings

//Get all Bookings

app.get("/bookings", (req, res) => {
  let bookings = [];

  db.collection("bookings")
    .find()
    .forEach((booking) => bookings.push(booking))
    .then(() => {
      res.status(200).json(bookings);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not find the bookings" });
    });
});

//Add a booking

app.post("/bookings", (req, res) => {
  const booking = req.body;

  if (booking.flightno === flights.flightno) {
    db.collection("bookings")
      .insertOne(booking)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: "Could not book a Flight" });
      });
  } else {
    res.status(500).json({ error: "Provide correct details" });
  }
});

//   db.collection("bookings")
//     .insertOne(booking)
//     .then((result) => {
//       res.status(201).json(result);
//     })
//     .catch((err) => {
//       res.status(500).json({ err: "Could not book a Flight" });
//     });
// });

//Delete a booking

app.delete("/bookings/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("bookings")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not Cancel the Booking" });
      });
  } else {
    res.status(500).json({ error: "Not a valid Document ID" });
  }
});

//Modify a booking

app.patch("/bookings/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("bookings")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not Update the Booking" });
      });
  } else {
    res.status(500).json({ error: "Not a valid Document ID" });
  }
});
