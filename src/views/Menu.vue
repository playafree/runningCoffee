<template>
    <div class="menu">
         <van-search class="search-shops" shape='round' v-model="value" placeholder="请输入搜索关键词" />
         <div class="goods-nav">
             <ul>
                 <li v-for="(item,index) in typeData" :key="index" :class='{active:current==index}' @click="tabList(index)" >
                     {{item.typeDesc}}
                 </li>
             </ul>
         </div>
         <div class="goods-list">
             <CoffeeItem :hotGoods=typeList @products='products' />
         </div>
    </div>
</template>

<script>
import '../assets/less/menu.less'
import CoffeeItem from '../components/CoffeeItem.vue'
    export default {
        name: 'Menu',
        components:{
            CoffeeItem
        },
        data(){
            return {
                value:'',
                typeData:[],
                current: 0,
                typeList: []
            }
        },
        methods:{
            sortShops(){
                this.axios({
                method:'GET',
                url:this.baseUrl+'/type',
                params:{
                    appkey:this.appkey
                }
                }).then(res=>{
                    this.typeData = res.data.result;
                    console.log(res.data.result)
                    this.axios({
                        method:'GET',
                        url:this.baseUrl+'/typeProducts',
                        params:{
                            appkey:this.appkey,
                            key: 'type',
                            value: this.typeData[this.current].type
                        }
                    }).then(res=>{
                        console.log('类型==>',res.data.result)
                        this.typeList = res.data.result;
                    }).catch(err=>{
                        console.log(err)
                    })
                }).catch(err=>{
                    console.log(err)
                })
            },
            products(pid){
                this.axios({
                method:'GET',
                url:this.baseUrl+'/productDetail',
                params:{
                    appkey:this.appkey,
                    pid:pid
                }
                }).then(res=>{
                    console.log(res.data.result)
                }).catch(err=>{
                    console.log(err)
                })
            },
            tabList(index){
                this.current = index;
                this.axios({
                    method:'GET',
                    url:this.baseUrl+'/typeProducts',
                    params:{
                        appkey:this.appkey,
                        key: 'type',
                        value: this.typeData[index].type
                    }
                }).then(res=>{
                    this.typeList = res.data.result;
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 产品详情
            products(pid){
                this.$router.push({path: '/product/'+pid,})
            }
        },
        created(){
            this.sortShops();
        }
    }
</script>