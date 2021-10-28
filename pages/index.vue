<template>
    <v-row justify="center" align="center">

        <v-col cols="12" sm="8" md="6">
            <v-data-table
                :headers="headers"
                :items="tasks"
                :items-per-page="perPage"
                group-by="note"
                class="elevation-1"
            >
                <template v-slot:header.data-table-select> </template>
                <template v-slot:group.header="props">
                    <span class="font-weight-bold m-2 pl-2">
                        Note: {{props.group }}
                    </span>
                </template>
                <template v-slot:item.actions="{ item, id }">
                    <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                    >
                    mdi-pencil
                    </v-icon>
                    <v-icon
                    small
                    @click="deleteItem(item)"
                    >
                    mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
            <Dialog/>
            <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialogDelete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteStoreItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script>
    import { mapMutations } from 'vuex'

    export default {
        data () {
            return {
                perPage: 10,
                formTitle: 'Create Task',
                headers: [
                    { text: 'Note', value: 'note', sortable: false },
                    { text: 'Title', value: 'title', sortable: false },
                    { text: 'Task Description', value: 'description', sortable: false },
                    { text: 'Completed', value: 'status', sortable: false },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
            }
        },
        computed: {
            tasks: {
                get() { return this.$store.state.notes.tasks}
            },
            dialogDelete: {
                get() { return this.$store.state.dialogDelete },
                set(value) { this.toggleDialogDelete() }
            }
        },
        beforeMount() {
            this.extractDataStorage()
        },
        methods: {
            ...mapMutations({
                extractDataStorage: 'extractDataStorage',
                toggleDialogDelete:'toggleDialogDelete',
                closeDialogDelete:'closeDialogDelete',
                deleteItem:'deleteItem',
                deleteItemConfirm: 'deleteItemConfirm',
                setDefault:'setDefault'
            }),
            deleteStoreItemConfirm (item) {
                this.deleteItemConfirm()
                this.closeDialogDelete()
                localStorage.todoList = JSON.stringify(this.tasks)
                this.setDefault()
                this.extractDataStorage()
            }
        }
    }
</script>
