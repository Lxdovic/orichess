<script setup>
  import { ref } from 'vue'

  defineProps({
    msg: String
  })

  const count = ref(0)
</script>

<template>
  <div class='flex flex-col sm:flex-col md:flex-col lg:flex-row justify-evenly md:px-4 md:gap-4'>

    <!-- PLAY -->
    <div class='bg-stone-100 rounded'>
      
      <!-- OPPONENT -->
      <div class='flex flex-row sm:w-screen w-screen md:w-[48.1rem] p-2 h-16 gap-4'>
        <img class='rounded-full' src='../assets/Player1_pfp.jpg'>
        <div class='text-left'>
          <div class='flex flex-row gap-4'>
            <span class=''>Player1</span>
            <img class='w-6 h-4 mt-1' src='../assets/flags/it.svg'>
          </div>
          <span class='text-xs'>905</span>
        </div>
      </div>

      <!-- BOARD -->
      <div class='sm:w-screen md:w-full lg:w-[48.1rem]' id='myBoard'></div>
      
      <!-- USER -->
      <div class='flex flex-row sm:w-screen w-screen md:w-[48.1rem] p-2 h-16 gap-4'>
        <img class='rounded-full' src='../assets/me.png'>
        <div class='text-left'>
          <div class='flex flex-row gap-4'>
            <span class=''>me</span>
            <img class='w-6 h-4 mt-1' src='../assets/flags/no.svg'>
          </div>
          <span class='text-xs'>911</span>
        </div>
      </div>

    </div>
    
    <!-- INFO -->
    <div class='w-full sm:w-full md:w-full lg:w-[15rem] bg-stone-200 my-10 rounded relative'>
      <div class='bg-[#36B18A] text-white'>
        <h1>Rapid (911)</h1>
      </div>

      <div class='p-3'>
        <h1 class='font-semibold'>PGN</h1>

        <p id='game-pgn' class='bg-white overflow-x-scroll whitespace-pre'>1. f4 e5 2. fxe5 d6 3. exd6 cxd6 4. d4 f5 5. e3 f4 6. e4 f3 7. e5 f2+</p>
        <div id='game-his' class='mt-10 overflow-y-scroll mb-10'></div>
      </div>

      <!-- CONTROLS -->
      <div class='bg-stone-400 bottom-0 absolute w-full h-10 flex gap-4 p-1'>
        <button class='ml-3 transition hover:bg-stone-500 rounded w-10 flex justify-center p-1'><img class='h-5/6' src='../assets/icons/back.png'></button>
        <button class='ml-3 transition hover:bg-stone-500 rounded w-10 flex justify-center p-1'><img class='h-5/6' src='../assets/icons/forward.png'></button>
        <button class='ml-auto mr-3 transition hover:bg-stone-500 rounded w-10 flex justify-center p-1'><img class='h-5/6' src='../assets/icons/comment.png'></button>
      </div>
    </div>

  </div>
</template>


<script defer>
  export default {
    mounted() {
      addScript('https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js')
      addScript('/chess/js/chessboard-1.0.0.js')
    },
  }

  function addScript(src) {
    var script = document.createElement('script')
    script.setAttribute('src', src)
    document.head.appendChild(script)
  }
</script>

<style scoped></style>