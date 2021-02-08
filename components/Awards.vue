<template lang="pug">
  span
    img(
      v-for="award in item.data.all_awardings"
      :key="award.id"
      :title="`${award.name} - ${award.coin_price} - ${award.description}`"
      :alt="`${award.name} - ${award.coin_price} - ${award.description}`"
      :src="award.resized_static_icons[1].url"
    )
</template>

<script>
export default {
  name: 'Awards',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  // methods: {
  //   preferred_icon(award) {
  //     console.log(JSON.stringify(award, null, 2));
  //     // the animated ones might not actually be resized.
  //     // return award.resized_icons[1].url;
  //     // static means non-animated
  //     return award.resized_static_icons[1].url;
  //   },
  // },
};
</script>
