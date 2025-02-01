<template>

    <v-list dense nav class="px-1">
        <v-list-item-group>
            <v-list-item 
                v-for="classroom in classrooms"
                two-line
                :class="textColor+'--text'"
                @click="$router.push({path: `/class/${classroom.id}`})"
            >
                <v-list-item-avatar>
                    {{ classroom.title.substring(0, 1) }}
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>
                        {{ classroom.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle :class="textColor+'--text'">
                        {{ classroom.description }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
    </v-list>

</template>

<script>
import { defineComponent } from '@vue/composition-api';

import api from '@/api'

export default defineComponent({
    props: {
        /** ID of the user whose classrooms to fetch */
        userID: {
            type: Number,
            required: true
        },
        /** 
         * text color of the list items, should be a named color 
         *  from the app theme or the material colors specification
         * 
        */
        textColor: {
            type: String,
            default: 'white', 
        }
    },
    data: () => ({
        classrooms: null,
    }),
    computed: {

    },
    async created() {
        // console.log(`userID is ${this.userID}`);
        // fetch the classroom data for the user
        this.classrooms = await this.getUsersClassrooms(this.userID);
    },
    methods: {
        /**
         * NOT FULLY FUNCTIONAL
         * Retrieve all classroom data for classes a user
         * is enrolled in.
         * 
         * @todo update this to use the userID to filter the list once the API is implemented
         * 
         * @param {number} userID ID of the user
         * @returns a promise that resolves to a list of the classroom objects
         */
        async getUsersClassrooms(userID) {
            let responseData = await api.fetchClass();
            // console.log(`response data ${JSON.stringify(responseData)}`);

            let classData;
            if (responseData instanceof Array) {
                classData = responseData;
            }

            return Promise.resolve(classData);
        },
    }
})
</script>