const express = require("express")
const router = express.Router()
const http = require("http")

// Make the request to Meetup
router.get("/", function(req, res, next) {
  const options = new URL("http://api.meetup.com/nebraskajs/events")

  let returnValue

  const request = http.request(options, response => {
    const chunks = []
    response.on("data", function(chunk) {
      chunks.push(chunk)
    })
    response.on("end", function() {
      const returnString = Buffer.concat(chunks).toString()
      returnValue = JSON.parse(returnString)

      const attendees =
        new URL(
          "http://api.meetup.com/nebraskajs/events/" + returnValue[0].id
        ) + "/rsvps"

      const request2 = http.request(attendees, response => {
        const chunks = []
        response.on("data", function(chunk) {
          chunks.push(chunk)
        })
        response.on("end", function() {
          const returnString = Buffer.concat(chunks).toString()
          const returnValueAttendees = JSON.parse(returnString)

          res.render("index", {
            title: "NebraskaJS",
            data: returnValue[0],
            attendees: returnValueAttendees
          })
        })
      })
      request2.on("error", function(error) {
        res.json({ errors: ["Error occurred on getting data"] })
      })
      request2.end()
    })
  })


  request.on("error", function(error) {
    res.json({ errors: ["Error occurred on getting data"] })
  })
  request.end()
})

module.exports = router
