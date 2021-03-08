<template>
  <div class="product">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="backTo" fixed />
    <img :src="detailData.large_img" alt="" />

    <div class="product-content">
      <div class="product-name">
        <div>
          <div class="chname">{{detailData.name}}</div>
          <div class="enname">{{detailData.enname}}</div>
        </div>
        <div class="price">
          ￥{{detailData.price}}
        </div>
      </div>
      <!-- 适度 -->
      <van-divider :style="{ color: '#8A2BE2', borderColor: '#8A2BE2', fontWeight: 'bold'}">适度</van-divider>
      <div class="product-data">
        <div class="tem" v-for="(item,index) in detailData.rulesData" :key="index">
          <span>{{item.title}}</span>
          <div v-for="(val, p) in item.rule" :key="p" :class="{active:item.currentIndex == p}" @click="selectRule(item,p)">{{val.title}}</div>
        </div>
      </div>
      <!-- 数量 -->
      <van-divider :style="{ color: '#8A2BE2', borderColor: '#8A2BE2', fontWeight: 'bold'}">数量</van-divider>
      <div class="count-box">
        <div class="count">
          选择数量
        </div>
        <van-stepper v-model="value" theme="round" button-size="22" disable-input color="#8A2BE2" />
      </div>
      <!-- 商品信息 -->
      <van-divider :style="{ color: '#8A2BE2', borderColor: '#8A2BE2', fontWeight: 'bold'}">商品信息</van-divider>
      <div class="product-msg">
        <div v-for="(v,i) in detailData.desc" :key="i">{{i+1}}、{{v}}</div>
      </div>
      <van-goods-action>
        <van-goods-action-icon icon="bag" text="购物车" :color="carShow?'#8A2BE2':'#ccc'" :badge="shopbagCount>0?shopbagCount:''" @click="gotoShopCart" />
        <van-goods-action-icon icon="like" @click="likeAndnolike" :text="likeShow?'已收藏':'收藏'" :color="likeShow?'#8A2BE2':'#ccc'" />
        <van-goods-action-button @click="addShopCar"  color="#cd4ce3" text="加入购物车" />
        <van-goods-action-button color="#8A2BE2" text="立即购买" @click="nowPay" />
      </van-goods-action>
    </div>
    <!-- 购买 -->
  </div>
</template>

<script>
import "../assets/less/product.less";
import { mapState, mapMutations } from 'vuex'
export default {
  name: "Product",
  data() {
    return {
      // 商品id
      pid: "",
      // 是否收藏
      likeShow: false,
      // 是否加入购物车
      carShow: false,
      // 商品内容
      detailData: [],
      // 购物车数量
      carCount: 0,
      value: 0
    };
  },
  created() {
    this.pid = this.$route.params.pid;
    console.log(this.pid)
    this.products();
    this.findlike();
    this.findShopCar();
  },
  computed:{
    ...mapState(['shopbagCount','isLoad']),
  },
  methods: {
    
    ...mapMutations(['changeShopbagCount','changeIsLoad']),
    // 商品内容
    products() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if(res.data.code === 600){

            let data = res.data.result[0];

            let rules = ['cream', 'tem', 'sugar', 'milk'];

            data.rulesData = [];

            rules.forEach(v=>{
              if(!data[v]){
                return ;
              }
              // 接收商品详情
              let rulesText = data[v].split('/');

              let currentRule = {
                title: data[v + '_desc'],
                currentIndex: 0,
                rule: []
              };

              rulesText.forEach(item => {
                let o = {
                  title: item
                }
                currentRule.rule.push(o);
              })

              data.rulesData.push(currentRule);

            })

            data.desc = data.desc.split(/\n/);

            this.detailData = data;

          }else{
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            })
          }

        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 返回上一级
    backTo() {
      this.$router.go(-1);
    },
    // 收藏商品
    showCollect(){
      // 获取tokenString 值
      let tokenString = this.$cookie.get('tokenString');
      // 未登录判断
      if(!tokenString){
        console.log('浏览器tokenString不存在')
        return this.$router.push({name: 'Login'});
      }

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      // 请求数据
      this.axios({
        method: "POST",
        url: this.baseUrl + "/like",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        },
      }).then((res) => {
          this.$toast.clear();

          if(res.data.code == 700){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000
            });
            return this.$router.push({name: 'Login'});
          }
          if(res.data.code === 800){
            this.likeShow = true;
            console.log(res)
          }else{
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 取消收藏
    noshowCollect(){
      // 获取tokenString 值
      let tokenString = this.$cookie.get('tokenString');
      // 未登录判断
      if(tokenString==undefined){
        this.$toast({
          message: '请先登录...',
          forbidClick: true,
          duration: 2000
        });
        this.$router.push({name: 'Login'})
        return false;
      }

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      // 请求数据
      this.axios({
        method: "POST",
        url: this.baseUrl + "/notlike",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        },
      }).then((res) => {
          this.$toast.clear();
          console.log(res)
          if(res.data.code === 900){
            if(res.data.result === 1){
              // 取消收藏
              this.likeShow = false;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });

    },
    // 查询是否被收藏
    findlike(){
       // 获取tokenString 值
      let tokenString = this.$cookie.get('tokenString');
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      // 请求数据
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        },
      }).then((res) => {
          this.$toast.clear();
          if(res.data.code == 700){
            return ;
          }
          if(res.data.code === 1000){
            if(res.data.result.length > 0){
              this.likeShow = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 切换收藏状态
    likeAndnolike(){
        if(this.likeShow){
          this.noshowCollect();
        }else{
          this.showCollect();
        }
    },
    selectRule(item,index){
      if(item.currentIndex === index){
        return;
      }
      item.currentIndex = index;
    },
    // 加入购物车
    addShopCar(){
      let data = this.detailData.rulesData;
      let rulesArr = []
      data.forEach(v=>{
        rulesArr.push(v.rule[v.currentIndex].title)
      })

      let rule = rulesArr.join('/');

      // 获取tokenString 值
      let tokenString = this.$cookie.get('tokenString');
      // 未登录判断
      if(!tokenString){
        console.log('浏览器tokenString不存在')
        return this.$router.push({name: 'Login'});
      }

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      // 请求数据
      this.axios({
        method: "POST",
        url: this.baseUrl + "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
          count: this.value,
          rule
        },
      }).then((res) => {
          this.$toast.clear();
          if(res.data.code == 3000){
            this.carShow = true;
            this.$toast({
              message: '加入购物车成功',
              forbidClick: true,
              duration: 2000
            });
            this.findShopCar();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 跳转到购物车
    gotoShopCart(){
      this.$router.push({name: 'Shopbag'})
    },
    // 判断购物车的数量
    findShopCar(){
      // 获取tokenString 值
      let tokenString = this.$cookie.get('tokenString');
      // 未登录判断
      if(!tokenString){
        console.log('浏览器tokenString不存在')
        return this.$router.push({name: 'Login'});
      }

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
        if(res.data.code == 700){
          return;
        }
          if(res.data.code === 8000){
            this.changeShopbagCount(res.data.result);
            if(this.shopbagCount!=0){
              this.carShow = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 立即购买
    nowPay(){
      console.log(this.detailData.pid)
      this.addShopCar();
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
        url: this.baseUrl + "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code === 5000) {
            let sid = 0;
            if (res.data.result.length != 0) {
              let resultArr = res.data.result;
              resultArr.forEach((v) => {
                if(v.pid == this.detailData.pid){
                  sid = v.sid;
                }
              });
              this.$router.push({ name: "Order" ,query:{sids:sid}});
            }
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