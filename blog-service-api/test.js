const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  console.log(req, res);
});

server.listen(3000, "localhost", () => {
  console.log("Server started on port 3000");
});
