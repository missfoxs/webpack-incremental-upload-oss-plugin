const path = require("path");
const UploadOssPlugin = require("./pulgin/upload-oss-pluging");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new UploadOssPlugin(), new HtmlWebpackPlugin()],
};
