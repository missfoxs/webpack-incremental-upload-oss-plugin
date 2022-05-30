const path = require("path");
const fs = require("fs");
const UploadOssPlugin = require("./plugin/upload-oss-pluging");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = fs
  .readFileSync(path.resolve(__dirname, "./plugin/oss.conf"), "utf8")
  .split("|");
const configObj = {
  region: config[0].split(".")[0],
  accessKeyId: config[1],
  accessKeySecret: config[2],
  bucket: config[3],
  endpoint: `https://${config[0]}`,
};

module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new UploadOssPlugin(configObj), new HtmlWebpackPlugin()],
};
