<template>
    <div>
        <Header />
        <router-view />
        <Footer />
    </div>
</template>

<style>
  @import '../assets/styles/mainAppStyle.css';
</style>

<script>
  import Header from '../components/Header.vue'
  import Footer from '../components/Footer.vue'

  export default {
    components: {
      Header,
      Footer
    },
  }
</script>