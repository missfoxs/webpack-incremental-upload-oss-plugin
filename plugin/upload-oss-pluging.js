const md5 = require('md5-file')
const fs = require('fs')
const path = require('path')
const OSS = require('ali-oss')
const map = require('lodash/map')

const defaultConfig = {
  auth: {
    region: '',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    endpoint: '',
  },
};

/**
 * 增量上传
 */
module.exports = class WebpackIncrementalUpload {
  constructor(props) {
    this.assetList = []  // 打包后的文件
    this.versionList = []  // 已缓存的文件 
    this.#initClient()
  }

  apply(compiler) {
    if (compiler.hooks && compiler.hooks.emit) {
      // webpack 5
      compiler.hooks.emit.tapAsync(
        "WebpackIncrementalUpload",
        (compilation, cb) => {
          this.pluginEmitFn(compilation, cb);
        }
      );
    } else {
      compiler.plugin("emit", (compilation, cb) => {
        this.pluginEmitFn(compilation, cb);
      });
    }
  }

  #initClient() {
    const config = fs.readFileSync(path.resolve(__dirname, './oss.conf'), 'utf8').split('|')
    this.client = new OSS({
      region: config[0].split('.')[0],
      accessKeyId: config[1],
      accessKeySecret: config[2],
      bucket: config[3],
      endpoint: `https://${config[0]}`
    })
  }

  getAssetsInfo(compilation) {
    const matched = {}
    const keys = Object.keys(compilation.assets)
    for (let i = 0; i < keys.length; i++) {
      // if (!this.config.exclude.test(keys[i])) {
        matched[keys[i]] = compilation.assets[keys[i]]
      // }
    }
    return map(matched, (value, name) => ({
      name,
      path: value.existsAt,
      content: value.source()
    }))
  }

  pluginEmitFn(compilation, cb) {
    // this.uploadFiles()
    const list = this.getAssetsInfo(compilation);
    console.log('list', list);
    cb();
  }

  async uploadFiles() {
    // this.assetList.forEach(file => {
      await this.client.put('test', this.assetList[0])
    // })
  }  
};
