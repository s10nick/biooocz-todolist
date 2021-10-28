<template>
    <v-dialog
        :retain-focus="false"
        v-model="dialog"
        max-width="500px"
    >
        
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-container>
                <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                            v-model="editedItem.title"
                            label="Title"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                            v-model="editedItem.note"
                            label="Note"
                            value="common"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                            v-model="editedItem.description"
                            label="Desription"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-checkbox
                            color="success"
                            v-model="editedItem.status"
                            hide-details
                        ></v-checkbox>
                    </v-col>
                    
                </v-row>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                <v-btn
                color="blue darken-1"
                text
                @click="saveStoreItems"
                >
                Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import { mapMutations } from 'vuex'

    export default {
        data () {
            return {
                formTitle: 'Create Task',
            }
        },
        computed: {
            tasks: {
                get() { return this.$store.state.notes.tasks}
            },
            dialog: {
                get() { return this.$store.state.dialog },
                set(value) { this.toggleDialog() }
            },
            editedItem: {
                get() { return this.$store.state.editedItem},
            },
        },
        methods: {
            ...mapMutations({
                extractDataStorage: 'extractDataStorage',
                toggleDialog:'toggleDialog',
                closeDialog:'closeDialog',
                saveItem:'saveItem',
                setDefault:'setDefault',
            }),
            saveStoreItems() {
                this.saveItem()
                localStorage.todoList = JSON.stringify(this.tasks)
                this.setDefault()
                // this.extractDataStorage()
            },
        }
    }
</script>