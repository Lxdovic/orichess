<script setup>
  import { ref } from 'vue'

  defineProps({
    msg: String
  })

  const count = ref(0)
</script>

<template>
  <div id='ai-selectwindow' class='h-screen absolute z-10 flex flex-col justify-center w-screen bg-white'>
    <h1 class='mb-10 text-2xl'>Play with the computer</h1>

    <div class="flex justify-center gap-4">
      <div class="mb-3 xl:w-96">
        <select id='ai-select' class="form-select block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
            <option selected>Select difficulty</option>
            <option value="1">Level 1 (300 elo)</option>
            <option value="2">Level 2 (500 elo)</option>
            <option value="3">Level 3 (700 elo)</option>
            <option value="4">Level 4 (900 elo)</option>
            <option value="5">Level 5 (1100 elo)</option>
            <option value="6">Level 6 (1300 elo)</option>
            <option value="7">Level 7 (1500 elo)</option>
            <option value="8">Level 8 (1700 elo)</option>
        </select>
      </div>

      <button id='ai-start' class='h-8 px-3 w-40 bg-gray-200 rounded hover:bg-gray-600 hover:text-white transition-colors'>Start</button>
    </div>
  </div>

  <div id='play-page' class='hidden flex flex-col sm:flex-col md:flex-col lg:flex-row justify-evenly md:px-4 md:gap-4'>

    <!-- PLAY -->
    <div class='bg-stone-100 rounded'>
      
      <!-- OPPONENT -->
      <div class='flex flex-row sm:w-screen w-screen md:w-[48.1rem] p-2 h-16 gap-4'>
        <img class='rounded-full' src='../assets/icons/cpu.png'>
        <div class='text-left'>
          <div class='flex flex-row gap-4'>
            <span class=''>Engine</span>
          </div>
        </div>
      </div>

      <!-- BOARD -->
      <div class='sm:w-screen md:w-full lg:w-[48.1rem]' id='myBoard'></div>
      
      <!-- USER -->
      <div class='flex flex-row sm:w-screen w-screen md:w-[48.1rem] p-2 h-16 gap-4'>
        <img class='rounded-full' src='../assets/icons/me.png'>
        <div class='text-left'>
          <div class='flex flex-row gap-4'>
            <span class=''>User</span>
            <img class='w-6 h-4 mt-1' src='../assets/flags/fr.svg'>
          </div>
          <span class='text-xs'>?</span>
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

        <p id='game-pgn' class='bg-white overflow-x-scroll whitespace-pre'></p>
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