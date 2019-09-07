<template>
  <div class="q-pa-md" style="max-width: 350px">

    <q-list bordered separator>

      <q-slide-item @left="onLeft" @right="onRight">
        <template v-slot:left>
          <q-icon name="done" />
        </template>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar2.jpg">
            </q-avatar>
          </q-item-section>
          <q-item-section>Only left action</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <template v-slot:right>
          <q-icon name="alarm" />
        </template>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar3.jpg">
            </q-avatar>
          </q-item-section>
          <q-item-section>Only right action</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg">
            </q-avatar>
          </q-item-section>
          <q-item-section>No actions</q-item-section>
        </q-item>
      </q-slide-item>

    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab @click="onSearch" icon="search" color="primary" />
    </q-page-sticky>
  </div>
</template>
<script>
export default {
  data () {
    return {
      idUserOrigin: null
    }
  },
  created () {
    const user = window.localStorage.getItem('user')
    if (!user) {
      this.$router.push({ path: '/login' })
    }
    this.idUserOrigin = JSON.parse(user)
  },
  methods: {
    onSearch () {
      const vm = this
      vm.$router.push({ path: '/chat' })
    },
    onLeft ({ reset }) {
      this.$q.notify('Left action triggered. Resetting in 1 second.')
      this.finalize(reset)
    },

    onRight ({ reset }) {
      this.$q.notify('Right action triggered. Resetting in 1 second.')
      this.finalize(reset)
    },

    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 1000)
    }
  }

}
</script>
