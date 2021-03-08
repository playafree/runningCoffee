import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
// 将px转rem文件
import 'lib-flexible/flexible'
import VueCookie from 'vue-cookie'

import { 
  NavBar,
  Field,
  Button,
  Popup,
  Search,
  Swipe,
  SwipeItem,
  Tabbar,
  TabbarItem,
  Toast ,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Divider,
  Stepper,
  SwipeCell,
  Card,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  AddressList,
  List,
  Empty,
  AddressEdit,
  Cell,
  CellGroup,
  Icon,
  Uploader,
  CountDown


} from 'vant';
Vue
  .use(NavBar)
  .use(Button)
  .use(Popup)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Field)
  .use(Toast)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Divider)
  .use(Stepper)
  .use(SwipeCell)
  .use(Card)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(AddressList)
  .use(List)
  .use(Empty)
  .use(AddressEdit)
  .use(Cell)
  .use(CellGroup)
  .use(Icon)
  .use(Uploader)
  .use(CountDown)

axios.interceptors.request.use(config=>{
  if(config.method === 'post'){
    let params = '';
    // 遍历
    for(let key in config.data){
      params += `${key}=${config.data[key]}&`;
    }
    // 去掉最后的&符号
    config.data = params.slice(0,-1);
  }
  // console.log(config.data)
  return config;

})

// 请求地址和appkey值
Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002';
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//定义全局过滤器
Vue.filter('formatDate', (data, format) => {
  //data: 需要进行格式化的数据
  //format: 格式
  // console.log('data ==> ', data);
  // console.log('format ==> ', format);

  let date = new Date(data);
  // console.log('date ==> ', date);

  //获取年份
  let year = date.getFullYear().toString();
  // console.log('year ==> ', year);

  if (/(y+)/.test(format)) {
    // console.log('有年份');
    //获取匹配组的内容
    let yearContent = RegExp.$1;
    // console.log('yearContent ==> ', yearContent);

    format = format.replace(yearContent, year.slice(year.length - yearContent.length));
  }

  //替换月日时分秒
  let dateObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in dateObject) {
    //生成动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // console.log('reg ==> ', reg);
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // console.log('content ==> ', content);

      format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
    }
  }

  return format;
})

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueCookie)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
