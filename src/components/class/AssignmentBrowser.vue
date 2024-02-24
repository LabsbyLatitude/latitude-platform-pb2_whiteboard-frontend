<template>
  <div>
    <v-container>
      <v-data-table 
      :headers=" autoHeaders ? headersAuto : headers" 
      :items="assignments"
      @click:row="clickHandler"
      class="cursor-pointer"> 
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from '@vue/runtime-dom';

export default defineComponent({
  name: 'AssingmentBrowser',
  props: {
    assignments: {
      type: Array,
      required: true,
      default: [], //@todo, customize text for no assignments found
    },
    autoHeaders: Boolean,
    clickHandler: {
      type: Function,
      default:  () => {},
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'Assignment Name',
          align: 'center',
          value: 'name',
        },
        // {
        //   text: 'Open Date',
        //   value: 'openDate',
        // },
        {
          text: 'Due Date',
          align: 'center',
          value: 'dueDate',
        },
      ],
    };
  },
  computed: {
    /**
     * Return an array of header v-data-table header items
     *      from the keys of the items in {@link AssingmentBrowser.assignments}.
     */
    headersAuto() {
      // headers array
      let headers = [];

      // check that assignments exist
      if (this.assignments instanceof Array && this.assignments.length > 0) {
        // search through the keys of the first assignment object
        Object.keys(this.assignments[0]).forEach((key) => {
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

<style scoped>

/* Format table headers  */
::v-deep .v-data-table table thead tr th {
  font-size: large;
  font-weight: bold;
}

/* set the header row color to same as background
for minimalist effect */
::v-deep .v-data-table-header {
  background-color: var(--v-background-base, #F1F2F4);
}

/* set mouse cursor to pointer for table rows*/
::v-deep .cursor-pointer.v-data-table table tbody tr {
  cursor: pointer;
}

</style>