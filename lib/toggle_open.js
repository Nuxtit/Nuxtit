export function makeComputeToggler(key) {
  return {
    get() {
      console.log(key, this.open, this.open === key);
      return this.open === key;
    },
    set(value) {
      if (value) {
        this.open = key;
      } else if (this.open === key) {
        this.open = null;
      }
    },
  };
}
