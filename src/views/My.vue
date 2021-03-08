<template>
    <div class="my">
        <div class="my-pic">
            <img src="http://www.kangliuyong.com:10002/assets/coffeeshop_userbg53388331223867971611727354961.png" />
            <div class="top-img">
                <van-uploader :max-count="1" :max-size="500 * 1024" :after-read="uploadBg" />
            </div>
            <div class="user-pic">
                <img :src="userList.userImg" />
                <div class="up-img">
                    <van-uploader :max-count="1" :max-size="500 * 1024" :after-read="uploadAvatar" />
                </div>
            </div>
        </div>
        <div class="introduction">
            <div class="username">用户名：<span>{{userList.nickName}}</span></div>
            <div class="text" v-if="userList.desc==''">这个人很懒，什么都没有留下</div>
            <div class="text" v-else>{{userList.desc}}</div>
        </div>
        <van-cell-group>
        <van-cell title="个人资料" value=">" @click="message" />
        <van-cell title="我的订单" value=">" @click="myOrder" />
        <van-cell title="我的收藏" value=">" @click="collect" />
        <van-cell title="地址管理" value=">" @click="address" />
        <van-cell title="安全中心" value=">" @click="saveCenter" />
        </van-cell-group>
    </div>
</template>

<script>
import '../assets/less/my.less'
    export default {
        name: 'My',
        data(){
            return {
                userList: {}
            }
        },
        methods:{
            address(){
                this.$router.push({name:"Address"})
            },
            message(){
                this.$router.push({name:"Message"})
            },
            myOrder(){
                this.$router.push({name:"MyOrder"})
            },
            collect(){
                this.$router.push({name:"Collect"})
            },
            uploadAvatar(file) {
            // console.log("file ==> ", file);

            //限制上传文件类型
            let types = ["png", "gif", "jpg", "jpeg"];

            //截取上传图片的类型
            let type = file.file.type.split("/")[1];
            console.log("type ==> ", type);

            if (types.indexOf(type) === -1) {
                return this.$toast({
                message: `文件类型只支持${types.join(",")}`,
                forbidClick: true,
                duration: 3000,
                });
            }

            //处理base64
            let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

            // console.log('base64 ==> ', base64);

            //发起上传图片请求
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
                //请求方式
                method: "POST",
                url: this.baseUrl + "/updateAvatar",
                data: {
                appkey: this.appkey,
                tokenString,
                imgType: type,
                serverBase64Img: base64,
                },
            })
                .then((res) => {
                console.log("res uploadAvatar ==> ", res);
                this.$toast.clear();

                if (res.data.code == 700) {
                    this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 3000,
                    });
                    return this.$router.push({ name: "Login" });
                }

                if (res.data.code === "H001") {
                    if (res.data.result[0] === 1) {
                    this.userList.userImg = res.data.userImg;
                    }
                }
                this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 3000,
                });
                })
                .catch((err) => {
                this.$toast.clear();
                console.log("err ==> ", err);
                });
            },
            getUser() {
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
                url: this.baseUrl + "/findAccountInfo",
                params: {
                appkey: this.appkey,
                tokenString
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
                    if(res.data.code === "B001"){
                        console.log(res)
                        this.userList = res.data.result[0]
                    }
                })
                .catch((err) => {
                this.$toast.clear();
                console.log(err);
                });
            },
            saveCenter(){
                this.$router.push({name:"SaveCenter"})
            },
            uploadBg(file) {
            console.log("file ==> ", file);

            //限制上传文件类型
            let types = ["png", "gif", "jpg", "jpeg"];

            //截取上传图片的类型
            let type = file.file.type.split("/")[1];
            console.log("type ==> ", type);

            if (types.indexOf(type) === -1) {
                return this.$toast({
                message: `文件类型只支持${types.join(",")}`,
                forbidClick: true,
                duration: 3000,
                });
            }

            //处理base64
            let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

            // console.log('base64 ==> ', base64);

            //发起上传图片请求
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
                //请求方式
                method: "POST",
                url: this.baseUrl + "/updateUserBg",
                data: {
                appkey: this.appkey,
                tokenString,
                imgType: type,
                serverBase64Img: base64,
                },
            })
                .then((res) => {
                console.log("res uploadAvatar ==> ", res);
                this.$toast.clear();

                if (res.data.code == 700) {
                    this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 3000,
                    });
                    return this.$router.push({ name: "Login" });
                }
                    console.log(res)
                if (res.data.code === "I001") {
                    if (res.data.result[0] === 1) {
                    this.userList.BgImg = res.data.userBg;
                    }
                }
                this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 3000,
                });
                })
                .catch((err) => {
                this.$toast.clear();
                console.log("err ==> ", err);
                });
            }
        },
        created(){
              // 获取tokenString 值
            let tokenString = this.$cookie.get("tokenString");
            // 未登录判断
            if (!tokenString) {
                console.log("浏览器tokenString不存在");
                return this.$router.push({ name: "Login" });
            }
            this.getUser();
        }
    }
</script>