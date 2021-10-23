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
                        <v-toolbar-title>TODO List</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
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
                                    <v-btn color="blue darken-1" text @click="closeEdit">Cancel</v-btn>
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
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
                    @click="editItem(item, id)"
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
import JsonCSV from 'vue-json-csv'
    export default {
        data () {
            return {
                formTitle: 'Create Task',
                dialogEdit: false,
                dialog: false,
                dialogDelete: false,
                singleSelect: true,
                selected: localStorage.selected ? JSON.parse(localStorage.selected) : [],
                editedIndex: -1,
                editedItem: {
                    title: '',
                    description: '',
                },
                defaultItem: {
                    title: '',
                    description: '',
                },
                headers: [
                    { text: 'Title', value: 'title' },
                    { text: 'Task Description', value: 'description' },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                tasks: localStorage.todoList ? JSON.parse(localStorage.todoList) : []
            }
        },
        computed: {
            csvData() {
                return this.tasks.map(item => ({
                    title: item.title,
                    description: item.description
                }));
            }
        },
        methods: {
            saveItem() {
                if (this.editedIndex > -1) {
                    Object.assign(this.tasks[this.editedIndex], this.editedItem)
                } else {
                    this.tasks.push(this.editedItem)
                }
                this.dialog = false
                this.setItems()  
            },
            setItems() {
                localStorage.todoList = JSON.stringify(this.tasks)
                this.editedItem = {
                    title: '',
                    description: ''
                }
                this.editedIndex = -1
            },
            editItem (item) {
                this.$nextTick(() => {
                    this.editedIndex = this.tasks.indexOf(item)
                    this.editedItem = Object.assign({}, item)
                })
                this.dialog = true
            },
            deleteItem (item) {
                this.editedIndex = this.tasks.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm (item) {
                this.tasks.splice(this.editedIndex, 1)
                this.closeDelete()
                this.setItems()
            },
            closeDelete () {
                this.dialogDelete = false
            },
            closeEdit () {
                this.dialog = false
            },
            itemSelected () {
                this.$nextTick(() => {
                    localStorage.selected = JSON.stringify(this.selected)  
                }) 
            },
            csvExport(arrData) {
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += [
                    Object.keys(arrData[0]).join(";"),
                    ...arrData.map(item => Object.values(item).join(";"))
                ]
                    .join("\n")
                    .replace(/(^\[)|(\]$)/gm, "");

                const data = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", data);
                link.setAttribute("download", "export.csv");
                link.click();
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
                    
                    //return result; //JavaScript object
                    // console.log(JSON.stringify(result)); //JSON
                }

                // var lines=file.toString().split("\n");

                // var result = [];

                // var headers=lines[0].split(",");
                // console.log(reader)
                // for(var i=1;i<lines.length;i++){

                //     var obj = {};
                //     var currentline=lines[i].split(",");

                //     for(var j=0;j<headers.length;j++){
                //         obj[headers[j]] = currentline[j];
                //     }

                //     result.push(obj);

                // }
                
                //return result; //JavaScript object
                // console.log(JSON.stringify(result)); //JSON
                // this.importCVSData(result)
            },
            importCVSData (data) {
                this.tasks = data
                console.log(JSON.stringify(data))
                localStorage.todoList = JSON.stringify(data) 
            } 
        }
    }
</script>
