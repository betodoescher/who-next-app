<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px">
      <q-chat-message :label="`Você está conectado com ${userConnected.name}`" />

      <q-chat-message
        v-for="message in chatMessages"
        v-bind:key="message.id"
        :name="message.name"
        :avatar="message.avatar"
        :text="message.text"
        :sent="message.sent"
        :stamp="message.stamp"
      />

      <q-footer elevated class="bg-white text-primary">
        <div class="q-pa-md">
          <div class="q-gutter-y-md column" style="max-width: 300px">
            <q-input
              bottom-slots
              v-model="text"
              label="Mensagem"
              counter
              :dense="dense"
            >
              <template v-slot:before></template>

              <template v-slot:append>
                <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
              </template>

              <template v-slot:hint>Digita sua mensagem</template>

              <template v-slot:after>
                <q-btn round dense flat icon="send" @click="sendText" />
              </template>
            </q-input>

            <q-page-sticky position="top-left" :offset="[18, 18]">
                <q-btn fab @click="onBack" icon="keyboard_arrow_left" color="primary" />
            </q-page-sticky>
          </div>
        </div>
      </q-footer>
    </div>
  </div>
</template>
<script>
import ChatService from '../../services/ChatService'
import UserService from '../../services/UserService'
export default {
  name: 'Chat',
  data: function () {
    return {
      dense: true,
      text: '',
      user: {},
      userConnected: {},
      chatMessages: [
        // {
        //   id: 1,
        //   name: 'me',
        //   avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
        //   text: ['hey, how are you?'],
        //   sent: true,
        //   stamp: '4 minutes ago'
        // },
        // {
        //   id: 2,
        //   name: 'Jane',
        //   avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
        //   text: ['doing fine, how r you?', 'asdasd', 'asdasd', 'asdasd'],
        //   sent: false,
        //   stamp: '4 minutes ago'
        // }
      ]
    }
  },
  created () {
    const user = window.localStorage.getItem('user')
    if (!user) {
      this.$router.push({ path: '/login' })
    }
    this.user = JSON.parse(user)

    this.$q.loading.show()
    this.getUsuarioProximo()
    this.$q.loading.hide()
  },
  methods: {
    onBack () {
      this.$router.push({ path: '/chats' })
    },
    async sendText () {
      this.$q.loading.show()

      const vm = this

      ChatService.post({
        _idUserOrigin: this.user._id,
        _idUserDestiny: this.userConnected._id,
        text: this.text
      })
        .then(function (response) {
          if (response.data) {
            vm.chatMessages.push({
              id: response.data._id,
              name: response.data._idUserOrigin === vm.user._id ? vm.user.name : vm.userConnected.name,
              avatar: response.data._idUserOrigin === vm.user._id ? vm.user.avatar : vm.userConnected.avatar,
              text: [response.data.text],
              sent: response.data._idUserOrigin === vm.user._id,
              stamp: response.data.createdAt
            })
          }
        })

      this.$q.loading.hide()
    },
    async getUsuarioProximo () {
      const vm = this

      // Buscando usuário na "proximidade"
      await UserService.locationUser()
        .then(function (response) {
          if (!response.data) {
            vm.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: 'Usuário não encontrado, tente novamente!'
            })

            return false
          }

          vm.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Usuário encontrado'
          })

          vm.userConnected = response.data
        })
    }
  }
}
</script>
