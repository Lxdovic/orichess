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
        <div v-for='i in messages' class='bg-stone-100 rounded w-full'>
            <span class='float-left indent-2'>{{ i.user }}:</span>
            <span class='float-left indent-2'>{{ i.message }}</span>
        </div>
    </div>
</template>

<script defer>
    import io from 'socket.io-client'

    export default {
        data() {
            return {
                user: localStorage.getItem('orichess.com.username') || 'user',
                message: '',
                messages: [],
                socket : io('localhost:3000')
            }
        },
        methods: {
            sendMessage() {
                var message_elm = document.getElementById('msgbox')

                if (message_elm.value == '') { return }

                this.socket.emit('SEND_MESSAGE', {
                    user: this.user,
                    message: message_elm.value
                })

                this.message = ''
                message_elm.value = ''
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
