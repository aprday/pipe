const fs = require('fs');
const path = require('path');

function readFilePath(filePath, reg, callback) {
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
        dirs = fs.readdirSync(filePath);
        dirs.forEach(function (dir) {
            readFilePath(filePath + '/' + dir, reg, callback);
        });
    } else {
        if (reg) {
            if (reg.test(filePath)) {
                callback(filePath);
            }
        } else {
            callback(filePath);
        }
    }
}

function mkdirs(dir, mode, callback) {
    fs.exists(dir, function(exists) {
        if(exists) {
            callback(dir);
        } else {
                //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dir), mode, function(){
                fs.mkdir(dir, mode, callback);
            });
        }
    });
};

module.exports = {
    readFilePath,
    mkdirs
}