const fs = require('fs');
const path = require('path');
const camelcase = require('camelcase')
const {promisify} = require('util')
const rimraf = promisify(require('rimraf'))
const cheerio = require('cheerio');

console.log('Building all icons for Angular...')

rimraf('./angular/heroicons/src/lib/icons/*')
    .then(() => {
        return fs.promises.readdir('./solid').then(async (files) => {

            const icons = files.reduce((acc, file) => {
                const iconName = path.parse(file).name;
                const iconSvgSolid = fs.readFileSync(`./solid/${file}`, 'utf8');
                const iconSvgOutline = fs.readFileSync(`./outline/${file}`, 'utf8');
                acc[iconName] = {
                    solid: cheerio.load(iconSvgSolid)('svg').html().trim(),
                    outline: cheerio.load(iconSvgOutline)('svg').html().trim()
                }
                return acc;
            }, {});

            // export Names
            const iconTypes = 'export type HeroIconName = ' + Object.keys(icons).map(icon => `'${icon}'`).join(' | ') + ';';
            fs.writeFileSync('./angular/heroicons/src/lib/icons/icons-names.ts', iconTypes);

            // export icons paths
            fs.writeFileSync('./angular/heroicons/src/lib/icons/icons.ts', Object.keys(icons).map(icon => {
                return `export const ${camelcase(icon)} = ${JSON.stringify(icons[icon])};`
            }).join('\n'));
        })
    })
    .then(() => console.log('Finished building icons for Angular!'))
