import includes from 'lodash/includes';

export const site_rules = [
  // skip the "site rules" dialog for the actual rules I might use
  // that dialog is actually REALLY complicated
  // and it's not necessary
  'This is spam',
  'This is misinformation',
  "It's personal and confidential information",
  'It threatens violence or physical harm at someone else',
  "It's targeted harassment at someone else",
  "It's targeted harassment at me",
  // quick options for me:
  'Trolls, novelty accounts, merch sales, spammers, astroturfers, or bots',
];
