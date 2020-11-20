<template lang="pug">
  span
    img(
      v-for="award in item.data.all_awardings"
      :key="award.id"
      :title="`${award.name} - ${award.coin_price} - ${award.description}`"
      :alt="`${award.name} - ${award.coin_price} - ${award.description}`"
      :src="award.resized_icons[1].url"
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
};
</script>
