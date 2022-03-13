<script setup>
    import { ref } from 'vue'

    defineProps({
        msg: String
    })

    const count = ref(0)
</script>

<template>
    <div class='p-6 flex flex-col gap-10'>
        <form class='flex flex-col m-auto w-96 h-[35rem] rounded bg-gray-100 gap-6 px-8 py-4' onsubmit="return false">
            <h1 class='text-xl'>Login</h1>
            <input type='email' id='email' placeholder='email' required class='indent-2 rounded h-8 outline-teal-400'>
            <input type='password' id='pass' placeholder='password' required class='indent-2 rounded h-8 outline-teal-400'>
            <input type='submit' @click='login()' class='bg-teal-400 rounded h-8 w-1/2 mt-auto ml-auto mr-auto hover:cursor-pointer shadow-2'>
        </form>

        <span>You do not have an account yet? <a href='register' class='text-teal-400'>Register</a></span>
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
            login() {
                var user = {
                    email: document.getElementById('email').value,
                    pass: document.getElementById('pass').value,
                }

                this.socket.emit('LOGIN_USER', user)
            }
        },
        mounted() {

        }
    }
</script>

<style scoped></style>
