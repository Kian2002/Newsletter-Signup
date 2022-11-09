const express = require("express"); 
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    },
  ],
};

const jsonData = JSON.stringify(data);

let URL = "https://us21.api.mailchimp.com/3.0/lists/370e18b04a";

const options = {
  method: "POST",
  auth: process.env.API,
};

const request = https.request(URL, options, (response) => {

  if (response.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
  } else {
    res.sendFile(__dirname + "/failure.html");
  }

  response.on("data", (data) => {
    console.log(JSON.parse(data));
  });
});

request.write(jsonData);
request.end();
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});