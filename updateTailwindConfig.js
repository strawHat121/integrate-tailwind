const fs = require('fs').promises;
const path = require('path');

const configMappings = {
    'Next.js': {
        content: [
            './app/**/*.{js,ts,jsx,tsx,mdx}',
            './pages/**/*.{js,ts,jsx,tsx,mdx}',
            './components/**/*.{js,ts,jsx,tsx,mdx}',
            './src/**/*.{js,ts,jsx,tsx,mdx}',
        ]
    },
    'Vite-React': {
        content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
    },
    'Vite-Vue': {
        content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
    },
    'Vite-Svelte': {
        content: ['./index.html', './src/**/*.{svelte,js,ts,jsx,tsx}']
    },
    'Gatsby': {
        gatsbyPlugins: ['gatsby-plugin-postcss'],
        content: ['./src/pages/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}']
    },
    'SolidJS': {
        content: ['./src/**/*.{js,jsx,ts,tsx}']
    },
    'Angular': {
        content: ['./src/**/*.{html,ts}']
    }
};

const updateTailwindConfig = async (framework) => {
    try {
        const frameworkConfig = configMappings[framework];

        if (!frameworkConfig) {
            throw new Error(`Unsupported framework: ${framework}`);
        }

        if (framework === 'Gatsby') {
            await updateGatsbyConfig(frameworkConfig.gatsbyPlugins);
        }

        await updateTailwindContent(frameworkConfig.content);

        console.log(`Tailwind CSS configuration updated for ${framework}.`);
    } catch (error) {
        console.error('Error updating Tailwind config:', error);
    }
};

const updateTailwindContent = async (content) => {
    const tailwindConfigPath = path.resolve(process.cwd(), 'tailwind.config.js');
    const tailwindConfig = require(tailwindConfigPath);

    tailwindConfig.content = content;
    const updatedConfig = `module.exports = ${JSON.stringify(tailwindConfig, null, 2)};\n`;

    await fs.writeFile(tailwindConfigPath, updatedConfig, 'utf8');
};

const updateGatsbyConfig = async (plugins) => {
    const gatsbyConfigPath = path.resolve(process.cwd(), 'gatsby-config.js');
    const gatsbyConfig = require(gatsbyConfigPath);

    gatsbyConfig.plugins = gatsbyConfig.plugins.concat(plugins);
    const updatedGatsbyConfig = `module.exports = ${JSON.stringify(gatsbyConfig, null, 2)};\n`;

    await fs.writeFile(gatsbyConfigPath, updatedGatsbyConfig, 'utf8');
};

module.exports = updateTailwindConfig;
