<template>
    <div class="top-nav">
        <van-nav-bar left-arrow @click-right="goto">
            <template #left>
                <div class="top-logo">
                    <img src="../assets/images/logo.png" alt="" />
                </div>
                <div class="top-title">Running Coffee</div>
            </template>
            <template #right>
                <div class="top-right">先逛一下</div>
            </template>
        </van-nav-bar>
    </div>
</template>

<script>
import '../assets/less/topnav.less'
    export default {
        name: 'TopNav',
        methods:{
            goto(){
                this.$router.push("./home")
            }
        }
    }
</script>
