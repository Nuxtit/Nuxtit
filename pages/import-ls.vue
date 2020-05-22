<template lang="pug">
  section.container
    | use a custom passphrase for more security, but then you have to remember it!
    input(v-model="passphrase")
    button.btn.btn.primary(@click.prevent.stop="exportToFile")
    | Export
    .btn.btn-primary(@click.prevent.stop @change="importFromFile")
      input(type="file" name="import")
</template>

<script>
import sleep from '~/lib/sleep';

export default {
  data() {
    return {
      passphrase: 'nuxtit',
      bits: 1024,
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
      const plaintext = JSON.stringify(localStorage);
      const result = cryptico.encrypt(plaintext, this.publickeystring);
      download('backup.dat', result);
    },
    importFromFile() {
      console.log($event);
      const input = $event.srcElement || $event.target;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = $fileReadEvent => {
        const binary = $fileReadEvent.target.result;
        const plaintext = cryptico.decrypt(binary, this.rsakey);
        const newLsItems = JSON.parse(binary);
        console.log({ currentLsItems: window.localStorage });
        console.log({ newLsItems });
        if (typeof newLsItems === 'object') {
          Object.assign(window.localStorage, newLsItems);
        }
        input.value = null;
      };
      reader.readAsText(file);
    },
  },
};

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
</script>
