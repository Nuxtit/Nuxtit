export default function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function startMinWait(ms = 250) {
  return sleep(ms);
}
