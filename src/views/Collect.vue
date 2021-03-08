<template>
    <div class="collect">
        <van-nav-bar
        title="收藏列表"
        left-text="返回"
        left-arrow
        @click-left="backTo"
        fixed
        />
        <Bg>
            <ProItem :likeList="likeList" @clearLike="clearLike" v-if="likeList.length!=0" />
            <div class="empty" v-else>
                <van-empty description="没有收藏商品" />
                <div class="shopping">
                    <span @click="gotoShopping">快去逛一逛</span>
                </div>
            </div>
        </Bg>
        
    </div>
</template>

<script>
    import ProItem from '../components/ProItem.vue'
    import '../assets/less/collect.less'
    import Bg from '../components/Bg.vue'
    export default {
        name:"Collect",
        components:{
            Bg,
            ProItem
        },
        data(){
            return {
                likeList: []
            }
        },
        created(){
            this.collectList();
        },
        methods:{
            backTo(){
                this.$router.go(-1)
            },
            collectList(){
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
                    url: this.baseUrl + "/findAllLike",
                    params: {
                        appkey: this.appkey,
                        tokenString,
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
                        if(res.data.code=== 2000){
                            console.log(res)
                            console.log(res.data.result)
                            this.likeList = res.data.result;
                        }

                    })
                    .catch((err) => {
                    this.$toast.clear();
                    console.log(err);
                    });
            },
            // 取消收藏
            clearLike(index){
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
                    pid: this.likeList[index].pid,
                    tokenString
                    },
                }).then((res) => {
                    this.$toast.clear();
                    console.log(res)
                    if(res.data.code === 900){
                        this.likeList.splice(index,1)
                    }
                })
                .catch((err) => {
                    this.$toast.clear();
                    console.log(err);
                });
            },
            gotoShopping(){
                this.$router.push({name:"Home"})
            }
        } 
    }
</script>