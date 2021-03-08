<template>
  <div class="shopbag">
    <!-- 顶部提示栏 -->
    <van-nav-bar
      title="购物车"
      left-text="返回"
      :right-text="shopCartList.length!=0?editData.text:''"
      left-arrow
      @click-left="backTo"
      @click-right="editPro"
      fixed
    />
    <div class="shopbag-box" v-if="shopCartList.length!=0">
      <div class="adver">
        <img src="../assets/images/advertisement.png" />
      </div>
      <!-- 单个商品 -->
      <div class="pro-items">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          offset="100"
          @load="onLoad"
        >
          <div class="item" v-for="(item, index) in shopCartShow" :key="index">
            <van-swipe-cell :disabled="!editData.isEdit">
              <van-checkbox
                v-model="item.checked"
                label-position="right"
                @click="addTotal(item)"
              ></van-checkbox>
              <van-card class="goods-card" :thumb="item.small_img">
                <template #tags>
                  <div class="tag">
                    <div class="pro-name">
                      <div class="title">
                        <div class="chname">{{ item.name }}</div>
                        <div class="rule">{{ item.rule }}</div>
                      </div>
                      <div class="enname">{{ item.enname }}</div>
                    </div>
                    <div class="price">
                      <div>￥{{ item.price }}</div>
                      <van-stepper
                        v-model="item.count"
                        theme="round"
                        button-size="22"
                        disable-input
                        @plus="addCount(item)"
                        @minus="prevCount(item)"
                      />
                    </div>
                  </div>
                </template>
              </van-card>
              <template #right>
                <van-button
                  square
                  text="删除"
                  type="danger"
                  class="delete-button"
                  @click="removePro(item, index)"
                />
              </template>
            </van-swipe-cell>
          </div>
        </van-list>
      </div>

      <!-- <div class="undeline">我也是有底线的！</div> -->
      <!-- 底部提示栏 -->
      <div class="bottom">
        <van-submit-bar
          v-show="!editData.isEdit"
          :price="totalPrice"
          button-text="提交订单"
          class="submit"
          button-color="#8A2BE2"
          @submit="buyPro"
        >
          <van-checkbox v-model="checked" @click="toggleCheched">全选</van-checkbox>
        </van-submit-bar>
        <van-submit-bar
          v-show="editData.isEdit"
          button-text="删除"
          class="submit"
          button-color="red"
          @submit="removePros"
        >
          <van-checkbox v-model="checked" @click="removeCheched">全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
    <div class="empty" v-else-if="shopCartList.length==0">
      <van-empty description="购物袋没有商品" />
      <div class="shopping">
        <span @click="gotoShopping">快去逛一逛</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import "../assets/less/shopbag.less";
