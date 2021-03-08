<template>
  <div class="save">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      @click-left="backTo"
      fixed
    />
    <Bg>
      <van-cell-group>
        <van-cell title="修改密码" value=">" @click="show = true" />
        <van-cell title="注销账号" value=">" @click="clearshow = true" />
      </van-cell-group>
    </Bg>
    <van-button type="primary" color="#8E2BE2" round block @click="goOut">退出登录</van-button>
    <van-popup v-model="show" closeable position="bottom">
        <div class="title">修改密码</div>
        <van-field v-model="password" label="旧密码" placeholder="请输入密码(6-16位)" :type="textShow?'text':'password'" :right-icon="textShow?'browsing-history-o':'closed-eye'" @click-right-icon="toggleType" />
        <van-field v-model="surepassword" placeholder="请输入密码(6-16位)" :type="sureShow?'text':'password'" label="新密码" :right-icon="sureShow?'browsing-history-o':'closed-eye'" @click-right-icon="sureType" />
        <van-button type="primary" round block @click="changePassWord">提交</van-button>
    </van-popup>
    <van-popup v-model="clearshow">
      <div class="nav">确定注销账号？</div>
      <div class="btn">
        <van-button type="primary" color="#ccc" round @click="clearshow = false">取消</van-button>
        <van-button type="info" round @click="trueClear">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/saveCenter.less";
import Bg from "../components/Bg.vue";
export default {
  name: "Save",
  data() {
    return {
      show: false,
      clearshow: false,
      password: '',
      surepassword: '',
      textShow: false,
      sureShow: false
    };
  },
  components: {
    Bg,
  },
  methods: {
    backTo() {
      this.$router.go(-1);
    },
    // 修改密码
    changePassWord() {

      if(this.surepassword == this.password){
        this.$toast({
            message: "原密码与新密码相同",
            forbidClick: true,
            duration: 3000,
          });
            this.surepassword = '';
            this.password = '';
        return ;
      }
      let tokenString = this.$cookie.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          password: this.surepassword,
          oldPassword: this.password
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 没有登录
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          console.log(res)
          if(res.data.code == "E003"){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            this.surepassword = '';
            this.password = '';
          }

          if(res.data.code == "E001"){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 切换类型
    toggleType(){
      this.textShow = !this.textShow;
    },
    sureType(){
      this.sureShow = !this.sureShow;
    },
    trueClear(){
      let tokenString = this.$cookie.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/destroyAccount",
        data: {
          appkey: this.appkey,
          tokenString
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 没有登录
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
            return this.$router.push({ name: "Login" });
          }

          console.log(res)
          if(res.data.code == "G001"){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
            return this.$router.push({ name: "Login" });
          }

        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    goOut(){
      let tokenString = this.$cookie.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/logout",
        data: {
          appkey: this.appkey,
          tokenString
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 没有登录
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
            return this.$router.push({ name: "Login" });
          }

          console.log(res)
          if(res.data.code == "F001"){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
            return this.$router.push({ name: "Login" });
          }

        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    }
  },
};
</script>