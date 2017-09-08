const fs = require('fs');
const path = require('path');

function readFilePaths(filePath, reg) {
    let filePaths = [];
    const loop = arguments.callee;
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
        dirs = fs.readdirSync(filePath);
        dirs.forEach(function (dir) {
            var result = loop(filePath + '/' + dir, reg);
            filePaths = filePaths.concat(result);
        });
    } else {
        if (reg) {
            if (reg.test(filePath)) {
                filePaths.push(filePath);
            }
        } else {
            filePaths.push(filePath);
        }
    }
    return filePaths;
}
function mkdirs(dirpath, mode, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
                callback(dirpath);
        } else {
                //尝试创建父目录，然后再创建当前目录
                mkdirs(path.dirname(dirpath), mode, function(){
                    fs.mkdir(dirpath, mode, callback);
                });
        }
    });
};

module.exports = {
    readFilePaths,
    mkdirs
}