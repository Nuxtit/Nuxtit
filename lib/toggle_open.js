export function makeComputeToggler(key) {
  return {
    get() {
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
