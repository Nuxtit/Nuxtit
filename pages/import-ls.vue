<template lang="pug">
  section.container
    | use a custom passphrase for more security, but then you have to remember it!
    input(v-model="passphrase")
    button.btn.btn.primary(@click.prevent.stop="exportToFile")
      | Export
    .btn.btn-primary(@click.stop @change="importFromFile")
      input(type="file" name="import")
</template>

<script>
import cryptico from 'cryptico';

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
      console.log('exportToFile');
      const plaintext = JSON.stringify(window.localStorage);
      console.log({ plaintext });
      const result = cryptico.encrypt(plaintext, this.publickeystring);
      console.log({ result });
      download('backup.dat', result.cipher);
    },
    importFromFile($event) {
      console.log($event);
      const input = $event.srcElement || $event.target;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = $fileReadEvent => {
        const binary = $fileReadEvent.target.result;
        console.log({ binary });
        const plaintext = cryptico.decrypt(binary, this.rsakey);
        console.log({ plaintext });
        const newLsItems = JSON.parse(plaintext);
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
  console.log('download');
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  click(element);
  document.body.removeChild(element);
}

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
