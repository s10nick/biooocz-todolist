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
      <v-btn
        color="primary"
        class="mb-2" 
        dark 
        @click="toggleDialog"
        >new note
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
      dialog: {
          get() { return this.$store.state.dialog },
          set(value) { this.toggleDialog() }
      }
  },
  methods: {
    ...mapMutations({
        toggleDialog:'toggleDialog'
    }),
  }
}
</script>
