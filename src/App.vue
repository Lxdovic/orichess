<script setup>
  import Nav from './components/Nav.vue'
  import Menu from './components/Menu.vue'
  import Footer from './components/Footer.vue'
  import Computer from './components/Computer.vue'
  import Online from './components/Online.vue'

</script>

<template>
  <Nav/>
  <router-view/>
  <Footer/>
</template>

<style>
  * {
    overflow-x: hidden;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track {
    background: #d8d8d8;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    width: 4px;
    height: 4px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgb(160, 160, 160);
  }
</style>
