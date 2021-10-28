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
                    <span class="font-weight-bold">
                        {{props.group }}
                    </span>
                </template>
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
                perPage: 10,
                formTitle: 'Create Task',
                headers: [
                    { text: 'Note', value: 'note', sortable: false },
                    { text: 'Title', value: 'title', sortable: false },
                    { text: 'Task Description', value: 'description', sortable: false },
                    { text: 'Complitied', value: 'status', sortable: false },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
            }
        },
        computed: {
            tasks: {
                get() { return this.$store.state.notes.tasks}
            },
            editedItem: {
                get() { return this.$store.state.editedItem},
                set(value) { return this.$store.state.editedItem = value}
            },
            editedIndex: {
                get() { return this.$store.state.editedIndex}
            },
            dialog: {
                get() { return this.$store.state.dialog },
                set(value) { this.toggleDialog() }
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
                extractDataStorage: 'extractDataStorage',
                toggleDialog:'toggleDialog',
                toggleDialogDelete:'toggleDialogDelete',
                closeDialog:'closeDialog',
                closeDialogDelete:'closeDialogDelete',
                saveItem:'saveItem',
                editItem:'editItem',
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
