<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="username"
        label="Your username *"
        hint="Name and surname"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <div>
        <q-btn label="Enter" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      username: null,
      accept: false
    }
  },

  methods: {
    onSubmit () {
      const vm = this
      axios.post('http://localhost:3333/users', {
        username: this.username
      })
        .then(function (response) {
          if (response.data) {
            window.localStorage.setItem('user', JSON.stringify(response.data))
            vm.$router.push({ path: '/chats' })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    onReset () {
      this.name = null
      this.accept = false
    }
  }
}
</script>
