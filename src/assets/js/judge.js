import { Toast } from 'vant';
class Judge {
    judgeFrom(o) {
        for(let key in o){
            if(!o[key].reg.test(o[key].value)){
                console.log(o[key].errorMsg);
                Toast({
                    message: o[key].errorMsg,
                    duration: 2000,
                    forbidClick: true
                });
                return false;
            }
        }
        return true;
    }
}

export const judges = new Judge();