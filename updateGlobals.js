const fs = require('fs').promises;
const path = require('path');

const getCSSFilePath = (framework) => {
    switch (framework) {
        case 'Next.js':
            return path.resolve(process.cwd(), 'src/app/globals.css');
        case 'Vite-React':
        case 'SolidJS':
            return path.resolve(process.cwd(), 'src/index.css');
        case 'Vite-Vue':
            return path.resolve(process.cwd(), 'src/style.css');
        case 'Vite-Svelte':
        case 'SvelteKit':
            return path.resolve(process.cwd(), 'src/app.css');
        case 'Gatsby':
            return path.resolve(process.cwd(), 'src/styles/global.css');
        case 'Angular':
            return path.resolve(process.cwd(), 'src/styles.css');
        default:
            throw new Error(`Unsupported framework: ${framework}`);
    }
};

const createGatsbyFiles = async () => {
    const srcFolderPath = path.resolve(process.cwd(), 'src');
    const stylesFolderPath = path.resolve(srcFolderPath, 'styles');
    const cssFilePath = path.resolve(stylesFolderPath, 'global.css');

    await fs.mkdir(stylesFolderPath, { recursive: true });
    await fs.writeFile(cssFilePath, '', 'utf8');

    const gatsbyBrowserJs = path.resolve(process.cwd(), 'gatsby-browser.js');
    await fs.appendFile(gatsbyBrowserJs, "import './src/styles/global.css';\n", 'utf8');

    return cssFilePath;
};

const updateGlobals = async (framework) => {
    try {
        let cssFilePath;

        if (framework === 'Gatsby') {
            cssFilePath = await createGatsbyFiles();
        } else {
            cssFilePath = getCSSFilePath(framework);
        }

        const linesToAdd = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

        const data = await fs.readFile(cssFilePath, 'utf8');
        const newContent = linesToAdd + data;

        await fs.writeFile(cssFilePath, newContent, 'utf8');
        console.log('Tailwind CSS directives added successfully.');
    } catch (error) {
        console.error('Error updating globals:', error);
    }
};

module.exports = updateGlobals;
