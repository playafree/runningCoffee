<template>
    <div class="pro">
        <div class="item" v-for="(v,i) in likeList" :key="i">
        <div class="pro-img">
            <img :src="v.smallImg" />
        </div>
        <div class="pro-name">
            <div class="chname">{{v.name}}</div>
            <div class="enname">{{v.enname}}</div>
        </div>
        <div class="price">
            <div class="price-con">￥{{v.price}}</div>
            <div class="clear">
                <van-icon name="delete-o" @click="clearLike(i)" />
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import '../assets/less/proItem.less'
    export default {
        name:"ProItem",
        props:[
            "likeList"
        ],
        created(){
            console.log(this.likeList)
        },
        methods:{
            clearLike(index){
                this.$emit("clearLike",index)
            }
        }
    }
</script>