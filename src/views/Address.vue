<template>
  <div class="address">
    <van-nav-bar title="地址管理" left-text="返回" left-arrow @click-left="back"/>
    <Bg>
        <van-address-list
        :list="list"
        default-tag-text="默认"
        :switchable="false"
        @add="addAddr"
        @edit="editAddr"
      />
    </Bg>
  </div>
</template>
<script>
import '../assets/less/address.less'
import Bg from "../components/Bg.vue";
export default {
  name: "Address",
  data() {
    return {
      list: [],
      jsonText : []
    };
  },
  components:{
      Bg
  },
  created(){
      this.getAddressListData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    addAddr(){
        this.$router.push({name:"EditAddr"})
    },
    getAddressListData(){
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
        url: this.baseUrl + "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
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
            if(res.data.code === 20000){
                console.log(res)
                // 添加address属性
                res.data.result.forEach(v=>{
                    v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
                    v.isDefault = Boolean(v.isDefault);
                })

                this.list = res.data.result;
                console.log(this.list)

            }
            })
            .catch((err) => {
            this.$toast.clear();
            console.log(err);
        });
    },
    editAddr(index){
        console.log(index.aid)
        this.$router.push("./EditAddr/"+index.aid)
    }
  }
};
</script>