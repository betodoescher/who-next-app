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
import LocationService from '../../services/LocationService'
import io from 'socket.io-client'
export default {
  name: 'Chat',
  data: function () {
    return {
      dense: true,
      text: '',
      latitude: null,
      longitude: null,
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
    this.user = JSON.parse(user)
    const vm = this

    if (this.$route.params.id) {
      UserService.getUserById(this.$route.params.id).then(function (response) {
        vm.userConnected = response.data
        ChatService.getChats(vm.user._id /* Usuário Origem */, vm.$route.params.id /* Usuário Destino */)
          .then(function (response) {
            vm.openChats = response.data
            if (response.data.length > 0) {
              for (let key in response.data) {
                vm.printMensage(response.data[key])
              }
            }
          })
      })
    } else {
      vm.getLocation()
    }

    const socket = io('http://localhost:3333', {
      query: { user: vm.user._id }
    })

    socket.on('match', dev => {
      vm.printMensage(dev)
    })
  },
  methods: {
    getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      } else {
        return 'Geolocation is not supported by this browser.'
      }
    },
    showPosition (position) {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      const vm = this

      LocationService.post({
        _idUser: this.user._id,
        geometry: [latitude, longitude]
      }).then(function (response) {
        vm.getUsuarioProximo()
      })
    },
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
            vm.printMensage(response.data)
          }
        })

      this.$q.loading.hide()
    },
    printMensage (param) {
      const vm = this

      console.log(param)

      const mensagemEnviada = {
        id: param._id,
        name: param._idUserOrigin === vm.user._id ? vm.user.name : vm.userConnected.name,
        avatar: param._idUserOrigin === vm.user._id ? vm.user.avatar : vm.userConnected.avatar,
        text: [param.text],
        sent: param._idUserOrigin === vm.user._id,
        stamp: param.createdAt
      }

      const ultimaMensagem = vm.chatMessages.slice(-1)

      if (ultimaMensagem.length > 0) {
        if (ultimaMensagem[0].name === mensagemEnviada.name) {
          for (let key in vm.chatMessages) {
            if (vm.chatMessages[key] === ultimaMensagem[0]) {
              vm.chatMessages[key].text.push(param.text)
            }
          }
        } else {
          vm.chatMessages.push(mensagemEnviada)
        }
      } else {
        vm.chatMessages.push(mensagemEnviada)
      }

      this.text = null
    },
    async getUsuarioProximo () {
      const vm = this

      // Buscando usuário na "proximidade"
      await UserService.locationUser(vm.user.user)
        .then(function (response) {
          console.log(response)
          if (response.data.length === 0) {
            vm.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: 'Usuário não encontrado, tente novamente!'
            })

            vm.$router.push({ path: '/chats' })

            return false
          }

          UserService.getUserById(response.data[0]._idUser).then(function (response) {
            vm.userConnected = response.data
          })

          // vm.$q.notify({
          //   color: 'green-4',
          //   textColor: 'white',
          //   icon: 'fas fa-check-circle',
          //   message: 'Usuário encontrado'
          // })
        })
    }
  }
}
</script>
