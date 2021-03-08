<template>
    <div class="search-box">
      <van-nav-bar>
          <template #left>
              <div class="now-time" v-show="show">你好</div>
              <div class="username one-text" v-show="show">{{userList.nickName}}</div>
              <div class="logins" @click="goLogin" v-show="!show">立即登录</div>
          </template>
          <template #right>
            <div class="search" @click="search">
                <!-- <van-search class="search-shops" shape='round' v-model="keyword" placeholder="请输入搜索关键词" @input="search" /> -->
                搜索
            </div>
          </template>
      </van-nav-bar>
    </div>
</template>

<script>
import '../assets/less/search.less'
export default {
  name: "Search",
  data(){
      return {
          keyword:'',
          show: false,
          userList:{}
      }
  },
  created(){
    let tokenString = this.$cookie.get("tokenString");
      if (!tokenString) {
          console.log("浏览器token不存在");
          this.show = false;
      }else{
        this.getUser();
      }
  },
  methods:{
    goLogin(){
      this.$router.push({name:"Login"})
    },
    getUser() {
    // 获取tokenString 值
    let tokenString = this.$cookie.get("tokenString");
    // 未登录判断
    if (!tokenString) {
        console.log("浏览器tokenString不存在");
        return this.$router.push({ name: "Login" });
    }
    this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
    });
    // 请求数据
    this.axios({
        method: "GET",
        url: this.baseUrl + "/findAccountInfo",
        params: {
        appkey: this.appkey,
        tokenString
        },
    })
        .then((res) => {
        this.$toast.clear();
        // 没有登录
        if (res.data.code != 700) {
            this.show = true;
        }
            if(res.data.code === "B001"){
                console.log(res)
                this.userList = res.data.result[0]
            }
        })
        .catch((err) => {
        this.$toast.clear();
        console.log(err);
        });
    },
    search(){
        this.$router.push({name:"SearchList"})
    }
  }
};
</script>