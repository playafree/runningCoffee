<template>
  <div>
    <TopNav />
    <div class="login" v-if="!findShow">
      <div class="login-title-box">
        <div class="login-title">WELCOME BACK</div>
      </div>
      <div class="login-box">
        <van-field
          v-model="loginInfo.phone"
          label="手机号"
          placeholder="请输入手机号(11位)"
        />
        <van-field
          v-model="loginInfo.password"
          label="密码"
          :type="textShow ? 'text' : 'password'"
          around
          placeholder="请输入密码(6-16位)"
          :right-icon="textShow ? 'browsing-history-o' : 'closed-eye'"
          @click-right-icon="toggleType"
        />
      </div>
      <div class="forget">
        <span class="register" @click="toggleShow()">立即注册</span>
        <span class="forget-password" @click="findShow = true">忘记密码?</span>
      </div>
      <van-button class="login-btn" type="primary" block @click="login"
        >登&nbsp;&nbsp;&nbsp;录</van-button
      >
    </div>

    <div class="find" v-else>
      <div class="login-title-box">
        <div class="login-title">Find Password</div>
      </div>
      <div class="login-box" v-if="!flag">
        <van-field v-model="findIndo.email" label="邮箱" placeholder="邮箱" />
        <div class="msg">
          <van-field
            v-model="findIndo.validCode"
            label="验证码"
            type="text"
            around
            placeholder="验证码(6个字符)"
          >
            <template #button>
              <van-button size="small" @click="sendMsg">
                <van-count-down
                  @finish="send = false"
                  v-if="send"
                  :time="time"
                  pause
                >
                  <template #default="timeData">
                    <span class="block">{{ timeData.seconds }}后重新获取</span>
                  </template>
                </van-count-down>
                <div v-else>发送验证码</div>
              </van-button>
            </template>
          </van-field>
        </div>
      </div>
      <div class="find-box" v-else>
        <van-field
          v-model="findInfo.phone"
          label="手机号"
          placeholder="请输入手机号(11位)"
        />
        <van-field
          v-model="findInfo.password"
          label="密码"
          :type="textShow ? 'text' : 'password'"
          around
          placeholder="请输入密码(6-16位)"
          :right-icon="textShow ? 'browsing-history-o' : 'closed-eye'"
          @click-right-icon="toggleType"
        />
      </div>
      <div class="back">
        <span class="backhome" @click="findShow = false">已有账号，立即登录</span>
      </div>
      <van-button class="login-btn" type="primary" block @click="nextStep" v-show="!flag">下一步</van-button>
      <van-button class="login-btn" type="primary" block @click="sumbit" v-show="flag">提交</van-button>
      <van-button class="login-btn" type="primary" block @click="findShow = false" v-show="flag">返回</van-button>
    </div>

    <van-popup
      class="register-box"
      position="bottom"
      v-model="registerShow"
      closeable
      close-icon="arrow-down"
    >
      <div class="register-title">注册</div>
      <div class="register-box">
        <van-field
          v-model="registerInfo.phone"
          label="手机号"
          placeholder="请输入手机号(11位)"
        />
        <van-field
          v-model="registerInfo.password"
          label="密码"
          :type="textShow ? 'text' : 'password'"
          around
          placeholder="请输入密码(6-16位)"
          :right-icon="textShow ? 'browsing-history-o' : 'closed-eye'"
          @click-right-icon="toggleType"
        />
        <van-field
          v-model="registerInfo.nickName"
          label="昵称"
          placeholder="请输入昵称(1-10位)"
        />
        <van-button class="register-btn" type="primary" block @click="judge()"
          >注&nbsp;&nbsp;&nbsp;册</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/login.less";
import TopNav from "../components/TopNav.vue";
import { judges } from "../assets/js/judge.js";
export default {
  name: "login",
  components: {
    TopNav,
  },
  data() {
    return {
      loginInfo: {
        phone: "",
        password: "",
      },
      registerInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
      // 注册显示隐藏
      registerShow: false,
      // 密码显示
      textShow: false,
      // 找回密码
      findShow: false,
      // 时间
      time: 60 * 1000,
      timeData: {
        seconds: 1,
      },
      send: false,
      findIndo: {
        email: "",
        validCode: "",
      },
      findInfo: {
        phone: "",
        password: ""
      },
      flag: false,
    };
  },
  methods: {
    // 注册显示隐藏
    toggleShow() {
      this.registerShow = true;
    },
    // 切换类型
    toggleType() {
      this.textShow = !this.textShow;
    },
    // 注册
    judge() {
      let o = {
        phone: {
          value: this.registerInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: this.registerInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },
        nickName: {
          value: this.registerInfo.nickName,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合",
        },
      };

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      if (judges.judgeFrom(o)) {
        this.axios({
          method: "POST",
          url: "http://www.kangliuyong.com:10002/register",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            nickName: this.registerInfo.nickName,
            password: this.registerInfo.password,
            phone: this.registerInfo.phone,
          },
        })
          .then((res) => {
            // console.log(res)
            // 清除提示
            this.$toast.clear();
            if (res.data.code == 100) {
              // 完成时显示的提示
              this.$toast.success({
                message: res.data.msg,
                forbidClick: true,
                duration: 2000,
              });
              // 关闭注册页面
              this.registerShow = false;
              // 重置注册信息
              for (let k in this.registerInfo) {
                this.registerInfo[key] = "";
              }
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
    // 登录
    login() {
      let o = {
        phone: {
          value: this.loginInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: this.loginInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },
      };

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      if (judges.judgeFrom(o)) {
        this.axios({
          method: "POST",
          url: this.baseUrl + "/login",
          data: {
            appkey: this.appkey,
            password: this.loginInfo.password,
            phone: this.loginInfo.phone,
          },
        })
          .then((res) => {
            console.log(res);
            this.$toast.clear();
            if (res.data.code == 200) {
              this.$cookie.set("tokenString", res.data.token);
              this.$router.push("./home");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    sendMsg() {
      if (this.send) {
        return;
      }
      this.send = true;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.findIndo.email,
        },
      })
        .then((res) => {
          console.log("res ==> ", res);
          this.$toast.clear();

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 2000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    nextStep() {
      console.log();
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.findIndo.validCode,
        },
      })
        .then((res) => {
          console.log("res ==> ", res);
          this.$toast.clear();
          if (res.data.code == "K003") {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
          }
          if (res.data.code == "K001") {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
            this.flag = true;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    sumbit(){
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/retrievePassword",
        data: {
          appkey: this.appkey,
          phone: this.findInfo.phone,
          password: this.findInfo.password
        },
      })
        .then((res) => {
          console.log("res ==> ", res);
          this.$toast.clear();

          if(res.data.code == "L003"){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
          }
          if(res.data.code == "L001"){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
            this.findShow = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    }
  },
};
</script>
