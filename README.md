# pipe

类似gulp的文件流管理工具

### 使用

```
    const pipe = require('../src/index.js');

    pipe.match('./test/assert/index.js').dest('./dist/static');
```

插件可以以中间件的方式配置，并且暴露回调函数


```
    pipe.match('./src/pug/index.pug').use(function (src, path, callback) {
        const compiledFunction = pug.compileFile(path);
        const output = compiledFunction(config);
        callback(output);
    }).dest('./dist', '.html');
```

支持异步调用

```
    pipe.match('./src', /[a-zA-Z]*.less$/g).use(function (src, path, callback) {
        less.render(src, function (e, res) {
            callback(res.css, path);
        });
    }).use(function (src, path, callback) {
        callback(src, path);
    }).dest('./dist/css', '.css');
```

