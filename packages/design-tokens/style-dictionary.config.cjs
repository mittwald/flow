const StyleDictionary = require("style-dictionary");
const yaml = require("js-yaml");

StyleDictionary.registerParser({
    pattern: /\.yml$/,
    parse: ({ contents }) => yaml.load(contents),
});

module.exports = {
    source: [`src/**/*.yml`],
    platforms: {
        css: {
            transformGroup: "css",
            buildPath: "dist/",
            files: [
                {
                    destination: "variables.css",
                    format: "css/variables",
                    options: {
                        outputReferences: true
                    }
                },
            ],
        },
    },
};
