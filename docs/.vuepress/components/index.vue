<template>
  <div class="index-wrap">
    <img :src="imageUrl">
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: require("../assets/image/software.jpg")
    };
  },
  created() {
    // const setImageUrl = () => {
    //   if (window.innerWidth < 520) {
    //     this.imageUrl = require("../assets/image/banner@2x.png");
    //   } else {
    //     this.imageUrl = require("../assets/image/software.jpg");
    //   }
    // };
    // setImageUrl();
    // window.addEventListener("resize", function() {
    //   setImageUrl();
    // });
  }
};
</script>

<style lang="stylus">
.index-wrap {
  width: 100%;
  height: 100%;

  img {
    width: 100%;
  }
}
</style>