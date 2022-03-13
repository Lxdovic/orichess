<script setup>
    import { ref } from 'vue'

    defineProps({
        msg: String
    })

    const count = ref(0)
</script>

<template>
    <div v-if='openchat' class='p-6 flex flex-col gap-4'>
        <div class='h-[calc(100vh-18.5rem)]'>
            <div v-for='msg in messages' :key='msg' class='flex flex-col'>
                <span class='font-bold text-left'>{{msg.user}}</span>
                <span class='font-regular text-left break-words'>{{msg.message}}</span>
            </div>
        </div>

        <div class='flex mt-auto gap-4 justify-center'>
            <textarea v-on:keyup.enter="sendMessage()" id='msgbox' autofocus placeholder='Send a message' rows="5" maxlength='1024' class='resize-none h-[3rem] indent-2 outline-none bg-gray-100 w-full'></textarea>
        </div>
    </div>
</template>

<script defer>
    import io from 'socket.io-client'

    export default {
        data() {
            return {
                user: '',
                messages: [],
                openchat: true,
                socket : io('localhost:3001', { transports : ['websocket'] })
            }
        },
        methods: {
            sendMessage() {
                var message = document.getElementById('msgbox')
                
                if (message.value == '') { return }

                this.socket.emit('SEND_MESSAGE', {
                    user: this.user,
                    message: message.value
                })

                message.value = ''
            }
        },
        mounted() {
            this.socket.on('MESSAGE', (data) => {
                this.messages = [...this.messages, data]
            })

            this.socket.on('CREATE_USERNAME', (data) => {
                this.user = 'User' + data
            })
        }
    }
</script>

<style scoped></style>
