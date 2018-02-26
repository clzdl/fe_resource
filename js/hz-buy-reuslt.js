/**
 * Created by Administrator on 2017/4/10 0010.
 */
    var domainUrl='http://event.easteat.com',
    apiA=domainUrl+'/register/getqrcodeinfobyopenid.json';
    //轮播二维码

    $(function () {
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
        $('.back-his').on('click',function () {
            history.go(-1)
        })
        $.ajax({
            url:apiA,
            type:'GET',
            data:{
                activityEnName: 'ydylmsjldh',
                openid: getQueryString('openid')
            },
            success:function (data) {
                if(data.flag&&data.flag === 1){
                    if(data.data&&data.data.list.length> 0){
                        var result=data.data.list,length=data.data.list.length;
                        console.log(length)
                        var str='<div class="swiper-container">'
                                  +'<div class="swiper-wrapper">';
                        for(var i=0;i<length;i++){
                            str+='<div class="swiper-slide">'
                                +'<img class="bg" src="http://s.easteat.com/img/hz-buy-result-backg.jpg" alt="背景">'
                                +'<img  class="qrcode" src="'+domainUrl+'/register/qrcode?code='+result[i].qrCode+'" alt="二维码">'
                                +'</div>'
                         }
                       str+= '</div>'
                        +'<div class="swiper-button-prev"></div>'
                        +'<div class="swiper-button-next"></div>'
                        +'<div class="swiper-pagination" ></div>'
                        +'</div>'
                        $('.container').append(str);
                        $(".load").addClass('load-hide')
                          //配置
                        var mySwiper = new Swiper('.swiper-container', {
                            direction:"horizontal",
                            prevButton:'.swiper-button-prev',
                            nextButton:'.swiper-button-next',
                            pagination: '.swiper-pagination',
                            paginationType : 'fraction',
                            paginationFractionRender: function (swiper, currentClassName, totalClassName) {
                                return '<span class="' + currentClassName + '"></span>' +
                                    ' / ' +
                                    '<span class="' + totalClassName + '"></span>';
                            }
                        })
                    }
                    else {
                        window.location.href='http://event.easteat.com/wx/oauth/getauthorizeurlbyjs/1/?scope=snsapi_base&redirectUrl=http%3a%2f%2fevent.easteat.com%2fregister%2fhz.html'
                    }

                }
                else {
                    window.location.href='http://event.easteat.com/wx/oauth/getauthorizeurlbyjs/1/?scope=snsapi_base&redirectUrl=http%3a%2f%2fevent.easteat.com%2fregister%2fhz.html'
                }

            },
            error:function () {
                window.location.href='http://event.easteat.com/wx/oauth/getauthorizeurlbyjs/1/?scope=snsapi_base&redirectUrl=http%3a%2f%2fevent.easteat.com%2fregister%2fhz.html'

            }
        })


    })
