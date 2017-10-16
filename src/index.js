const fs = require('fs');
const path = require('path');
const server = require('./server');

const {readFilePaths, mkdirs, readFilePath} = require('./util.js');

function Task(src, reg) {
    this.src = src;
    this.reg = reg;
    this.queue = [];
}
Task.prototype = {
    use(callback) {
        const {queue} = this;
        const middleware = (next) => (file) => callback(file, next);
        queue.push(middleware);
        return this;
    },
    run(destDir, destExt) {
        const {src, reg, deploy, queue} = this;
        // console.log(src);
        readFilePath(src, reg, (filePath) => {
            fs.readFile(filePath, function (err, buffer) {
                // console.log('>>>>', filePath);
                if (err) {
                    throw err;
                }
                if (queue.length > 0) {
                    const str = buffer.toString();
                    queue.push(deploy(filePath, destDir, destExt));
                    var dispatch = queue.reduceRight((previousCall, currentCall) => currentCall(previousCall));
                    dispatch({
                        str,
                        filePath
                    });
                } else {
                    deploy(filePath, destDir, destExt)(buffer)
                }
            });
        });
    },
    deploy(filePath, destDir, destExt) {
        // console.log('deploy', filePath, destDir);
        return function (buffer) {
            // console.log(buffer);
            let {name, ext} = path.parse(filePath);
            mkdirs(destDir, 0777, (dir) => {
                ext = destExt || ext;
                destPath = destDir + '/' + name + ext;
                fs.writeFile(destPath, buffer, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(filePath, '->', destPath);
                });
            })
        };
    },
    dest(destDir, destExt) {
        this.run(destDir, destExt);
        return this;
    }

}

const Pipe = function () {
    this.descript = Math.random();
}

Pipe.prototype = {
    match(pattern, reg) {
        return new Task(pattern, reg, this.descript);
    },
    server(dirname, port) {
        return server(dirname, port);
    }
}

module.exports = new Pipe();
