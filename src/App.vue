<template>
  <div>
    <h1 class="title"> Hello Vue3 App </h1>
    <el-button type="primary">Primary</el-button>
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
import  { ElButton } from "element-plus";
export default {
  name:"App",
  components:{
    ElButton,
  }
}
</script>


<style scoped>
  .title {
    color: pink;
  }
</style>