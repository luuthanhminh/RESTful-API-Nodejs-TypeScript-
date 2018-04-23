const { series, crossEnv, concurrent, rimraf, runInNewWindow } = require('nps-utils');

module.exports = {
    scripts: {
        default: 'nps start',
        /**
         * Starts the builded app from the dist directory
         */
        start: {
            script: 'node dist/app.js',
            description: 'Starts the builded app from the dist directory'
        },
        setup: {
            script: series(
                'yarn install'
            ),
            description: 'Setup`s the development environment(yarn & database)'
        },
        config: {
            script: series(
                runFast('./commands/tsconfig.ts'),
            ),
            hiddenFromHelp: true
        },
        build: {
            script: series(
                'nps banner.build',
                'nps config',
                'nps clean.dist',
                'nps transpile',
            ),
            description: 'Builds the app into the dist directory'
        },
        transpile: {
            script: `tsc --project ./tsconfig.build.json`,
            hiddenFromHelp: true
        },
        clean: {
            default: {
                script: series(
                    `nps banner.clean`,
                    `nps clean.dist`
                ),
                description: 'Deletes the ./dist folder'
            },
            dist: {
                script: rimraf('./dist'),
                hiddenFromHelp: true
            }
        },
        copy: {
            // default: {
            //     script: series(
            //         `nps copy.swagger`,
            //         `nps copy.public`
            //     ),
            //     hiddenFromHelp: true
            // },
            // swagger: {
            //     script: copy(
            //         './src/api/swagger.json',
            //         './dist'
            //     ),
            //     hiddenFromHelp: true
            // },
            // public: {
            //     script: copy(
            //         './src/public/*',
            //         './dist'
            //     ),
            //     hiddenFromHelp: true
            // }
        },
        banner: {
            build: banner('build'),
            clean: banner('clean')
        }
    }
};

function banner(name) {
    return {
        hiddenFromHelp: true,
        silent: true,
        description: `Shows ${name} banners to the console`,
        script: runFast(`./commands/banner.ts ${name}`),
    };
}

function copy(source, target) {
    return `copyup ${source} ${target}`;
}

function run(path) {
    return `ts-node --typeCheck ${path}`;
}

function runFast(path) {
    return `ts-node ${path}`;
}

function tslint(path) {
    return `tslint -c ./tslint.json ${path} --format stylish`;
}