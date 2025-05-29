const luamin = require("luamin");
const fs = require("fs");
const Path = require("path");

const c = fs.readFileSync(
  Path.resolve(__dirname, "../dist/bundle.lua"),
  "utf8",
);
const min = luamin.minify(c);
fs.writeFileSync(
  Path.resolve(__dirname, "../dist/bundle.min.lua"),
  min,
  "utf8",
);
