const CracoAlias = require("craco-alias");

module.exports = {
    mode: process.env.REACT_APP_ENVIROMENT,
    output: {
        path: __dirname
    },
    // webpack setting
    webpack: {
        configure: {
        }
    },
    // craco plugin setting
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: "tsconfig",
                baseUrl: ".",
                tsConfigPath: "./tsconfig.paths.json"
            }
        }
    ]
};
