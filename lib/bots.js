import botsMappedByName from './bots.json'

export function isBot(value) {
  return value && botsMappedByName.hasOwnProperty(value);
}
