<template>
  <div class="q-pa-md" style="max-width: 350px">

    <q-list bordered separator>

      <q-item v-for="chat in openChats" v-bind:key="chat.id"  clickable v-ripple  @click="openChat(chat)">
        <q-item-section avatar>
          <q-avatar>
            <img :src="chat.avatar">
          </q-avatar>
        </q-item-section>
        <q-item-section>{{chat.name}}</q-item-section>
      </q-item>

    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab @click="onSearch" icon="search" color="primary" />
    </q-page-sticky>
  </div>
</template>
<script>
import ChatService from '../../services/ChatService'
export default {
  data () {
    return {
      idUserOrigin: null,
      openChats: []
    }
  },
  created () {
    const user = window.localStorage.getItem('user')
    this.idUserOrigin = JSON.parse(user)

    this.getChats(this.idUserOrigin._id)
  },
  methods: {
    openDialog () {

    },
    onSearch (user) {
      if (user._id) {
        this.$router.push({ path: '/chat/' + user._id })
      } else {
        this.$router.push({ path: '/chat' })
      }
    },
    async getChats (id) {
      const vm = this
      await ChatService.getChatsUsers(id)
        .then(function (response) {
          vm.openChats = response.data
        })
    },
    openChat (user) {
      this.onSearch(user)
    }
  },
  filters: {
    timeSince: function (date) {
      var seconds = Math.floor((new Date() - date) / 1000)

      var interval = Math.floor(seconds / 31536000)

      if (interval > 1) {
        return interval + ' years'
      }
      interval = Math.floor(seconds / 2592000)
      if (interval > 1) {
        return interval + ' months'
      }
      interval = Math.floor(seconds / 86400)
      if (interval > 1) {
        return interval + ' days'
      }
      interval = Math.floor(seconds / 3600)
      if (interval > 1) {
        return interval + ' hours'
      }
      interval = Math.floor(seconds / 60)
      if (interval > 1) {
        return interval + ' minutes'
      }
      return Math.floor(seconds) + ' seconds'
    }
  }

}
</script>
