<template>
    <v-row justify="center" align="center">

        <v-col cols="12" sm="8" md="6">
            <v-data-table
                v-model="selected"
                :headers="headers"
                :items="tasks"
                :items-per-page="5"
                show-select
                item-key="title"
                @item-selected="itemSelected"
                @toggle-select-all="itemSelected"
                class="elevation-1"
            >
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                        >
                            <download-csv
                                :data   = "tasks">
                                Download Data
                            </download-csv>
                        </v-btn>
                        
                        <v-spacer></v-spacer>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <input 
                            type="file"
                            ref="myFile"
                            @change="changeToJSON($event)"
                        />
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
                    </v-toolbar>
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
        </v-col>
    </v-row>
</template>

<script>
    import { mapMutations } from 'vuex'

    export default {
        data () {
            return {
                formTitle: 'Create Task',
                singleSelect: true,
                selected: localStorage.selected ? JSON.parse(localStorage.selected) : [],
                headers: [
                    { text: 'id', value: 'id'},
                    { text: 'Title', value: 'title' },
                    { text: 'Task Description', value: 'description' },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
            }
        },
        computed: {
            tasks: {
                get() { return this.$store.state.tasks},
                set(value) { return }
            },
            editedItem: {
                get() { return this.$store.state.editedItem},
                set(value) { return }
            },
            editedIndex: {
                get() { return this.$store.state.editedIndex},
                set(value) { return }
            },
            dialog: {
                get() { return this.$store.state.dialog },
                set(value) { this.toggleDialog() }
            },
            dialogEdit: {
                get() { return this.$store.state.dialogEdit },
                set(value) { this.toggleDialogEdit() }
            },
            dialogDelete: {
                get() { return this.$store.state.dialogDelete },
                set(value) { this.toggleDialogDelete() }
            }
        },
        methods: {
            ...mapMutations({
                toggleDialog:'toggleDialog',
                toggleDialogEdit:'toggleDialogEdit',
                toggleDialogDelete:'toggleDialogDelete',
                closeDialog:'closeDialog',
                closeDialogEdit:'closeDialogEdit',
                closeDialogDelete:'closeDialogDelete',
                saveItem:'saveItem',
                editItem:'editItem',
                deleteItem:'deleteItem',
                deleteItemConfirm: 'deleteItemConfirm',
                setDefault:'setDefault'
            }),
            saveStoreItems() {
                this.saveItem()
                localStorage.todoList = JSON.stringify(this.tasks)
                this.setDefault()
            },
            deleteStoreItemConfirm (item) {
                this.deleteItemConfirm()
                this.closeDialogDelete()
                localStorage.todoList = JSON.stringify(this.tasks)
                this.setDefault()
            },
            itemSelected () {
                this.$nextTick(() => {
                    localStorage.selected = JSON.stringify(this.selected)  
                }) 
            },
            changeToJSON (e) {
                console.log(e.target.files[0])
                var file = e.target.files[0]
                let reader = new FileReader()
                reader.readAsBinaryString(file)
                reader.onload = evt => {
                    let csv = reader.result
                    csv = csv.replace('ï»¿', '')
                    let lines = csv.split("\r" + "\n")
                    let headers = lines[0].split(",")
                    // console.log(csv.replace('ï»¿', ''))
                    let result = []
                    for(var i=1;i<lines.length;i++){

                        var obj = {};
                        var currentline=lines[i].split(",");

                        for(var j=0;j<headers.length;j++){
                            obj[headers[j]] = currentline[j];
                        }

                        result.push(obj);

                    }
                    this.importCVSData(result)
                }
            },
            importCVSData (data) {
                this.tasks = data
                console.log(JSON.stringify(data))
                localStorage.todoList = JSON.stringify(data) 
            } 
        }
    }
</script>
