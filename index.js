#!/usr/bin/env node

const prompts = require('prompts');
const yargs = require('yargs');
const integrateTailwind = require('./integrateTailwind');
const updateTailwindConfig = require('./updateTailwindConfig');
const updateGlobals = require('./updateGlobals');

prompts.override(yargs.argv);

const promptFrameworkSelection = async () => {
    return prompts({
        type: 'select',
        name: 'framework',
        message: 'Which framework would you like to integrate Tailwind with?',
        choices: [
            { title: 'Next.js', value: 'Next.js' },
            { title: 'Vite-React', value: 'Vite-React' },
            { title: 'Vite-Vue', value: 'Vite-Vue' },
            { title: 'Vite-Svelte', value: 'Vite-Svelte' },
            { title: 'Nuxt', value: 'Nuxt' },
            { title: 'Gatsby', value: 'Gatsby' },
            { title: 'SolidJS', value: 'SolidJS' },
            { title: 'Angular', value: 'Angular' },
        ],
    });
};

const main = async () => {
    try {
        const { framework } = await promptFrameworkSelection();

        if (!framework) {
            console.log('No framework selected. Exiting...');
            process.exit(1);
        }

        console.log(`Integrating Tailwind CSS with ${framework}...`);
        await integrateTailwind(framework);

        if (framework !== 'Nuxt' && framework !== 'Astro') {
            console.log(`Updating Tailwind config for ${framework}...`);
            await updateTailwindConfig(framework);
            console.log(`Updating global styles for ${framework}...`);
            await updateGlobals(framework);
        }

        console.log(`Tailwind CSS successfully integrated with ${framework}.`);
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
};

// Handle user interruption (e.g., Ctrl+C)
process.on('SIGINT', () => {
    console.log('Process interrupted. Exiting...');
    process.exit(0);
});

main();
