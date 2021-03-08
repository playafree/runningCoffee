<template>
  <div class="order">
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      left-arrow
      @click-left="backTo"
      fixed
    />
    <div class="order-addr">
      <div class="chance-addr" @click="addrShow = true">选择地址 ></div>
      <div class="consignee">
        <div class="username">{{ showAddr.name }}</div>
        <div class="phone">{{showAddr.tel}}</div>
        <div class="default" v-if="showAddr.isDefault">默认</div>
      </div>
      <div class="consigneeAddr">{{ showAddr.address }}</div>
    </div>

    <!-- 订单信息 -->
    <div class="order-msg">
      <van-divider
        :style="{ color: '#8A2BE2', borderColor: '#8A2BE2', padding: '0 16px' }"
        >订单信息</van-divider
      >
      <van-card
        :num="v.count"
        :thumb="v.small_img"
        v-for="(v,i) in showPro" :key="i"
      >
        <template #tags>
          <div class="tag">
            <div class="pro-name">
              <div class="title">
                <div class="chname">{{v.name}}</div>
                <div class="rule">{{v.rule}}</div>
              </div>
              <div class="enname">{{v.enname}}</div>
            </div>
            <div class="price">￥{{v.price}}</div>
          </div>
        </template>
      </van-card>
    </div>

    <van-divider
      :style="{ color: '#8A2BE2', borderColor: '#000', padding: '0 16px' }"
      dashed
    />
    <!-- 时间 -->
    <div class="msg">
      <div class="orderTime">{{bayTime}}</div>
      <div class="orderMsg">
        <div class="totalOrder">共计{{showPro.length}}件</div>
        <div class="totalCount">合计 ￥{{totalPrice}}</div>
      </div>
    </div>

    <van-button round block @click="payPro">立即结算</van-button>
    <van-popup
      v-model="addrShow"
      position="bottom"
      :style="{ height: '30%', paddingBottom: '50px' }"
    >
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="addAddr"
        @edit="editAddr"
        @select="selectAddr"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/order.less";
export default {
  name: "Order",
  data() {
    return {
      addrShow: false,
      chosenAddressId: "",
      list: [],
      showAddr: {},
      sids: [],
      showPro: [],
      totalPrice: '',
      bayTime: ''
    };
  },
  created() {
    this.getAddressListData();
    this.getSid();
  },
  methods: {
    // 返回上一级
    backTo() {
      this.$router.go(-1);
    },
    // 添加地址
    addAddr() {
      this.$router.push({ name: "Address" });
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
        url: this.baseUrl + "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          console.log(res);
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 得到所存地址列表
    getAddressListData() {
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
          if (res.data.code === 20000) {
            // console.log(res)
            // 添加address属性
            res.data.result.forEach((v, i) => {
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
              v.isDefault = Boolean(v.isDefault);
              v.id = `${i + 1}`;
            });
            console.log(res.data.result)
            this.list = res.data.result;
            this.list.forEach((v,i) => {
              if (v.isDefault) {
                this.showAddr = v;
                this.chosenAddressId = String(i+1);
              }
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 修改地址
    editAddr(index) {
      this.$router.push("./EditAddr/" + index.aid);
    },
    // 选择地址
    selectAddr(item) {
      this.chosenAddressId = item.id;
      this.showAddr = item;
    },
    // 得到商品 sid
    getSid() {
      // console.log(this.$route.query.sids.split("-"));
      this.sids = this.$route.query.sids.split("-");

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
        url: this.baseUrl + "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 没有登录
            if(res.data.code == 700){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
            };

            console.log(res)

            if(res.data.code === 50000){
                let price = 0;
                this.showPro = res.data.result;
                this.showPro.forEach(v=>{
                    price += parseFloat(v.price*v.count);
                })
                this.bayTime = this.showPro[0].created_at.replace('T',' ').replace('.000Z','');
                // console.log(typeof this.bayTime)
                this.totalPrice = price.toFixed(2);
            }

        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 结算
    payPro(){
      if(this.showAddr.id==undefined){
        this.addrShow = true;
        return ;
      }
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
        url: this.baseUrl + "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.showAddr.phone,
          address: this.showAddr.address,
          receiver: this.showAddr.name
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 没有登录
            if(res.data.code == 700){
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
            };
            if(res.data.code === 60000){
              this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
              console.log(res)
              this.$router.push({name: "Shopbag"})
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