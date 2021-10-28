import Vue from "vue";
import Vuex from "vuex";
import { uuid } from 'vue-uuid'
Vue.use(Vuex)

const store = () => {
    return new Vuex.Store({
        state: {
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            notes: {
                tasks: []
            },
            tasks: [],
            editedItem: {
                id: uuid.v1(),
                title: '',
                description: '',
                note: 'common',
                status: false
            },
        },
        mutations: {
            extractDataStorage(state) {
                state.notes.tasks = localStorage.todoList ? JSON.parse(localStorage.todoList) : []
            },
            deleteItemConfirm(state) {
                state.notes.tasks.splice(state.editedIndex, 1)
            },
            toggleDialog(state) {
                state.dialog = !state.dialog
            },
            toggleDialogDelete(state, dialogDelete) {
                state.dialogDelete = !dialogDelete
            },
            closeDialog(state) {
                state.dialog = false
            },
            closeDialogDelete(state) {
                state.dialogDelete = false
            },
            saveItem(state) {
                if (state.editedIndex > -1) {
                    Object.assign(state.notes.tasks[state.editedIndex], state.editedItem)
                } else {
                    state.notes.tasks.push(state.editedItem)
                }
            },
            editItem(state, item) {
                state.editedIndex = state.notes.tasks.indexOf(item)
                state.editedItem = Object.assign({}, item)

                state.dialog = true
            },
            deleteItem(state, item) {
                state.editedIndex = state.notes.tasks.indexOf(item)
                state.editedItem = Object.assign({}, item)
                state.dialogDelete = true
            },
            setDefault(state){
                state.dialog = false
                state.editedItem = {
                    id: uuid.v1(),
                    note: 'common',
                    title: '',
                    description: '',
                    status: false
                }
                state.editedIndex = -1
            }
        }
    })
}

export default store;