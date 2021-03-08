<template>
  <div class="edit-addr">
    <van-nav-bar
      :title="aid==undefined?'新增地址':'编辑地址'"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <Bg>
      <van-address-edit
        :area-list="addrList"
        show-postal
        show-set-default
        show-search-result
        :address-info = "initList"
        :show-delete = "aid!=undefined"
        detail-maxlength="30"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="deleteAddr"
      />
    </Bg>
  </div>
</template>

<script>
import "../assets/less/editAddr.less";
import Address from "../assets/js/address.json";
import Bg from "../components/Bg.vue";
export default {
  name: "EditAddr",
  data() {
    return {
      addrList: [],
      aid: '',
      initList: {}
    };
  },
  components: {
    Bg,
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    onSave(value) {

      console.log(value)
      console.log(this.initList);
      let isEdit = false;
      for(let key in this.initList){
        if(this.initList[key]!=value[key]){
          isEdit = true;
          break;
        }
      }

      if(isEdit){
        console.log('发起请求')
      }else{
        console.log('未编辑')
        this.$router.go(-1);
      }

      let tokenString = this.$cookie.get("tokenString");
      // 未登录判断
      if (!tokenString) {
        console.log("浏览器tokenString不存在");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
      });
      let data = {
        ...value,
        tokenString,
        appkey: this.appkey,
      };
      delete data.country;
      data.isDefault = Number(data.isDefault);
      if(this.aid==undefined){
        this.axios({
        method: "POST",
        url: this.baseUrl + "/addAddress",
        data
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

          if (res.data.code === 9000) {
            console.log(res)
            //如果添加成功, 跳回地址列表组件
            this.$router.go(-1);
          } 

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });

        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
      }else{
        data.aid = this.aid;
        this.axios({
        method: "POST",
        url: this.baseUrl + "/editAddress",
        data
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
          if (res.data.code === 30000) {
            //如果添加成功, 跳回地址列表组件
            this.$router.go(-1);
          } 

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });

        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
        
      }
    },
    editAddr(){
      this.aid = this.$route.params.aid
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
        method: "GET",
        url: this.baseUrl + "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        },
        }).then((res) => {
          this.$toast.clear();
            // 没有登录
            if(res.data.code == 700){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
              return this.$router.push({ name: "Login" });
            }
            if(res.data.code === 40000){
              let data = res.data.result[0];
              data.isDefault = Boolean(data.isDefault)
              this.initList = data;
            }
            })
            .catch((err) => {
            this.$toast.clear();
            console.log(err);
        });
    },
    deleteAddr(){
      this.aid = this.$route.params.aid
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
        url: this.baseUrl + "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        },
        }).then((res) => {
            this.$toast.clear();
            // 没有登录
            if(res.data.code == 700){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
              return this.$router.push({ name: "Login" });
            }
            if(res.data.code === 10000){
              this.$router.go(-1)
            }
            })
            .catch((err) => {
            this.$toast.clear();
            console.log(err);
        });
    }
  },
  created() {
    this.addrList = Address;
    this.editAddr();
  },
};
</script>