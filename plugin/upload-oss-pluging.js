const md5 = require("md5");
const fs = require("fs");
const path = require("path");
const OSS = require("ali-oss");
const map = require("lodash/map");

/**
 * 获取所有文件
 * @param {*} output
 * @returns
 */
const getPrevFiles = output => {
  const list = fs.readdirSync(output);
  let result = [];
  list.forEach(filename => {
    const filePath = output + "/" + filename;
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      result = [...result, filePath];
    } else {
      result = [...result, ...getPrevFiles(filePath)];
    }
  });
  return result;
};

module.exports = class WebpackIncrementalUpload {
  constructor(props) {
    this.outputPath = "";
    this.#initClient(props);
  }

  apply(compiler) {
    if (compiler.hooks && compiler.hooks.emit) {
      // webpack 5
      compiler.hooks.afterEmit.tapAsync(
        "WebpackIncrementalUpload",
        (compilation, cb) => {
          this.outputPath = compiler.outputPath;
          // this.clearBucket();
        }
      );
    } else {
      compiler.plugin("emit", (compilation, cb) => {
        this.outputPath = compiler.outputPath;
        // this.clearBucket();
      });
    }
  }

  #initClient(config) {
    this.client = new OSS(config);
  }

  // 上传文件
  uploadFile(filename) {
    const path = this.outputPath + "/" + filename;
    return this.client.put(filename + Math.random().toString(36), path);
  }

  // 清空bucket，没找到清空方法，一个一个删除吧。
  clearBucket() {
    const prevFiles = getPrevFiles(this.outputPath).map(file =>
      file.replace(this.outputPath + "/", "")
    );
    const deleteList = prevFiles.map(filename => this.deleteFile(filename));
    Promise.all(deleteList).then(res => {
      this.startUpload();
    });
  }

  deleteFile(filename) {
    return this.client.delete(filename);
  }

  startUpload(compilation, cb) {
    const assets = compilation.assets;
    const uploads = [];
    for (let key in assets) {
      uploads.push(this.uploadFile(key));
    }
    Promise.all(uploads).then(res => {
      console.log(res);
    });
    cb();
  }
};
