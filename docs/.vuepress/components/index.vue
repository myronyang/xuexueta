<template>
  <div class="index-wrap" :style="{height: height + 'px'}">
    <!-- <div class="container">
      <div class="main-wrap">
        <div class="module" v-for="item in articles">
          <router-link class="module-inner" to>
            <div class="title">{{item.title}}</div>
            <div class="desc">{{item.desc}}</div>
            <div class="date">{{item.date}}</div>
          </router-link>
        </div>
      </div>
      <div class="user-wrap">
        <div class="user-inner">
          <div class="avatar">
            <img src="https://avatars3.githubusercontent.com/u/22841563?s=460&v=4">
          </div>
          <div class="user-name">Myron Yang</div>
          <div class="user-desc">Design & Technology</div>
          <div class="user-address">湖北 武汉</div>
          <div class="user-email">yapengg@foxmail.com</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      height: null,
      articles: [
        {
          title: "JavaScript设计模式",
          desc:
            "即按照一种思路或者标准来实现功能，可以由不同设计方案来实现的编程方案。伴随需求的增加，设计的作用才能体现出来。",
          url: "",
          date: "12/18/2019, 10:15:28 PM"
        }
      ]
    };
  },
  mounted () {
    const header = 57;
    this.height = window.innerHeight - header;
    window.addEventListener("resize", function () {
      this.height = window.innerHeight - header;
    });
  }
};
</script>

<style scope lang="stylus">
$accentColor = #753a88; // 主题色
$textColor = #2c3e50; // 文字颜色
$borderColor = #eaecef; // 边框颜色
$codeBgColor = #282c34; // 代码背景颜色

.index-wrap {
  width: 100%;
  background: url('../assets/image/software.jpg');
  background-size: cover;

  .container {
    display: flex;
    width: 1000px;
    margin: 0 auto;
    padding-top: 50px;

    .main-wrap {
      flex: 1;

      .module {
        background: #fff;
        padding: 20px;
        margin-bottom: 25px;
        border-radius: 5px;

        .module-inner {
          .title {
            color: #000;
            font-size: 18px;
          }

          .desc {
            color: #999;
            margin-top: 10px;
            font-weight: 400;
          }

          .date {
            font-size: 12px;
            font-weight: 400;
            color: #888;
            margin-top: 5px;
            text-align: right;
          }
        }
      }
    }

    .user-wrap {
      flex: 0 0 280px;
      margin-left: 50px;
      background: #fff;
      border-radius: 5px;
      text-align: center;

      .user-inner {
        padding: 20px;

        .avatar {
          padding: 0 50px;

          img {
            width: 100%;
            border-radius: 100%;
          }
        }

        .user-name {
          margin-top: 10px;
          font-size: 18px;
        }

        .user-desc {
          margin-top: 5px;
          color: #999;
        }
      }
    }
  }
}
</style>