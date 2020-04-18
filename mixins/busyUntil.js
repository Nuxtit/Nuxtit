import { startMinWait } from '~/lib/sleep';

export default {
  data() {
    return {
      busy: false,
    };
  },
  methods: {
    async busyUntil(p) {
      try {
        const minWait = startMinWait();
        this.busy = true;
        const result = await p;
        await minWait;
        return result;
      } finally {
        this.busy = false;
      }
    },
  },
};
