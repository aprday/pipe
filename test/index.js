const pipe = require('../src/index.js');

pipe.match('./test/assert/index.js', /[a-zA-Z]*.js$/g).use(function (file, callback) {
    const {str, path} = file;
    callback({str, path});
}).use(function (file, callback) {
    const {str, path} = file;
    callback(str);
}).dest('./dist/js', '.js');

pipe.match('./test/assert/index.js').dest('./dist/static');