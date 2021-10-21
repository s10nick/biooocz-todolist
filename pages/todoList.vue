<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="5"
                show-select
                class="elevation-1"
            >
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>TODO List</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog
                            v-model="dialog"
                            max-width="500px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    New Item
                                </v-btn>
                            </template>
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
                                                v-model="editedItem.description"
                                                label="Desription"
                                            >
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="saveItem"
                                    >
                                    Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text >Cancel</v-btn>
                                <v-btn color="blue darken-1" text >OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ items }">
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
        </v-col>
    </v-row>
</template>

<script>
    export default {
        data () {
            return {
                formTitle: 'Create Task',
                dialog: false,
                dialogDelete: false,
                singleSelect: true,
                selected: [],
                editedItem: {
                    title: '',
                    description: '',
                },
                headers: [
                    { text: 'Title', value: 'title' },
                    { text: 'Task Description', value: 'description' },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                items: JSON.parse(localStorage.todoList)
            }
        },
        methods: {
            saveItem() {
                this.items.push(this.editedItem)
                this.dialog = false
                this.setItems()
            },
            setItems() {
                localStorage.todoList = JSON.stringify(this.items)
            }
        }
    }
</script>
