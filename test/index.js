const cp = require('child_process');
const spawn = require('cross-spawn');

console.log('start');

const r1 = spawn.sync('node', ['work.js'], {stdio: 'inherit'} // eslint-disable-line
);
console.log(r1.status);
process.exit(r1.status);