<template>
  <div>
    <v-container>
      <v-data-table 
      :headers=" autoHeaders ? headersAuto : headers" 
      :items="assignments"
      @click:row="clickHandler"
      class="cursor-pointer"
      no-data-text="Empty ...">

      <!-- for each specified formatter, create a slot for the corresponding table
        item column (e.g., dueDate, submitted) and call the formatter function on the value  -->
      <template v-for="formatterName in formatterNames" v-slot:[`item.${formatterName}`]="{ item }"> 
        <!-- might be worth leaving the undefined check to the formatter function -->
        {{ item[formatterName] !== undefined ? formatters[formatterName](item[formatterName]) : '' }}
      </template> 
      
      <template v-slot:item.dueDate="{ item }"> 
        {{ item.dueDate ? formatDate(item.dueDate) : '' }}
        <!-- <v-chip 
        color="gray"
        light
        label
        outlined
        >
        </v-chip> -->
      </template> 

      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from '@vue/runtime-dom';

import { moment, utc } from 'moment';

export default defineComponent({
  name: 'AssignmentBrowser',
  props: {
    assignments: {
      type: Array,
      required: true,
      default: [], //@todo, customize text for no assignments found
    },
    autoHeaders: {
      type: Boolean,
      default: () => false
    },
    clickHandler: {
      type: Function,
      default:  () => {},
    },
    /**
       * A list of headers for the submissions table. 
       * This should be formatted according to the v-data-table-headers
       * prop formatting
       */
    headers: {
      type: Array,
      default: () => [
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
      ]
    },
    /**
     * An object mapping table header ids/keys to functions for
     * formatting their corresponding value for each row
     * entry
     */
    formatters: {
      type: Object,
      default: () => {},
      required: false
    }
  },
  data() {
    return {
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
  created () {
    // console.log(`Formatter Keys: ${}`)
  },
  computed: {
    /**
     * @returns an array of names for each formatter entry in {@link formatters}
     */
    formatterNames() {
      return this.formatters ? Object.keys(this.formatters) : [];
    }
  },
  methods: {
    /**
     * Generate a local time formatted date string from an ISO
     * UTC datatime string
     * - example: Dec 24, 2023 12:00 AM
     * @param {object} dateString ISO UTC formatted datetime string
     * 
     * @todo, might be worth relocating these to separate module for easier re-use
     */
    formatDate(dateString) {
      if (dateString === '') {
        return '';
      } else if (dateString === null || dateString === undefined) {
        return 'no date';
      } else {
        return utc(dateString).local().format('lll');
        // return utc(dateString).format('MMM Do [\n] LT');
      }
    }
  }
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