<template>
    <div class="home">
        <Search />
        <div class="banner-box">
        <van-swipe class="my-swipe" :autoplay="2000" indicator-color="white" @change="onChange">
            <van-swipe-item v-for="v in bannerPic" :key="v.pid" @click="products(v.pid)">
                <img :src="v.bannerImg" />
            </van-swipe-item>
            <template #indicator>
                <div class="custom-indicator">
                    <div v-for="(d,cur) in bannerPic" :key="cur" :class="{active:current==(cur)}"></div>
                </div>
            </template>
        </van-swipe>
        </div>
        <div class="recommend-box">
            <span class="recommend-hot">热卖推荐</span>
        </div>
        <CoffeeItem :hotGoods=hotGoods @products='products' />
    </div>
</template>

<script>
import '../assets/less/home.less'
import Search from '../components/Search.vue'
import CoffeeItem from '../components/CoffeeItem.vue'
    export default {
        data(){
            return {
                appkey:'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
                bannerPic:[],
                hotGoods: [],
                current: 0
            }
        },
        components: {
            Search,
            CoffeeItem
        },
        methods:{
            // 轮播切换
            onChange(index){
                this.current = index;
            },
            // 产品详情
            products(pid){
                this.$router.push({path: '/product/'+pid,})
            },
            // 轮播图片
            bannerData(){
                this.axios({
                method:'GET',
                url:this.baseUrl+'/banner',
                params:{
                    appkey:this.appkey,
                }
                }).then(res=>{
                    this.bannerPic = res.data.result;
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 热门推荐
            hotPorducts(){
                this.axios({
                method:'GET',
                url:this.baseUrl+'/typeProducts',
                params:{
                    appkey:this.appkey,
                    key:'isHot',
                    value: 1
                }
                }).then(res=>{
                    if(res.data.code == 500){
                        this.hotGoods = res.data.result;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        created(){
            this.bannerData();
            this.hotPorducts();
        }
    }
</script>