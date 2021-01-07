const { execSync } = require('child_process');
const { existsSync } = require('fs');

const baseOptions = { stdio: 'inherit' }; 
const basePath = './scripts/tools/sandbox';

const init = () => {
    if (!existsSync(basePath)) {
        console.log('Initializing wrapped-xtz project');
        execSync(`git clone https://github.com/stove-labs/wrapped-xtz ${basePath}`, baseOptions)
        execSync(`cd ${basePath} && git checkout test/sdk`, baseOptions)
    }
    execSync(`cd ${basePath} && npm run fix-ligo-version 0.3.0`, baseOptions)
    execSync(`cd ${basePath} && npm ci && npm run compile`, baseOptions)
}

const start = () => {
    init();
    console.log('Starting sandbox')
    execSync(`cd ${basePath} && npm run sandbox:start && npm run migrate &`, { stdio:'ignore', detached: true })
}

const migrate = () => {
    console.log('Migrating contracts for testing')
    execSync(`cd ${basePath} && npm run migrate`, baseOptions)
}

const kill = () => {
    console.log('Killing sandbox');
    execSync(`docker stop $(docker ps -q --filter ancestor=trufflesuite/flextesa-mini-archive)`)
}

const clean = () => {
    console.log('Removing sandbox');
    execSync(`docker rm $(docker stop $(docker ps -a -q --filter ancestor=<image-name> --format="{{.ID}}"))`, baseOptions)
}

const restart = () => kill() && start()

module.exports = { start, migrate, kill, clean, init, restart };
