
/**
 * 增量上传
 */
module.exports = class WebpackIncrementalUpload {
  apply(compiler) {
    if (compiler.hooks && compiler.hooks.emit) {
      // webpack 5
      compiler.hooks.emit.tapAsync("WebpackIncrementalUpload", (compilation, cb) => {
        this.pluginEmitFn(compilation, cb);
      });
    } else {
      compiler.plugin("emit", (compilation, cb) => {
        this.pluginEmitFn(compilation, cb);
      });
    }
  }

  pluginEmitFn(compilation, cb) {
    // let filelist = "In this build:\n\n";
    // for (const filename in compilation.assets) {
    //   filelist += "- " + filename + "\n";
    // }
    // compilation.assets["filelist.md"] = {
    //   source: function () {
    //     return filelist;
    //   },
    //   size: function () {
    //     return filelist.length;
    //   },
    // };
    
    cb();
  }
};
