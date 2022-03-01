<script setup>
    import { ref } from 'vue'

    defineProps({
        msg: String
    })

    const count = ref(0)
</script>

<template>
    <div>
        <h1>Online</h1>
        <input id='msgbox' type='text'>
        <button @click='sendMessage()'>Send</button>
        <p>{{messages}}</p>
    </div>
</template>

<script defer>
    import io from 'socket.io-client'

    export default {
        data() {
            return {
                user: '',
                message: '',
                messages: [],
                socket : io('localhost:3001')
            }
        },
        methods: {
            sendMessage() {
                var message = document.getElementById('msgbox')
                this.socket.emit('SEND_MESSAGE', {
                    user: this.user,
                    message: message.value
                })

                this.message = ''
            }
        },
        mounted() {
            this.socket.on('MESSAGE', (data) => {
                this.messages = [...this.messages, data]
            })
        }
    }
</script>

<style scoped></style>
