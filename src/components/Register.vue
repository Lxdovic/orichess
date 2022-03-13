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
            <h1 class='text-xl'>Register</h1>
            <input type='email' id='email' placeholder='email' required class='indent-2 rounded h-8 outline-teal-400'>
            <input type='text' id='name' placeholder='username' required class='indent-2 rounded h-8 outline-teal-400'>
            <input type='password' id='pass' placeholder='password' required class='indent-2 rounded h-8 outline-teal-400'>
            <input type='password' id='pass-confirm' placeholder='confirm password' required class='indent-2 rounded h-8 outline-teal-400'>
            <input type='submit' @click='register()' class='bg-teal-400 rounded h-8 w-1/2 mt-auto ml-auto mr-auto hover:cursor-pointer shadow-2'>
        </form>

        <span>Already registered? <a href='login' class='text-teal-400'>Log in</a></span>
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
            register() {
                var user = {
                    email: document.getElementById('email').value,
                    name: document.getElementById('name').value,
                    pass: document.getElementById('pass').value,
                    pass_confirm: document.getElementById('pass-confirm').value
                }
                
                if (user.pass_confirm != user.pass) return alert('Passwords are not identical')

                this.socket.emit('REGISTER_USER', user)
            }
        },
        mounted() {
            this.socket.on('REGISTER_CONFIRM', () => {
                window.location = '/login'
            })
        }
    }
</script>

<style scoped></style>
