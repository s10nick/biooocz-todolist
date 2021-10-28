<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      TODO List
      <v-divider
          class="mx-4"
          inset
          vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-file-input 
          label="Import json"
          type="file"
          ref="myFile"
          @change="importJSON"
          v-model="file"
          accept=".json"
      />
      <v-divider
          class="mx-4"
          inset
          vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          dark
          class="mb-2"
      >
              <vue-blob-json-csv
                  tag-name="div"
                  file-type="json"
                  file-name="sample"
                  title="Download JSON"
                  :data="tasks"
                  confirm="Do you want to download it?"
              />
      </v-btn>
      <v-divider
          class="mx-4"
          inset
          vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="mb-2" 
        dark 
        @click="toggleDialog"
        >+
      </v-btn>
      <Dialog/>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      for 
      <v-btn
        color="primary"
        class="mb-2" 
        link 
        text
        small
        href="https://biooo.cz"
        >biooo.cz
      </v-btn>
       by Vlad Erinenko<span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'default',
  data () {
    return {
      file: null,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
      tasks: {
          get() { return this.$store.state.notes.tasks}
      },
      dialog: {
          get() { return this.$store.state.dialog },
          set(value) { this.toggleDialog() }
      }
  },
  methods: {
    ...mapMutations({
        extractDataStorage: 'extractDataStorage',
        toggleDialog:'toggleDialog'
    }),
    importJSON (file) {
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        localStorage.todoList = reader.result
        console.log(localStorage.todoList)
        this.extractDataStorage()
      }
      
    }
  }
}
</script>
