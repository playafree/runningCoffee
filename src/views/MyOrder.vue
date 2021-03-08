<template>
    <div class="my-order">
        <van-nav-bar
        title="订单详情"
        left-text="返回"
        left-arrow
        @click-left="backTo"
        fixed
        />
        <Bg>
            <div :class="{active:index==0}" @click="index=0">全部</div>
            <div :class="{active:index==1}" @click="index=1">进行中</div>
            <div :class="{active:index==2}" @click="index=2">已完成</div>
        </Bg>
        <div class="order-text"  v-for="(v,i) in orderList" :key="i" v-show="v[0].status==index||index==0">
            <div class="order-id">
                <div class="id">{{v[0].oid}}</div>
                <div class="clear" @click="truePro(v[0].oid)" v-if="v[0].status==1">确认收货</div>
                <div class="finish" v-else-if="v[0].status==2">
                    <div class="clickFin">已完成</div>
                    <van-icon name="delete-o" @click="clearOrder(v[0].oid)" /></div>
            </div>
            <van-card
            :num="item.count"
            :thumb="item.smallImg"
            v-for="(item,index) in v" :key="index"
        >
        <template #tags>
          <div class="tag">
            <div class="pro-name">
              <div class="title">
                <div class="chname">{{item.name}}</div>
                <div class="rule">{{item.rule}}</div>
              </div>
              <div class="enname">{{item.enname}}</div>
            </div>
            <div class="price">￥{{item.price}}</div>
          </div>
        </template>
            </van-card>
            <div class="order-time">
                <div class="time">{{v[0].createdAt| formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
                <div class="total">
                    <div class="total-count">共计{{v|totalCount}}件</div>
                    <div class="total-price">合计￥{{v|totalPrice}}</div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/less/myOrder.less'
    import Bg from '../components/Bg'
    export default {
        name:"MyOrder",
        data(){
            return {
                // 全部列表
                orderList:{},
                index: 0,
                // 购买时间
                bayTime: ''
            }
        },
        components:{
            Bg
        },
        created(){
            this.findOrder();
        },
        methods:{
            backTo(){
                this.$router.go(-1)
            },
            // 获取订单的状态
            findOrder(){
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
                    url: this.baseUrl + "/findOrder",
                    params: {
                    appkey: this.appkey,
                    tokenString,
                    status: 0
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
                        }
                        
                        if(res.data.code === 70000){
                            let list = {}
                            res.data.result.forEach(v=>{
                                // v.createdAt = v.createdAt.replace('T',' ').replace('.000Z','');
                                if(list[v.oid]){
                                    list[v.oid].push(v)
                                }else{
                                    list[v.oid] = []
                                    list[v.oid].push(v)
                                }
                            })
                            this.orderList = list;
                            console.log(this.orderList)
                        }

                    })
                    .catch((err) => {
                    this.$toast.clear();
                    console.log(err);
                    });
            },
            // 确认收货
            truePro(oid){
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
                    url: this.baseUrl + "/receive",
                    data: {
                    appkey: this.appkey,
                    tokenString,
                    oid
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
                        }
                        if(res.data.code === 80000){
                            console.log(res)
                            this.$toast({
                                message: res.data.msg,
                                forbidClick: true,
                                duration: 2000,
                            });
                            this.findOrder();
                        }
                    })
                    .catch((err) => {
                    this.$toast.clear();
                    console.log(err);
                    });
            },
            // 删除订单
            clearOrder(oid){
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
                    url: this.baseUrl + "/removeOrder",
                    data: {
                    appkey: this.appkey,
                    tokenString,
                    oid
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
                        }
                        if(res.data.code === 90000){
                            this.$toast({
                                message: res.data.msg,
                                forbidClick: true,
                                duration: 2000,
                            });
                            this.findOrder();
                        }
                    })
                    .catch((err) => {
                    this.$toast.clear();
                    console.log(err);
                    });
            }
        },
        filters:{
            totalPrice(value){
                let total = 0
                value.forEach(v=>{
                    total+=v.price*v.count;
                })
                return total.toFixed(2);
            },
            totalCount(value){
                let total = 0
                value.forEach(v=>{
                    total+=v.count;
                })
                return total;
            }
        }
    }
</script>