<template>
  <div>
    <h1 class="title"> Hello Vue3 App </h1>
    <ul>
      <li>
        <router-link to="/Home">Home</router-link>
      </li>
      <li>
        <router-link to="/About">About</router-link>
      </li>
    </ul>
    <router-view />
  </div>

</template>


<script>
export default {
  name:"App"
}
</script>


<style scoped>
  .title {
    color: pink;
  }
</style>