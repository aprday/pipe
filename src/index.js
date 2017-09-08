
function Task(src, reg) {
    this.src = src;
    this.reg = reg;
    this.queue = []
}

Task.prototype.use = function (callback) {
    const self = this;
    const fn = function (next) {
        return function (str, path) {
            callback(str, path, next);
        };
    };
    this.queue.push(fn);
    return this;
}

Task.prototype.run = function (path, ext) {
    const self = this;
    const filePaths = readFilePaths(self.src, self.reg);
    filePaths.forEach(function (filePath, index) {
        fs.readFile(filePath, function (err, buffer) {
            if (err) {
                throw err;
            }
            if (self.queue.length > 0) {
                const str = buffer.toString();
                self.queue.push(self.deploy(filePath, path, ext));
                var dispatch = self.queue.reduceRight(function (previousCall, currentCall) {
                    return currentCall(previousCall);
                });
                dispatch(str, filePath);
            } else {
                self.deploy(filePath, path, ext)(buffer)
            }
        });
    });
}

Task.prototype.deploy = function (filePath, destPath, ext) {
    const self = this;
    return function (buffer) {
        const fileName = path.parse(filePath).name;
        const fileExt = path.parse(filePath).ext;
        mkdirs(destPath, 0777, function () {
            ext = ext || fileExt;
            destPath = destPath + '/' + fileName + ext;
            fs.writeFile(destPath, buffer, (err) => {
                if (err) {
                    throw err;
                }
                console.log(filePath, '->', destPath);
            });
        })
    };
}
Task.prototype.dest = function (path, ext) {
    const self = this;
    self.run(path, ext);
    return this;
}

const Pipe = function () {
    this.descript = Math.random();
}

Pipe.prototype.match = function (src, reg) {
    return new Task(src, reg, this.descript);
}

module.exports = new Pipe();
