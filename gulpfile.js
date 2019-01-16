const {series} = require('gulp');
const {spawn} = require('child_process');

function build() {
    return spawn('tsc', {stdio: 'inherit'});
}

function test() {
    return spawn('nyc', ['mocha', 'test/unit/**/*.spec.ts'], {stdio: 'inherit'});
}

function integrationTest() {
    return spawn('nyc', ['mocha', 'test/integration/**/*.spec.ts'], {stdio: 'inherit'});
}

function systemTest() {
    return spawn('mocha', ['test/system/**/*.spec.ts'], {stdio: 'inherit'});
}

function buildDockerImage() {
    // todo: Make Docker build configurable (name, options, etc..)
    const imageName = 'data-ingestion-agent';
    return spawn('docker', ['build', '-t', imageName, '.'], {stdio: 'inherit'});
}

function publishCoverage() {
    const args = ['-c', 'coveralls < ./coverage/lcov.info'];
    return spawn('sh', args, {stdio: 'inherit'});
}

function generateDocs() {
    // todo: Implement this script in this gulpfile instead of running externally
    // todo: I don't like build scripts performing git operations.
    const args = ['-c', 'node -r ts-node/register ./source/util/pre-commit.ts && git add ./docs/DataAccess'];
    return spawn('sh', args, {stdio: 'inherit'});
}

exports.default = series(build, test);
exports.build = build;
exports.test = test;
exports.integrationTest = integrationTest;
exports.systemTest = systemTest;
exports.buildDockerImage = buildDockerImage;
exports.publishCoverage = publishCoverage;
exports.generateDocs = generateDocs;
