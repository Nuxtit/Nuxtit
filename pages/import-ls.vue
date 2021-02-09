<template lang="pug">
  section.container
    | use a custom passphrase for more security, but then you have to remember it!
    input(v-model="passphrase")
    button.btn.btn.primary(@click.prevent.stop="exportToFile")
      | Export
    .btn.btn-primary(@click.stop @change="importFromFile")
      input(type="file" name="import")
    pre.text-monospace(v-text="messages")
</template>

<script>
import cryptico from 'cryptico';

export default {
  data() {
    return {
      passphrase: 'nuxtit',
      bits: 1024,
      messages: '',
    };
  },
  layout: 'empty',
  // middleware: ['auth'],
  computed: {
    rsakey() {
      const { passphrase, bits } = this;
      return passphrase && bits
        ? cryptico.generateRSAKey(passphrase, bits)
        : null;
    },
    publickeystring() {
      const { rsakey } = this;
      return rsakey ? cryptico.publicKeyString(rsakey) : null;
    },
  },
  methods: {
    exportToFile() {
      try {
        this.log('exportToFile() start');
        this.log('building plaintext');
        const plaintext = JSON.stringify(window.localStorage);
        this.log({ plaintext });
        this.log('plaintext to base64');
        const in_base64 = btoa(plaintext);
        this.log({ in_base64 });
        this.log('encrypting base64');
        const result = cryptico.encrypt(in_base64, this.publickeystring);
        this.log({ result });
        this.download('backup.dat', result.cipher);
        this.log('exportToFile() end');
      } catch (err) {
        console.error(err);
        this.log('error!');
        this.log((err && err.message) || err);
        this.log(new String(err));
      }
    },
    async importFromFile($event) {
      this.log('importFromFile() start');
      this.log($event);
      const input = $event.srcElement || $event.target;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = async $fileReadEvent => {
        try {
          this.log('importFromFile().reader.onload');
          const binary = $fileReadEvent.target.result;
          // this.log({ binary });
          this.log('decrypting binary');
          const result = cryptico.decrypt(binary, this.rsakey);
          const in_base64 = result.plaintext;
          // this.log({ result });
          this.log('parsing base64');
          const plaintext = atob(in_base64);
          this.log('parsing JSON');
          const newLsItems = JSON.parse(plaintext);
          this.log('writing to LS');
          // console.log({ currentLsItems: window.localStorage });
          // console.log({ newLsItems });
          if (typeof newLsItems === 'object') {
            Object.assign(window.localStorage, newLsItems);
          } else {
            this.log(
              'Error: typeof newLsItems !== object, recieved: ' +
                typeof newLsItems,
            );
          }
          input.value = null;
          console.log({
            'auth/isAuthenticated': this.$store.getters['auth/isAuthenticated'],
          });
          await this.$nextTick();
          await this.$store.dispatch('auth/refreshFromLs');
          await this.$nextTick();
          if (!this.$store.getters['auth/isAuthenticated']) {
            const fun = this.$store.getters['auth/usernames'][0] || null;
            this.log('importFromFile() setting first username: ' + fun);
            await this.$store.dispatch('auth/setCurrent', fun);
          }
          this.log('importFromFile() end');
          this.log('done!');
        } catch (err) {
          console.error(err);
          this.log('error!');
          this.log((err && err.message) || err);
          this.log(new String(err));
        }
      };
      reader.readAsText(file);
    },
    download(filename, text) {
      this.log('download() start');
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:application/base64,' + encodeURIComponent(text),
      );
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      click(element);
      document.body.removeChild(element);
      this.log('download() done');
    },
    log(value) {
      if (typeof value != 'string') {
        value = JSON.stringify(value);
      }
      this.messages += `\n${value}`;
    },
  },
};

function click(el) {
  let evt;
  if (document.createEvent) {
    evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
  }
  evt ? el.dispatchEvent(evt) : el.click && el.click();
}
</script>
