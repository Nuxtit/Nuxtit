const axios = require('axios');
const bots = require('../lib/bots_old.json');
const fs = require('fs');
const sortBy = require('lodash/sortBy.js');

const BOTS_JSON = `${__dirname}/../lib/bots.json`

async function main () {
  console.log(bots)

  console.log('read oldFile')
  const oldFile = await new Promise(resolve => {
    fs.readFile(BOTS_JSON, (err, content) => {
      if (err) {
        console.error(err);
        console.error(err);
        process.exit(1);
      }
      // console.log('content', content)
      // console.log('content', JSON.parse(content))
      resolve(JSON.parse(content) || {})
    });
  })
  console.log('oldFile', oldFile)


  console.log('before reduce')
  const newJson = await bots.reduce(async (prev, name_uc) => {
    const carry = await prev
    const resp = await axios.get(`https://old.reddit.com/user/${name_uc}/about.json`, {
      validateStatus: null,
    })
    console.log('axios', resp.status, name_uc, (resp.data&&resp.data.data||resp.data));

    if (resp.status === 200 && resp.data.kind === 't2') {
      const data = resp.data.data
      carry[data.name] = {
        ...carry[data.name],
        created: data.created,
        is_suspended: data.is_suspended,
      }
    } else if (resp.status === 404) {
      // @todo get original case of deleted bots
      // @todo but to be fair it's no priority
      carry[name_uc] = {
        ...carry[name_uc],
        is_deleted: true,
      }
    } else {
      process.exit(1)
    }

    await saveFile(carry)

    await new Promise((resolve) => setTimeout(resolve, 10000))

    return carry
  }, Promise.resolve(oldFile))
}

async function saveFile (input) {
  const names = sortBy(Object.keys(input), key => key.toUpperCase())
  const data = {}
  names.forEach(key => {
    data[key] = input[key];
  })

  await new Promise((resolve) => {
    fs.writeFile(BOTS_JSON, JSON.stringify(data, null, 2), err => {
      if (err) {
        console.error(err);
        console.error('error writing file, exiting...');
        process.exit(1);
      }
      resolve()
    });
  })
}

main().then(() => {
  console.log('done')
  process.exit(0)
}, (err) => {
  console.error(err)
  console.error('uncaught err, exiting...')
  process.exit(1)
})