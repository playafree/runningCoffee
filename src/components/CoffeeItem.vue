<template>
    <div class="shops">
        <ul class="goods-list">
            <li v-for="(item,index) in hotGoods" :key="index" @click="$emit('products',item.pid)">
                <div class="goods-pic">
                    <img :src="item.smallImg" />
                    <div class="hot-size" v-if="item.isHot==1">hot</div>
                </div>
                <div class="goods-right">
                    <div class="goods-name">
                        <span class="chname">{{item.name}}</span>
                        <span class="enname">{{item.enname}}</span>
                    </div>
                    <div class="goods-type">
                        <div>{{item.typeDesc}}</div>
                        <div>{{item.type}}</div>
                    </div>
                    <div class="goods-price">￥{{item.price}}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import '../assets/less/coffeeItem.less'
    export default {
        props:['hotGoods']
    }
</script>