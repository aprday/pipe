const fs = require('fs');
const path = require('path');
const koa = require('koa');

function stat(file) {
    return new Promise(function (resolve, reject) {
        fs.stat(file, function (err, stat) {
            if (err) {
                reject(err);
            } else {
                resolve(stat);
            }
        });
    });
}

module.exports = function (dirname, port) {
    const app = new koa();
    const {extname, join} = path;
    app.use(async function (ctx) {
        console.log(ctx, dirname);
        if (ctx.originalUrl === '/') {
            ctx.redirect('/dist/index.html');
        }
        const fpath = join(dirname, ctx.path);
        console.log(fpath);
        const fstat = await stat(fpath);
    
        if (fstat.isFile()) {
            ctx.type = extname(fpath);
            ctx.body = fs.createReadStream(fpath);
            console.log(ctx.body);
        }
    });
    app.listen(port);
}