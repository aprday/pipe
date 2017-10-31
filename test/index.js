const pug = require('pug');
const less = require('less');

const pipe = require('../src/index.js');

pipe.match('./', /[a-zA-Z]*.less$/g).use(function (file, callback) {
    const {str, filePath} = file;
    less.render(str, function (e, res) {
        callback(res.css);
    });
}).dest('./dist/css', '.css');

pipe.match('./pug/index.pug').use(function (file, callback) {
    const {str, filePath} = file;
    const compiledFunction = pug.compileFile(filePath);
    const output = compiledFunction({title: '111'});
    callback(output);
}).dest('./dist', '.html');


pipe.match('./assert/').dest('./dist/static');

// pipe.server(__dirname, 3000);