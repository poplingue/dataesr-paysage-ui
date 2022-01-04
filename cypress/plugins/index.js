// promisified fs module
const path = require('path');
const fs = require('fs-extra');

function getConfigurationByFile(file) {
    const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`);

    return fs.readJson(pathToConfigFile);
}

// plugins file
module.exports = (on, config) => {
    // accept a configFile value or use development by default
    const file = config.env.configFile || 'dev';

    return getConfigurationByFile(file);
};
