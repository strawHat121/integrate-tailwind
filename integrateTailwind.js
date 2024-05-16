const exec = require('await-exec');

const commands = {
    common: [
        'npm install -D tailwindcss postcss autoprefixer',
        'npx tailwindcss init -p'
    ],
    Nuxt: [
        'npm install',
        'npx nuxi module add @nuxtjs/tailwindcss',
        'npx tailwindcss init'
    ],
    Gatsby: [
        'npm install -D tailwindcss postcss autoprefixer gatsby-plugin-postcss',
        'npx tailwindcss init -p'
    ],
    SolidJS: [
        'pnpm install -D tailwindcss postcss autoprefixer',
        'npx tailwindcss init -p'
    ],
    Angular: [
        'npm install -D tailwindcss postcss autoprefixer',
        'npx tailwindcss init'
    ]
};

const executeCommands = async (cmds) => {
    for (const cmd of cmds) {
        try {
            console.log(`Executing: ${cmd}`);
            await exec(cmd);
        } catch (error) {
            console.error(`Error executing command "${cmd}":`, error);
            throw error;
        }
    }
};

const integrateTailwind = async (framework) => {
    console.log(`Integrating Tailwind CSS with ${framework}...`);

    if (commands[framework]) {
        await executeCommands(commands[framework]);
    } else {
        await executeCommands(commands.common);
    }

    console.log(`Tailwind CSS integration with ${framework} completed.`);
};

module.exports = integrateTailwind;
