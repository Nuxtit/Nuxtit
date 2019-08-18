const fs = require('fs');
const shell_exec = require('shell_exec').shell_exec;
const pick = require('lodash/pick');

const fullconfig = JSON.parse(fs.readFileSync(__dirname+'/fullconfig.json'));

const scanfilesat = './components ./pages ./plugins ./layouts ./mixins ./lib';

const notGlyphs = [
  'fa-btn',
  'fa-fw',
  'fa-spin',
];

const scannedIconList = shell_exec(
  'egrep -R "fa-[a-z-]{1,}" '+scanfilesat+' --only-matching --no-filename | sort | uniq'
).split('\n')
  .filter(Boolean)
  .filter(glyphName => !notGlyphs.includes(glyphName))
  .sort();

// console.log(scannedIconList)
// process.exit();

const glyphs = scannedIconList.map((glyphName) => {
  const data = { glyphName };
  return data;
});

glyphs.forEach((data) => {
  const { glyphName } = data;

  const fcGlyphs = fullconfig.glyphs.filter(item => {
    if (item.src !== 'fontawesome') return false;
    if (glyphName === 'fa-'+item.css) return true;
    return false;
  })
  if (fcGlyphs.length !== 1) {
    console.log(fcGlyphs);
    console.log('expected 1 glyph result, ', fcGlyphs.length, ' found for ', glyphName, ', is probably an alias, check http://fontello.com/');
    process.exit(1);
  }
});


fullconfig.glyphs = fullconfig.glyphs.filter(item => {
  if (item.src !== 'fontawesome') return false;
  if (scannedIconList.includes('fa-'+item.css)) return true;
  return false;
})

fs.writeFileSync('./fontello.json', JSON.stringify(fullconfig, null, 2));

const css = './static/fa/css';
const font = './static/fa/font';
console.log(shell_exec('rm -rf ./static/fa'));
console.log(shell_exec('mkdir -p '+css));
console.log(shell_exec('mkdir -p '+font));
// console.log(shell_exec('ls -l '+font));
// console.log(shell_exec('npx fontello-cli install --config fontello.json --css '+css+' '));
console.log(shell_exec('npx fontello-cli install --config ./fontello.json --css '+css+' --font '+font));
console.log('static/fa updated!');

fs.writeFileSync('./static/fa/css/fontello.css', fs.readFileSync('./static/fa/css/fontello.css').toString()
  .replace(/\bfont\/fontello\.eot\?[0-9]{7,11}/g, 'font/fontello.eot')
  .replace(/\bfont\/fontello\.eot\?[0-9]{7,11}/g, 'font/fontello.eot')
  .replace(/\bfont\/fontello\.woff2\?[0-9]{7,11}/g, 'font/fontello.woff2')
  .replace(/\bfont\/fontello\.woff\?[0-9]{7,11}/g, 'font/fontello.woff')
  .replace(/\bfont\/fontello\.ttf\?[0-9]{7,11}/g, 'font/fontello.ttf')
  .replace(/\bfont\/fontello\.svg\?[0-9]{7,11}/g, 'font/fontello.svg')
);

console.log(shell_exec('cat '+[
  './static/css/bootstrap-darkly.min.css',
  './static/fa/css/animation.css',
  './static/fa/css/fontello.css',
  './static/css/fa.css',
  './static/css/more_dark.css',
].join(' ')+' > ./static/css/one.css'))

console.log(shell_exec('mv ./static/fa/font/* ./static/font'));
console.log(shell_exec('rm -rf ./static/fa'));
process.exit(0);