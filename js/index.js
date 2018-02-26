/**
 * Created by Administrator on 2017/4/6 0006.
 */

  function getQuery() {
     var query = window.location.search.substr(1),urlCs=query.split('&'),
         length=urlCs?urlCs.length:0,i=0,data={},equal,
        slice=Array.slice
      if(length == 0){
          return {

          }
      }
      for(;i<length;i++){
          equal=urlCs[i].indexOf("=");
          if(equal == -1){
              continue ;
          }
          data[urlCs[i].substr(0,equal)]=unescape(urlCs[i].substr(equal+1));
      }
       return data
   }
  function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
   }

  // 判断是不是分享

 if(getQueryString('from'))
  window.location.href='http://event.easteat.com/wx/oauth/getauthorizeurlbyjs/1/?scope=snsapi_base&redirectUrl=http%3a%2f%2fevent.easteat.com%2fregister%2fhz.html'



$(function () {
     console.log('start')
    var num=$('#num'),name=$('#name'),tele=$('#tele'),tip=$('.tip-text'),
        reg=/^1\d{10}$/,//电话正则
        k,//循环函数
        loaction=window.location.href,//本页地址
        userMsg;
        domainUrl='http://event.easteat.com',
        apiA=domainUrl+'/register/activityinfo.json',
        apiB=domainUrl+'/register/saveandpay.json',
        apiC=domainUrl+'/wx/pay/payresult.json',
        apiD=domainUrl+'/register/getregisterinfobyopenid.json'
    function Tip(elem,text) {
        elem.text(text).fadeIn().delay(500).fadeOut()
    }

    function payCheck(data) {
        $.ajax({
            url:apiC,
            type:'POST',
            async:true,
            cache:false,
            data:{
                orderId:data.orderId
            },
            // dataType:'json',
            success:function (data) {
                // data=JSON.parse(data)
                if(data.flag&&data.flag === 1){
                    if(data.data.payResult){
                        clearInterval(k)&&Tip(tip,'支付成功')
                        window.location.href=domainUrl+"/register/hz-buy-result.html?openid="+getQueryString('openid')
                    }
                }
                else {
                    clearInterval(k)&&Tip(tip,'支付失败')
                }

            }

        })
    }
 //报名限额
    $.ajax({
        url:apiA,
        type:'POST',
        data:{
            activityEnName: 'ydylmsjldh'
        },
        success:function (data) {
            // data=JSON.parse(data)
            if(data.flag&&data.flag===1){

            }
            else{

            }
        }
    })
 //查看是否购买
    $.ajax({
        url:apiD,
        type:'GET',
        data:{
            activityEnName: 'ydylmsjldh',
            openid: getQueryString('openid')
        },
        success:function (data) {
            // data=JSON.parse(data)
            console.log(data)
            console.log(data.data.list)
           // console.log(data.data.list[0].payResult)
            var flag=false;
            if(data.flag&&data.flag === 1){
                var arrayData=data.data.list?data.data.list:[];
                for(var i = 0;i<arrayData.length;i++){
                    console.log(arrayData[i]['payResult'])
                    flag=arrayData[i]['payResult']===1?true:false;
                    if(flag==true)
                        break
                }
                flag&&$('#old-buy').removeClass('none').on('click',function () {
                    window.location.href='./hz-buy-result.html?openid='+getQueryString('openid')
                })
                flag&&(console.log('成功'))
            }

        }
    })



    //拉起微信 支付
    function onBridgeReady(data){
        console.log("**wxpost**")
        console.log(data)
        console.log("**wxpost**")
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',{
                "appId":data.appId,
                "timeStamp":data.timeStamp,
                "nonceStr":data.nonceStr,
                "package":data.package,
                "signType":data.signType,
                "paySign":data.paySign
            },
            function(res){
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                  //  window.location.href=domainUrl+"/register/hz-buy-result.html?openid="+getQueryString('openid')
                    //轮询服务器数据
                    payCheck(data);
                    k=setInterval(function () {
                        payCheck(data)
                    },2000)
                }
                else
                    alert('订单取消')
            })

     }


    function postWX() {
        var nameV=name.val(),teleV=tele.val(),numV=num.val(),postData=getQuery();
        postData.payNum=numV;
        postData.field0=nameV;
        postData.field1=teleV;
        postData.activityEnName= 'ydylmsjldh';
        console.log("***",postData)
        $.ajax(
            {
                url:apiB,
                async:true,
                cache:false,
                type:'POST',
                data:postData,
                error:function (i,j,k) {
                    Tip(tip,'请重新点击')
                },
                success:function (data) {
                    if(data.flag && data.flag === 1 && data.data){
                         var result=data.data.brandWCPayRequest;
                         console.log(result);

                        if (typeof WeixinJSBridge == "undefined"){
                            if( document.addEventListener ){
                                document.addEventListener('WeixinJSBridgeReady', function () {
                                    onBridgeReady(result);
                                }, false);
                            }else if (document.attachEvent){
                                document.attachEvent('WeixinJSBridgeReady',  function () {
                                    onBridgeReady(result);
                                });
                                document.attachEvent('onWeixinJSBridgeReady',  function () {
                                    onBridgeReady(result);
                                });
                            }
                        }else{
                            onBridgeReady(result);
                        }
                    }
                    else{
                        Tip(tip,'系统异常稍后再试')
                        console.log(data)
                    }


                }
            }
        )

    }

    $("#add").on('click',function () {
        num.val(parseInt(num.val())+1)
    })

    $("#dele").on('click',function () {
        num.val(parseInt((num.val())-1)>1?(num.val())-1:1)
    })

    $('#post').on('click',function () {
        var nameV=name.val(),teleV=tele.val(),numV=num.val();
        if(nameV==''){
            Tip(tip,'姓名不能为空')
            return false
        }
        if(!reg.test(teleV)){
            Tip(tip,'电话号码格式错误')
            return false
        }
        postWX()
    })




})