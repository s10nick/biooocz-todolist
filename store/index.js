import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex)

const store = () => {
    return new Vuex.Store({
        state: {
            dialogEdit: false,
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            tasks: localStorage.todoList ? JSON.parse(localStorage.todoList) : [],
            editedItem: {
                id: '',
                title: '',
                description: '',
            },
        },
        mutations: {
            deleteItemConfirm(state) {
                state.tasks.splice(state.editedIndex, 1)
            },
            toggleDialog(state, dialog) {
                state.dialog = !dialog
            },
            toggleDialogEdit(state, dialogEdit) {
                state.dialogEdit = !dialogEdit
            },
            toggleDialogDelete(state, dialogDelete) {
                state.dialogDelete = !dialogDelete
            },
            closeDialog(state) {
                state.dialog = false
            },
            closeDialogEdit(state) {
                state.dialogEdit = false
            },
            closeDialogDelete(state) {
                state.dialogDelete = false
            },
            saveItem(state) {
                if (state.editedIndex > -1) {
                    Object.assign(state.tasks[state.editedIndex], state.editedItem)
                } else {
                    state.tasks.push(state.editedItem)
                }
            },
            editItem(state, item) {
                state.editedIndex = state.tasks.indexOf(item)
                state.editedItem = Object.assign({}, item)

                state.dialog = true
            },
            deleteItem(state, item) {
                state.editedIndex = state.tasks.indexOf(item)
                state.editedItem = Object.assign({}, item)
                state.dialogDelete = true
            },
            setDefault(state){
                state.dialog = false
                state.editedItem = {
                    title: '',
                    description: ''
                }
                state.editedIndex = -1
            }
        }
    })
}

export default store;