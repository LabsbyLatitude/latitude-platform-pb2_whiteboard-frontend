<template>
  <div>
    <v-container>
      <v-data-table :headers="headers" :items="items"> </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-dom";

export default defineComponent({
  name: "AutoTable",
  props: {
    items: {
      type: Array,
      required: true,
      default: [], //@todo, customize text for no assignments found
    },
  },
  data() {
    return {};
  },
  computed: {
    /**
     * Return an array of header v-data-table header items
     *      from the keys of the items in {@link AutoTable.items}.
     */
    headers() {
        // headers array
        let headers = [];

        // check that items isn't empty
        if (this.items instanceof Array && this.items.length > 0) {
            // search through the keys of the first item
            Object.keys(this.items[0]).forEach((key) => {
                headers.push({
                    text: key.toUpperCase(),
                    value: key,
                });
            });
        }
        return headers;
    },
  },
});
</script>
