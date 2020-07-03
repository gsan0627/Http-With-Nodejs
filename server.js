const http = require("http");
const url = require("url");
const bodyJson = require("body/json");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();

server.on("request", (req, res) => {
  const parseUrl = url.parse(req.url, true);
  if (req.method === "GET" && parseUrl.pathname === "/metadata") {
    const { id } = parseUrl.query;
    console.log(id, req.headers);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    var obj = { name: "John", age: 30, city: "New York" };
    const jsonSerialize = JSON.stringify(obj);
    res.write(jsonSerialize);
    res.end();
  } else if (req.method === "POST" && parseUrl.pathname === "/users") {
    bodyJson(req, res, (err, body) => {
      if (err) {
        console.error(err);
      } else {
        console.log(body);
      }
    });
  } else if (req.method === "POST" && parseUrl.pathname === "/upload") {
    const form = new formidable.IncomingForm({
      uploadDir: __dirname,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5 * 1024 * 1024,
      encoding: "utf-8",
      maxFields: 20,
    });

    form.on("fileBegin", (name, file) => {
      console.log("Our upload has started");
    });

    form.on("file", (name, file) => {
      console.log("Field + file pair has been received");
    });

    form.on("field", (name, value) => {
      console.log("Field received:");
      console.log(name, value);
    });

    form.on("progress", (byteReceived, bytesExpected) => {
      console.log(byteReceived + " / " + bytesExpected);
    });

    form.on("error", (name, file) => {
      console.error(err);
      req.resumen();
    });

    form.on("aborted", (name, file) => {
      console.log("Request aborted by the user");
    });

    form.on("end", (name, file) => {
      console.log("Done - request fully received");
      res.end("success");
    });
  } else {
    res.writeHead(404, {
      "X-powered-By": "Node",
    });
    res.end();
  }
});

server.listen(8081);
