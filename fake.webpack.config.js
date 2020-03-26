// not really used by vue-cli
const path = require('path');
module.exports = {
    resolve: {
        // for IDE (WebStorm, PyCharm, etc)
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
    },
};
