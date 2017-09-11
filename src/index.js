const fs = require('fs');
const path = require('path');
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
        console.log(src);
        readFilePath(src, reg, (filePath) => {
            fs.readFile(filePath, function (err, buffer) {
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
        return function (buffer) {
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
    match(src, reg) {
        return new Task(src, reg, this.descript);
    }
}

module.exports = new Pipe();
