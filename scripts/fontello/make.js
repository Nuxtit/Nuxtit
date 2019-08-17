const fs = require('fs');
const shell_exec = require('shell_exec').shell_exec;
const pick = require('lodash/pick');

// use faIconmap to know how to simplify aliases
const faIconmap = JSON.parse(fs.readFileSync(__dirname+'/fa_icon_map.json'));

const fullconfig = JSON.parse(fs.readFileSync(__dirname+'/fullconfig.json'));

const scanfilesat = './components ./pages ./plugins ./layouts ./mixins ./lib';

const scannedIconList = shell_exec(
  'egrep -R "fa-[a-z-]{1,}" '+scanfilesat+' --only-matching --no-filename | sort | uniq'
).split('\n').filter(Boolean).sort();

const glyphs = scannedIconList.map((glyphName) => {
  const data = { glyphName };
  data.exists = !!(faIconmap[glyphName]);
  data.alias = (faIconmap[glyphName] && faIconmap[glyphName] !== glyphName) || false;
  return data;
});

const aliases = glyphs.filter(data => data.alias);

if (aliases.length > 0) {
	const aliasNames = aliases.map(data => data.glyphName);
	console.error(aliasNames);
	console.error(pick(faIconmap, aliasNames));
	console.error('this script does not support aliases, you need to rename them');
	process.exit(1);
}

fullconfig.glyphs = fullconfig.glyphs.filter(item => {
  if (item.src !== 'fontawesome') return false;
  if (scannedIconList.includes('fa-'+item.css)) return true;
  if (scannedIconList.map(v => faIconmap[v]).includes('fa-'+item.css)) return true;
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

process.exit(0);