export default {
  name: "Shopbag",
  data() {
    return {

      value: 0,

      shopCartList: [],

      shopCartShow: [],

      checked: false,

      totalPrice: 0,

      editData: {
        isEdit: false,
        text: "编辑",
      },

      finished: false,

      loading: true,

      start: 0,

      count: 7
    };
  },
  created() {
    this.findShopCar();
  },

  methods: {
    ...mapMutations(["changeShopbagCount"]),
    // 返回上一级
    backTo() {
      this.$router.go(-1);
    },
    // 查看购物车里的商品
    findShopCar() {
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
          // 没有登录
          if (res.data.code == 700) {
              this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
              });
              
              return this.$router.push({ name: "Login" });
          }
          if (res.data.code === 5000) {
            if (res.data.result.length != 0) {
              let resultArr = res.data.result;
              console.log(resultArr)
              resultArr.forEach((v) => {
                v.checked = false;
              });
              this.shopCartList = resultArr;
              this.shopCartShow = this.shopCartList.slice(this.start, this.start + this.count);

              this.start += this.count;
              if(this.shopCartList.length < this.count){
                this.finished = true;
                return ;
              }
              this.loading = false;

            }else{
              this.shopCartList = [];
              this.shopCartShow = [];
            }
            // 购物车商品总数量
            this.changeShopbagCount(this.shopCartList.length);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 全选切换
    toggleCheched() {
      let total = 0;

      this.shopCartList.forEach((v) => {
        if (this.checked) {
          // 将全部商品都显示为true
          v.checked = true;
          if (v.checked) {
            // 总价格
            total += v.count * v.price * 100;
          }
        } else {
          v.checked = false;
        }
      });
      this.totalPrice = total;
    },
    // 单个商品价格添加
    addTotal(value) {
      let flag = true;
      // 判断是否全选
      this.shopCartList.forEach((v) => {
        if (!v.checked) {
          flag = false;
          return;
        }
      });

      if (flag) {
        this.checked = true;
      } else {
        this.checked = false;
      }

      if (value.checked) {
        this.totalPrice += value.count * value.price * 100;
      } else {
        this.totalPrice -= value.count * value.price * 100;
      }
    },
    // 添加数量
    addCount(item) {
      // console.log(item);
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
        url: this.baseUrl + "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count + 1,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // console.log(res);
          if (item.checked) {
            this.totalPrice += item.price * 100;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 减少数量
    prevCount(item) {
      // console.log(JSON.stringify(item.sid));
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
        url: this.baseUrl + "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count - 1,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // console.log(res);
          if (item.checked) {
            this.totalPrice -= item.price * 100;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 单个删除商品
    removePro(value, index) {
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
        url: this.baseUrl + "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([value.sid]),
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code === 7000) {
            this.$toast({
              message: "删除商品成功...",
              forbidClick: true,
              duration: 2000,
            });
            console.log(res);
            this.shopCartList.splice(index, 1);
            console.log(this.shopCartList);
            this.setPro();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 重置商品价格及数量
    setPro() {
      let flag = true;
      let setTotal = 0;
      this.shopCartList.forEach((v) => {
        setTotal += v.price * v.count * 100;
        if (!v.checked) {
          flag = false;
          return;
        }
        if (flag) {
          this.totalPrice = setTotal;
          this.checked = true;
        }
      });
    },
    // 编辑/完成商品
    editPro() {
      this.checked = false;
      if (this.editData.isEdit) {
        this.editData.isEdit = false;
        this.editData.text = "编辑";
      } else {
        if (this.shopCartList.length == 0) {
          return;
        }
        this.editData.isEdit = true;
        this.editData.text = "完成";
      }
        this.totalPrice=0;
      this.shopCartList.forEach((v) => {
        v.checked = false;
      });
    },
    // 删除商品
    removePros() {
      // 获取tokenString 值
      let tokenString = this.$cookie.get("tokenString");
      // 未登录判断
      if (!tokenString) {
        console.log("浏览器tokenString不存在");
        return this.$router.push({ name: "Login" });
      }

      let removeData = [];

      this.shopCartList.forEach((v) => {
        if (v.checked) {
          removeData.push(v.sid);
        }
      });
      if(removeData.length == 0){
        return ;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      // 请求数据
      this.axios({
        method: "POST",
        url: this.baseUrl + "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(removeData),
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code === 7000) {
            this.$toast({
              message: "删除商品成功...",
              forbidClick: true,
              duration: 2000,
            });
            if (this.checked) {
              this.editPro();
            }
            this.start = 0;
            this.findShopCar();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 点击删除按钮
    removeCheched() {
      let total = 0;

      this.shopCartList.forEach((v) => {
        if (this.checked) {
          v.checked = true;
        } else {
          v.checked = false;
        }
      });
    },
    // 提交订单
    buyPro() {

      let submitPro = [];

      this.shopCartList.forEach((v) => {
        if (v.checked) {
          submitPro.push(v.sid);
        }
      });
      if(submitPro.length == 0){
        this.$toast({
              message: "请选择提交的商品",
              forbidClick: true,
              duration: 2000,
            });
        return ;
      }

      let submitText = submitPro.join('-')
      console.log(submitText);
      this.$router.push({ name: "Order" ,query:{sids:submitText}});
    },
    // 懒加载数据
    onLoad() {
      setTimeout(() => {

          let data = this.shopCartList.slice(
            this.start,
            this.start + this.count
          );

          // console.log("data ==> ", data);
          this.shopCartShow.push(...data);
          this.start += this.count;

          //如果本次截取不足this.count条数据, 下次不可能有数据
          if (data.length < this.count) {
            this.finished = true;
            return;
          }

          //下次进行触底懒加载
          this.loading = false;
      }, 1000);
    },
    // 逛一逛
    gotoShopping(){
      this.$router.push({name:"Home"})
    }
  },
};
</script>