<template>
  <div class="message">
    <van-nav-bar
      title="个人信息"
      left-text="返回"
      left-arrow
      @click-left="backTo"
      fixed
    />
    <Bg>
      <van-cell-group>
        <van-cell center title="头像">
          <template>
            <div class="user-img">
              <img :src="userList.userImg" alt="" />
                <div class="up-img">
                    <van-uploader :max-count="1" :max-size="500 * 1024" :after-read="uploadAvatar" />
                </div>
            </div>
          </template>
        </van-cell>
        <van-cell center title="用户id">
          <template>
            <div class="text">{{userList.userId}}</div>
          </template>
        </van-cell>
        <van-cell center title="昵称" @click="showName=true">
          <template>
            <div class="name">{{userList.nickName}}</div>
          </template>
        </van-cell>
        <van-cell center title="简介" @click="show=true">
          <template>
            <div v-if="userList.desc==''" class="text">这家伙很懒，设么都没有留下！</div>
            <div class="text" v-else>{{userList.desc}}</div>
          </template>
        </van-cell>
      </van-cell-group>
      <van-popup v-model="show" closeable>
          <div class="title">个人简介</div>
          <div class="msg">
              <div class="item1">简介: </div>
              <van-field v-model="text" />
          </div>
          <van-button type="primary" @click="inputText" round>确认</van-button>
      </van-popup>
      <van-popup v-model="showName" closeable>
          <div class="title">昵称</div>
          <div class="msg">
              <div class="item1">新昵称: </div>
              <van-field v-model="nickName" />
          </div>
          <van-button type="primary" @click="changeName" round>确认</van-button>
      </van-popup>
    </Bg>
  </div>
</template>

<script>
import "../assets/less/message.less";
import Bg from "../components/Bg";
export default {
  name: "Message",
  data(){
      return {
          userList: {},
          show: false,
          showName: false,
          text: '',
          nickName: ''
      }
  },
  components: {
    Bg,
  },
  created() {
      this.getUser();
  },
  methods: {
    backTo() {
      this.$router.go(-1);
    },
    // 获取用户信息
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
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
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
    // 修改简介
    inputText(){

      if(this.text==''){
        return this.show=false;
      }
        // console.log(this.text)
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
        method: "POST",
        url: this.baseUrl + "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.text
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
          }
        
        if(res.data.code == "D001"){
          console.log(res);
          this.userList.desc=this.text;
          this.show = false;
        }

        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 修改头像
    uploadAvatar(file) {
    // console.log("file ==> ", file);

    //限制上传文件类型
    let types = ["png", "gif", "jpg", "jpeg"];

    //截取上传图片的类型
    let type = file.file.type.split("/")[1];
    console.log("type ==> ", type);

    if (types.indexOf(type) === -1) {
        return this.$toast({
        message: `文件类型只支持${types.join(",")}`,
        forbidClick: true,
        duration: 3000,
        });
    }

    //处理base64
    let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

    // console.log('base64 ==> ', base64);

    //发起上传图片请求
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
        //请求方式
        method: "POST",
        url: this.baseUrl + "/updateAvatar",
        data: {
        appkey: this.appkey,
        tokenString,
        imgType: type,
        serverBase64Img: base64,
        },
    })
        .then((res) => {
        console.log("res uploadAvatar ==> ", res);
        this.$toast.clear();

        if (res.data.code == 700) {
            this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
            });
            return this.$router.push({ name: "Login" });
        }

        if (res.data.code === "H001") {
            if (res.data.result[0] === 1) {
            this.userList.userImg = res.data.userImg;
            }
        }
        this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
        });
        })
        .catch((err) => {
        this.$toast.clear();
        console.log("err ==> ", err);
        });
    },
    // 修改名称
    changeName(){
    if(this.showName==''){
        return this.showName=false;
      }
        // console.log(this.text)
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
        method: "POST",
        url: this.baseUrl + "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: this.nickName
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
          }
        if(res.data.code == "C001"){
          console.log(res)
          this.userList.nickName=this.nickName;
          this.showName = false;
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