export function BindSettings(keys) {
  return keys.reduce((carry, key) => {
    carry[key] = {
      get() {
        return this.$store.getters[`settings/${key}`];
      },
      set(value) {
        return this.$store.dispatch(`settings/${key}`, value);
      },
    };
    return carry;
  }, {});
}

export const Types = {
  Boolean: 1,
  BooleanNullable: 2,
  Integer: 3,
};

export const options = [
  { key: 'censorUsernames', type: Types.Boolean, defaultValue: false },
  { key: 'mtEnable', type: Types.Boolean, defaultValue: true },
  { key: 'mtTagMe', type: Types.Boolean, defaultValue: false },
  { key: 'mtMin', type: Types.Integer, defaultValue: 5 },
];
