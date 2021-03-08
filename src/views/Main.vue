<template>
  <div class="home">
    <div>
      <router-view></router-view>
    </div>
    <van-tabbar class="bottomNav" v-model="active" active-color="#8A2BE2" inactive-color="#8a8a8a" route>
        <van-tabbar-item v-for="(item , index) in tabbarNav" :key="index" :to="item.to" :dot="item.dot" :badge="item.badge==0?'':item.badge">
            <template #icon="props">
                <img :src="props.active ? item.icon.active : item.icon.inactive" alt="" />
                <div>{{item.title}}</div>
            </template>
        </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import '../assets/less/main.less'
export default {
  name: 'Main',
  data(){
    return {
      active:0
    }
  },
  computed: {
    ...mapState(['shopbagCount','isLoad']),
      tabbarNav(){
        return [
          {
              title:"主页",
              icon:{
                  active: require('../assets/images/logo_active.png'),
                  inactive: require('../assets/images/logo.png'),
              },
              to: '/home'
          },
          {
              title:"菜单",
              icon:{
                  active: require('../assets/images/menu_active.png'),
                  inactive: require('../assets/images/menu.png'),
              },
              to: '/menu'
          },
          {
              title:"购物车",
              icon:{
                  active: require('../assets/images/shopbag_active.png'),
                  inactive: require('../assets/images/shopbag.png'),
              },
              badge: this.shopbagCount,
              to: '/shopbag'
          },
          {
              title:"我的",
              icon:{
                  active: require('../assets/images/my_logo_active.png'),
                  inactive: require('../assets/images/my_logo.png'),
              },
              dot:true,
              to: '/my'
          },
      ]
      }
  },
  created(){
    this.findShopCar();
  },
  methods:{

    ...mapMutations(['changeShopbagCount','changeIsLoad']),

    // 判断购物车的数量
    findShopCar(){

      // if(this.isLoad){
      //   console.log("已经加载过了")
      //   return ;
      // }

      // 获取tokenString 值
      let tokenString = this.$cookie.get('tokenString');
      // 未登录判断
      // if(!tokenString){
      //   console.log('浏览器tokenString不存在')
      //   return this.$router.push({name: 'Login'});
      // }

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      // 请求数据
      this.axios({
        method: "GET",
        url: this.baseUrl + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
          this.$toast.clear();
        // 没有登录
        // if(res.data.code == 700){
        //   this.$toast({
        //       message: res.data.msg,
        //       forbidClick: true,
        //       duration: 3000,
        //     });
        //     return this.$router.push({ name: "Login" });
        // }
          if(res.data.code === 8000){
            this.changeShopbagCount(res.data.result);
            // this.changeIsLoad();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    }
  }
}
</script>
