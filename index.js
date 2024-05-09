#! /usr/bin/env node

const prompts = require('prompts');
const exec = require('await-exec')
const fs = require('fs');
const path = require('path')
prompts.override(require('yargs').argv);

const integrateTailwind = async (framework) => {
    if (framework === 'Next.js') {
        await exec('npm install -D tailwindcss postcss autoprefixer')
        await exec('npx tailwindcss init -p')

    }
}

const updateTailwindConfig = async () => {
    const webpackConfigFile = require(path.resolve(process.cwd(), 'tailwind.config'));
    webpackConfigFile.content = [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ]
    const updatedConfig = `module.exports = ${JSON.stringify(webpackConfigFile, null, 2)};\n`;


    fs.writeFileSync(path.resolve(process.cwd(), 'tailwind.config.js'), updatedConfig, 'utf8');
}

const updateGlobals = async () => {
    const cssFilePath = path.resolve(process.cwd(), 'src/app/globals.css');

    // Lines to add
    const linesToAdd = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

    // Read the content of the CSS file
    fs.readFile(cssFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Manipulate the content of the CSS file
        const lines = data.split('\n');
        lines.splice(0, 0, linesToAdd);
        const newContent = lines.join('\n');

        // Write the modified content back to the file
        fs.writeFile(cssFilePath, newContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('Lines added successfully.');
        });
    });
}

(async () => {
    const response = await prompts({
        type: 'select',
        name: 'framework',
        message: 'Which framework would you like to integrate tailwind with?',
        choices: [
            { title: 'Next.js', value: 'Next.js' },
            { title: 'Green', value: '#00ff00' },
            { title: 'Blue', value: '#0000ff' }
        ],

    });
    const { framework } = response
    await integrateTailwind(framework)
    await updateTailwindConfig()
    await updateGlobals()

})();



