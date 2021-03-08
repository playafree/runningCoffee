<template>
    <div class="list">
        <van-nav-bar
        title="订单详情"
        left-text="返回"
        left-arrow
        @click-left="backTo"
        fixed
        >
        
          <template #right>
            <div class="search">
                <van-search class="search-shops" shape='round' v-model="keyword" placeholder="请输入搜索关键词" @input="search" />
            </div>
          </template></van-nav-bar>
        <Bg>
            <CoffeeItem :hotGoods=hotGoods @products='products' />
            <div class="title" v-show="hotGoods.length==0">暂无商品</div>
        </Bg>
    </div>
</template>

<script>
    import '../assets/less/searchlist.less'
    import Bg from '../components/Bg.vue'
    import CoffeeItem from '../components/CoffeeItem.vue'
    export default {
        name: "SearchList",
        components:{
            Bg,
            CoffeeItem
        },
        data(){
            return {
                keyword: '',
                hotGoods:[]
            }
        },
        methods:{
            backTo(){
                this.$router.go(-1);
            },
            search(value){
                console.log(value)
                if(value==''){
                    this.hotGoods = [];
                    return ;
                }
                
                this.axios({
                    method: "GET",
                    url: this.baseUrl + "/search",
                    params: {
                    appkey: this.appkey,
                    name: value
                    },
                })
                    .then((res) => {
                        this.$toast.clear();
                        if(res.data.code == "Q001"){
                            this.hotGoods = res.data.result;
                        }
                        console.log(this.hotGoods)

                    })
                    .catch((err) => {
                    this.$toast.clear();
                    console.log(err);
                    });

            },
            products(pid){
                this.$router.push({path: '/product/'+pid,})
            },
        }
    }
</script>