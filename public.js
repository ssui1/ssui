(function () {
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    } else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);

    var count = 0,
        timer = null;
    var oldTop = newTop = $(window).scrollTop();

    function log() {
        if (timer) clearTimeout(timer);
        newTop = $(window).scrollTop();
        console.log(++count, oldTop, newTop);
        if (newTop === oldTop) {//页面停止做的操作
            $("a").removeAttr("onclick");
            clearTimeout(timer);
        } else {
            oldTop = newTop;
            timer = setTimeout(log, 100);
            $("a").attr("onclick", "return false"); //页面还在滚动中的操作
        }
    }
    $(window).on('touchmove', log);
})();
var config = {
    api: {
        comment: 'http://www.nxecw.com/index/api/comment.html',
        login_out: 'http://www.nxecw.com/index/api/login_out.html',
        check_login: "http://www.nxecw.com/index/api/check_login.html",
        login: "http://www.nxecw.com/index/api/login.html",
        register: "http://www.nxecw.com/index/api/register.html",
        activate: "http://www.nxecw.com/user/activate.html",
        index_page: "http://www.nxecw.com/index/api/today_list_index_page.html",
        online_rank: "http://www.nxecw.com/index/api/tr_time_list.html",
        thumbs_up: "http://www.nxecw.com/index/api/thumbs_up.html",
        trim: "http://www.nxecw.com/index/user/trim.html",
        upload: 'http://www.nxecw.com/index/user/upload.html',
        comment_data: "http://www.nxecw.com/index/api/comment_data.html?aid=",
        my_user_list: 'http://www.nxecw.com/index/mapi/user_list_page.html',
        my_comment_list: 'http://www.nxecw.com/index/mapi/user_pl_page.html',
        send_code: 'http://www.nxecw.com/index/api/sendmsg/',
        ck_phone_msg: 'http://www.nxecw.com/index/api/ck_code_msg/',
        unbind_phone: 'http://www.nxecw.com/index/user/unbind/',
        bind_phone: 'http://www.nxecw.com/index/user/bind/',
        complete_info: "http://www.nxecw.com/index/user/w_info.html",
        qqnick: "http://www.nxecw.com/index/mapi/qqnick.html",
        safe: "http://www.nxecw.com/index/user/safe.html",
    }
};

/* 监听页面切换 */
$(document).on("pageInit", function (e, pageId, $page) {
    public_fun(pageId);
    /*搜索框回车*/
    $("#search").keyup(function (e) {
        if (e.keyCode === 13) {
            $(".searchbar-cancel").click();
            location = ("http://www.nxecw.com/search?keyword=" + $(this).val());
        }
    });
    if (pageId === "index") {
        /*重置首页幻灯片*/
        $.reinitSwiper("#" + pageId, true);
        /*首页导航栏目宽度适应*/
        navWidthAuto();

        function navWidthAuto() {
            var nav_width = 15;
            $.each($('.index-list-nav li'), function (index, item) {
                nav_width = nav_width + (parseInt($(item).width()) + parseInt($(item).css("margin-right")));
            });
            $(".index-list-nav div").width(nav_width);

            nav_width = 15;
            $.each($('.tg_new_ul li'), function (index, item) {
                nav_width = nav_width + (parseInt($(item).width()) + parseInt($(item).css("margin-right")));
            });
            $(".tg_new_ul").width(nav_width);
        }

        $(window).resize(function () {
            navWidthAuto();
        });

        /*首页顶部导航栏目滚动*/
        $.get("http://www.nxecw.com/template/layres/mobile/js/iscroll.js", function (e) {
            var script = document.createElement("script");
            script.innerHTML = e;
            $("#" + pageId).append(script);

            function iScrollClick() {
                if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
                if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
                if (/Silk/i.test(navigator.userAgent)) return false;
                if (/Android/i.test(navigator.userAgent)) {
                    var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
                    return (!parseFloat(s[0] + s[3]) < 44);
                }
            }

            new IScroll('.index-list-nav', {
                scrollX: true,
                scrollY: false,
                mouseWheel: true,
                click: iScrollClick()
            });
            new IScroll('.overflows', {
                scrollX: true,
                scrollY: false,
                eventPassthrough: true,
                click: iScrollClick()
            });

        });

    } else if (pageId === "list") {
        var id = (location.pathname + "").match(/\d+/)[0];
        /*流加载初始化*/
        $(".content").scrollTop(0);

        function templateList(data) {
            var li = "";
            data.data.forEach(function (item, index) {
                var newTime = "";
                if (isToday(item.publish_time)) {
                    console.log("jitnian ");
                    newTime = 'class="new-time"';
                }
                li += '<li> <a href="http://www.nxecw.com/html/' + item.id + '.html" class="clearfix"> <div class="img"> <img src="' + item.cover_img + '" onerror="this.src=\'http://www.nxecw.com/template/layres/images/no-img1.png\';" /> </div> <div class="info"> <h3 class="list-title">' + item.title + '</h3> <div class="clearfix"> <font ' + newTime + '>' + formt_md(item.publish_time) + '</font> <b>查看</b> </div> </div> </a> </li>'
            });
            return li;
        }

        loadMore("http://www.nxecw.com/index/mapi/get_all_list?type_id=" + id + "&page=", 0, templateList, $(".list-li"), pageId, true);

    } else if (pageId === "sites") {
        $(".content").scrollTop(0);
      var  temp= function templateList(data) {
            var li = "";
            data.data.forEach(function (item, index) {
                var newTime = "";
                li += '<li> <a href="/site/' + item.id + '.html" class="clearfix"> <div class="img"> <img src="' + item.logo_path + '" onerror="this.src=\'http://www.nxecw.com/template/layres/images/no-img1.png\';" /> </div> <div class="info"> <h3 class="list-title">' + item.title + '</h3> <div class="clearfix">'+ formt_md(item.joined_at) + ' <b>查看</b> </div> </div> </a> </li>'
            });
            return li;
        };
        loadMore("/index/mapi/site_list_page?page=", 1, temp, $(".list-li"), pageId, false);

    } else if (pageId === "search_result") {
        /*流加载初始化*/
        $(".infinite-scroll").scrollTop(0);

        var keyword = getQueryString("keyword");

        function templateResult(data) {
            var li = "";
            var keyword = getQueryString("keyword");
            data.data.forEach(function (item, index) {
                var newTime = "";
                if (isToday(item.publish_time)) {
                    newTime = 'class="new-time"';
                }
                var title = item.title;
                var reg = new RegExp(keyword, "g");//g,表示全部替换。
                title = title.replace(reg, "<em>" + reg.exec(title)[0] + "</em>");
                li += '<li> <a href="/html/' + item.id + '.html" class="clearfix"> <div class="img"> <img src="' + item.cover_img + '"  onerror="this.src=\'http://www.nxecw.com/template/layres/images/no-img1.png\';"/> </div> <div class="info"> <h3 class="list-title">' + title + '</h3> <div class="clearfix"> <font ' + newTime + '>' + item.publish_time + '</font> <b>查看</b> </div> </div> </a> </li>'
            });
            return li;
        }

        loadMore("http://www.nxecw.com/index/mapi/search?keyword=" + keyword + "&page=", 1, templateResult, $(".list-li"), pageId, false);

        /*搜索框回车*/
        $("#search").keyup(function (e) {
            if (e.keyCode === 13) {
                location = "http://www.nxecw.com/search?keyword=" + $(this).val();
            }
        });
    } else if (pageId === "login") {

    } else if (pageId === "reg") {

        $("#registerForm").submit(function (e) {
            var vf = $(this).verify({
                username: function (v, item) {
                    if (!isPhone(v) && !isEmail(v)) {
                        return "格式不正确";
                    }
                },
                password: function (v, item) {
                    if (!v || v.length < 6 || v.length > 18) {
                        return "请输入6 ~ 18 位的密码";
                    }
                },
                captcha: function (v, item) {
                    if (!v || v.length !== 4) {
                        return "请输正确的验证码";
                    }
                }
            });
            if (vf) {
                var data = $(this).field();
                request({
                    url: config.api.register, data: data,
                    done: function (result) {
                        if (result.data.code == 1) {
                            location = "/user/login.html";
                        }
                        $(".code .imgcode").click();
                    }
                });
            }
            return false;
        });

    } else if (pageId === "activate") {

    $("#registerForm").submit(function (e) {
        var vf = $(this).verify({
            username: function (v, item) {
                if (!isPhone(v) && !isEmail(v)) {
                    return "格式不正确";
                }
            },
            captcha: function (v, item) {
                if (!v || v.length !== 4) {
                    return "请输正确的验证码";
                }
            }
        });
        if (vf) {
            var data = $(this).field();
            request({
                url: config.api.activate, data: data,
                done: function (result) {
                    if (result.data.code == 1) {
                        location = "http://www.nxecw.com/user/login.html";
                    }
                    $(".code .imgcode").click();
                }
            });
        }
        return false;
    });

} else if (pageId === "phonecode") {

        $("#formData").submit(function (e) {

            var vf = $(this).verify({
                mobile: function (v, item) {
                    if (!isPhone(v)) {
                        return "手机号验证失败!" + v;
                    }
                },
                mobile_code: function (v, item) {
                    if (!v || v.length < 6) {
                        return "短信验证码错误";
                    }
                }
            });
            if (vf) {
                var data = $(this).field();
                request({
                    url: config.api.register, data: data,
                    done: function (result) {
                    }
                });
            }
            return false;
        });

    } else if (pageId === "w_info") {
        var form = $("#activate");
        var code = form.find('.code');
        form.submit(function () {
            var that = $(this);
            var url = config.api.register;
            var vf = that.verify({
                username: function (v, item) {
                    if (isPhone(v)) {
                        code.show();
                    } else if (isEmail(v)) {
                    } else {
                        return "格式不正确";
                    }
                },
                password: function (v, item) {
                    if (!v || v.length < 6 || v.length > 18) {
                        return "请输入 6 ~ 18 位密码";
                    }
                },
                captcha: function (v, item) {
                    if (v.length !== 4) {
                        return "请输入正确的图片验证码";
                    }
                }
            });
            if (vf) {
                request({
                    url: url,
                    data: that.field(),
                    done: function () {
                        $(".imgcode").trigger("click");
                    }
                })
            }
            return false
        });

    } else if (pageId === "forgetpass") {

        $("#formData").submit(function () {

            if ($(this).html() === "重置密码") {
                $.alert('密码重置成功！', function () {
                    location = "http://www.nxecw.com/user/";
                });
            } else {
                $.alert('请进入邮箱进行打开链接验证', function () {
                    $(".us-w form>div").eq(0).hide();
                    $(".us-w form>div").eq(1).show();
                    $(".btn").html("重置密码");
                });
            }

            return false;

        });


    } else if (pageId === "lists") {
        /*流加载初始化*/
        $(".content").scrollTop(0);
        var temp = function (data) {
            var li = "";
            data.data.forEach(function (item, index) {
                var newTime = "";
                if (item.isNew) {
                    newTime = 'class="new-time"';
                }
                li += '<li> <a href="http://www.nxecw.com/html/' + item.id + '.html" class="clearfix"> <div class="img"> <img src="' + item.cover_img + '" onerror="this.src=\'http://www.nxecw.com/template/layres/images/no-img1.png\';" /> </div> <div class="info"> <h3 class="list-title">' + item.title + '</h3> <div class="clearfix"> <font ' + newTime + '>' + formt_md(item.publish_time) + '</font> <b>查看</b> </div> </div> </a> </li>'
            });
            return li;
        };
        loadMore("http://www.nxecw.com/index/mapi/get_all_list?page=", 1, temp, $(".list-li"), pageId, false);
    } else if (pageId === "yhq") {
        /*流加载初始化*/
        $(".content").scrollTop(0);

        function templateYhq(data) {
            console.log(data)
            var li = "";
            data.data.result.forEach(function (item, index) {
                li += '<li> <a href="' + item.ali_click + '" target="_blank" class="external"> <div class="shop_url clearfix"> <img src="' + item.Pic + '" class="shopImg"> <div class="right_shop"> <h3>' + item.D_title + '</h3> <div class="clearfix pras"> <p><i>¥</i>' + item.Price + '</p> <b><i>销量：</i>' + item.Sales_num + '件</b> </div> <div class="pson clearfix"> <div class="right"> <div class="coupon"> <i class="lquan" style="left:-4.5px;"></i> <i class="rquan"></i>' + item.Quan_price + ' 元券 </div> </div> </div> </div> </div> </a> </li>';
            });
            return li;
        }

        $.get("http://www.nxecw.com/coupon/", function (res) {
            $(".shop_li").html(templateYhq(res));
            $(".infinite-scroll-preloader").remove();
        });
    } else if (pageId === "shop") {
        /*流加载初始化*/
        var page = 1;
        $(".content").scrollTop(0);

        function templateShop(res) {
            var li = "";
            var height = ($("#shop .shop_li").width() * 0.4);
            res.list.forEach(function (item, index) {
                li += '<li> <a href="http://www.nxecw.com/shop_detail/' + item.id + '.html" class="external"> <div class="shop_url clearfix"> <div class="shopImg" style="width:' + height + 'px;height:' + height + 'px;line-height:' + height + 'px;"><img src="' + item.cover + '" /></div> <div class="right_shop" style="width:calc(100% - ' + height + 'px)"> <h3>' + item.title + '</h3> <div class="clearfix pras"> <p><i>¥</i>' + item.price + '</p> <b><i>销量：</i>' + item.sales + '件</b> </div> </div> </div> </a> </li>';
            });
            return li;
        }

        loadMore("http://www.nxecw.com/shop_list/?page=", 0, templateShop, $(".shop_li"), pageId, true);
    } else if (pageId === "shop_detail") {
        isLogin(true);
        $(".img").css({"height": screen.width + "px", "line-height": screen.width + "px"});//兼容封面
        var height = ($(".shop_li").width() * 0.35);
        $(".shopImg").css({"width": height + "px", "height": height + "px", "line-height": height + "px"});//兼容列表
        $(".right_shop").css("width", "calc(100% - " + height + "px)");//兼容列表

        $(".rightNow").click(function () {
            if (isLogin(true).status) {
                location = $(this).attr("data-url");
            } else {
                location = "http://www.nxecw.com/user/login.html";
            }
        })


    } else if (pageId === "shop_sure") {
        $(".goPay").click(function () {
            var data = {info: []};
            for (var i = 0; i < $(".order-sure .write").length; i++) {
                var val = $(".order-sure .write").eq(i).val();
                var reg = $(".order-sure .write").eq(i).attr("data-reg");
                var title = $(".order-sure .write").eq(i).attr("data-title");
                var name = $(".order-sure .write").eq(i).attr("name");
                if (!val) {
                    $.toast("请填写好相关信息");
                    return;
                } else {
                    if (reg) {
                        if (!(new RegExp(reg).test(val))) {
                            $.toast(title + "没有填写正确");
                            return;
                        }
                    }
                    data.info.push({
                        "key": name,
                        "value": val,
                        "title": title,
                    });
                }
            }
            if ($(".payType").length > 0) {
                if ($(".payType li.active").length <= 0) {
                    $.toast("请选择付款方式！");
                    return;
                }
            }
            data.type = $(".payType li.active a").attr("data-type") || "";
            data.shopId = $(".order-sure").attr("data-id");
            console.log(data)

            request({
                loading: "订单生成中...",
                url: "http://www.nxecw.com/place_order",
                data: data,
                success: function (res) {
                    if (res.code === 200) {
                        if (res.data.type == "url") {
                            location = res.data.url;
                        } else if (res.data.type == "ok_url") {
                            $.confirm(res.msg,
                                function () {
                                    location = res.data.url;
                                },
                                function () {

                                }
                            );
                        }
                    } else {
                        $.alert(res.msg);
                    }
                },
            });
        })
        $(".payType li a").click(function () {
            $(".payType .active").removeClass("active");
            $(this).parent().addClass("active");
        })


    } else if (pageId === "u-shop") {
        var height = screen.width * 0.9 * 0.35;

        /*流加载初始化*/
        function templateRecord(data) {
            var li = "";
            if (data.pages === 1) {
                $(".list-li").html("");
            }
            if (data.pages > 0) {
                data.list.forEach(function (item, index) {
                    var color = item.status === 0 ? "border: 1px solid #e6e6e6;color:#8e8e8e;" : item.status === 1 ? "border: 1px solid #2c94ff;color: #2c94ff;" : item.status === 2 ? "border: 1px solid #38ad23;color: #38ad23;" : item.status === 3 ? "border: 1px solid #e6e6e6;color:#8e8e8e;" : "";
                    var status = item.status === 0 ? "待支付" : item.status === 1 ? "待处理" : item.status === 2 ? "已发货" : item.status === 3 ? "不发货" : "";
                    li += '<li> <a data-no-cache="true" href="http://www.nxecw.com/user/shop_detail.html?id=' + item.id + '" class="clearfix"> <div class="img" style="width:' + height + 'px;height:' + height + 'px;line-height:' + height + 'px"> <img src="' + item.shop_cover + '" onerror="javascript:this.src=\'http://www.nxecw.com/template/layres/images/daishua_defult.png\';" /> </div> <div class="info" style="width:calc(100% - ' + height + 'px);"> <h3 class="list-title"><i style="' + color + '">' + status + '</i>' + item.shop_title + '</h3> <div class="clearfix"> <font>' + item.create_time + '</font> </div> </div> </a> </li>';
                });
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').remove();
                if ($(".no-data").length <= 0) {
                    li = '<div class="no-data"> <img src="http://www.nxecw.com/public/images/nodataList.png" style="width:5rem"> <span>您还没有代刷过业务呢</span><a href="/shop.html">前去代刷</a> </div>'
                }
            }
            return li;
        }

        loadMore("http://www.nxecw.com/user/shop_log_list.html?page=", 0, templateRecord, $(".list-li"), pageId, true);


    } else if (pageId === "u-shop-detail") {
        var id = getQueryString("id");
        if (id) {
            request({
                url: "http://www.nxecw.com/user/shop_log_detail?id=" + id,
                loading: false,
                success: function (res) {
                    var param = "";
                    for (var i = 0; i < res.data.order_param.length; i++) {
                        param += res.data.order_param[i].title + "：" + res.data.order_param[i].value + "<br />";
                    }
                    $(".content").html('<div class="intr">\
				<div class="clearfix">\
					<div class="left"> 商品标题： </div>\
					<div class="right">' + (res.data.shop_title || "---") + '</div>\
				</div>\
				<div class="clearfix">\
					<div class="left"> 商品价格： </div>\
					<div class="right">' + (res.data.money || "---") + '元</div>\
				</div>\
				<div class="clearfix">\
					<div class="left"> 状态： </div>\
					<div class="right">' + (res.data.status == 0 ? "待付款" : res.data.status == 1 ? "待处理" : res.data.status == 2 ? "已发货" : "") + '</div>\
				</div>\
				<div class="clearfix">\
				    <div class="left">收货信息：</div>\
				    <div class="right">' + param + '</div>\
				</div>\
				<div class="clearfix">\
				    <div class="left">支付方式：</div>\
				    <div class="right">' + (res.data.pay_type == "wechat" ? "微信" : res.data.pay_type == "alipay" ? "支付宝" : "---") + '</div>\
				</div>\
				<div class="clearfix">\
					<div class="left"> 下单时间： </div>\
					<div class="right">' + (res.data.create_time || "---") + '</div>\
				</div>\
				<div class="clearfix">\
					<div class="left"> 支付时间： </div>\
					<div class="right">' + (res.data.pay_time || "---") + '</div>\
				</div>\
				<div class="clearfix">\
					<div class="left"> 系统下单时间： </div>\
					<div class="right">' + (res.data.dispose_time || "---") + '</div>\
				</div>\
				<div class="clearfix">\
					<div class="left"> 订单ID： </div>\
					<div class="right">' + (res.data.order_number || "---") + '</div>\
				</div>\
				<div class="clearfix">\
					<div class="left"> 本次分配的客服QQ： </div>\
					<div class="right">' + (res.data.admin_qq || "---") + '（有订单问题请联系）</div>\
				</div>\
				<div class="clearfix">\
					<div class="left"> 客服回复： </div>\
					<div class="right">' + (res.data.reply || "---") + '</div>\
				</div>\
			</div>');
                }
            });
        } else {
            $(".content").html('<div style="text-align:center;color:#909090;font-size:0.7rem;height:2rem;line-height:2rem;margin:0.4rem 0;">数据异常</div>');
        }


    } else if (pageId == "top") {
        $(".nav li a").click(function (e) {
            $(".hover").removeClass("hover");
            $(this).parent("li").addClass("hover");
            $(".border-bottom").css({"left": $(this).position().left, "width": $(this).width()});

            $(".list").hide();
            $(".list").eq($(".nav li a").index($(this))).show();
        });
    } else if (pageId === "userIndex") {

        /*退出登录*/
        $(".exit").click(function (e) {
            exit();
        });
        /*api*/
        $(".api").click(function (e) {
            $.alert('开放接口API是基于编程技术，用于打造自己的丰富个性化自动更新资源平台的接口，如有需要请使用电脑访问115资源网查看。');
        });

    } else if (pageId == "u-api") {

    } else if (pageId === "u-comment") {
        /*流加载初始化*/
        $(".content").scrollTop(0);

        function templateComment(data) {
            var li = "";
            if (data.pages > 0) {
                data.data.forEach(function (item, index) {
                    var statu = "";
                    if (item.status === 2) {
                        statu = "<i>待审核</i>";
                    }
                    li += '<li> <div class="info"> <div class="cons"> ' + statu + item.content + ' </div> <div class="dec clearfix"> <div class="left">' + item.created_at + '</div> <a class="right" href="http://www.nxecw.com/html/' + item.id + '.html">来自：' + item.title + '</a> </div> </div> </li>';
                });
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').remove();
                if ($(".no-data").length <= 0) {
                    li = '<div class="no-data"> <img src="/public/images/nodataList.png" style="width:5rem"> <span>暂无内容！</span> </div>'
                }
            }
            return li;
        }

        loadMore("http://www.nxecw.com/user/comment.html?page=", 0, templateComment, $(".pl-lists"), pageId, true);
    } else if (pageId === "u-record") {
        /*流加载初始化*/
        function templateRecord(data) {
            var li = "";
            if (data.pages === 1) {
                $(".list-li").html("");
            }
            if (data.pages > 0) {
                data.data.forEach(function (item, index) {
                    var type = item.has_attachment == 1 ? '软件' : '文章';
                    var status = item.status === 1 ? "success" : item.status === 2 ? "bad" : "wait";
                    li += '<li> <a data-no-cache="true" href="http://www.nxecw.com/user/record_detail/' + item.id + '.html" class="clearfix"> <div class="img ' + status + '"> <img src="' + item.cover_img + '" onerror="javascript:this.src=\'http://www.nxecw.com/template/layres/images/no-img1.png\';" /> </div> <div class="info"> <h3 class="list-title"><i>' + type + '</i>' + item.title + '</h3> <div class="clearfix"> <font>' + item.created_at + '</font> </div> </div> </a> </li>';
                });
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').remove();
                if ($(".no-data").length <= 0) {
                    li = '<div class="no-data"> <img src="http://www.nxecw.com/public/images/nodataList.png" style="width:5rem"> <span>您还没有投过稿呢！</span> </div>'
                }
            }
            return li;
        }

        loadMore("http://www.nxecw.com/user/record.html?page=", 0, templateRecord, $(".list-li"), pageId, true);
    } else if (pageId === "u-record-detail") {

    } else if (pageId == "u-tg") {

    } else if (pageId === "person") {
        /*导航栏目切换*/
        $(".nav li a").click(function (e) {
            $(".hover").removeClass("hover");
            $(this).parent("li").addClass("hover");
            $(".border-bottom").css({"left": $(this).position().left, "width": $(this).width()});

            $(".list").hide();
            $(".list").eq($(".nav li a").index($(this))).show();
            $(".content").scrollTop(0);


            if ($(".nav li a").index($(this)) == 1) {
                if ($(this).attr("data-open") != "true") {
                    $(this).attr("data-open", "true");
                    loadList();
                }
            } else if ($(".nav li a").index($(this)) == 2) {
                if ($(this).attr("data-open") != "true") {
                    $(this).attr("data-open", "true");
                    loadComment();
                }
            }
        });
        /*联系QQ*/
        $(".lxqq").click(function () {
            var qq = $(this).attr("data-qq");
            if (qq == "") {
                $.alert('该作者并未设置QQ联系方式。');
            } else if (qq == "---") {
                $.alert('该用户由于违反了用户协议，已被管理员封禁账号。');
            } else {
                $.confirm('请勿与该用户发生任何金钱交易，否则被骗概不负责，谢谢！', function () {
                    open("mqq://im/chat?chat_type=wpa&uin=" + qq + "&version=1&src_type=web&web_src=qq.com", "_blank");
                });
            }
        });

        /*加载更多*/
        var jcPage = 0;
        var plPage = 0;
        var more = $("#person");

        more.off("click").on("click", ".add-more", function () {
            var index = $(".nav li").index($(".nav .hover"));
            if (index === 1) {
                loadList();
            } else if (index === 2) {
                loadComment()
            }
        });

        function loadList() {
            request({
                url: config.api.my_user_list,
                loading: false,
                data: {
                    page: jcPage + 1,
                    uuid: $(".uuid_val").attr('data-uuid'),
                },
                success: function (e) {
                    jcPage++;
                    $(".list").eq(1).find(".infinite-scroll-preloader").remove();
                    if (e.pages == 0) {
                        $(".list").eq(1).html('<div class="no-data"><img src="http://www.nxecw.com/public/images/nodataList.png" style="width:5rem;"><span>该用户还从未投过稿呢！</span></div>');
                        return;
                    } else if (e.pages > jcPage) {
                        if ($(".list").eq(1).find(".add-more").length <= 0) {
                            $(".list").eq(1).append('<a class="add-more"> 加载更多 </a>');
                        }
                    }

                    var li = "";
                    e.list.forEach(function (item, index) {
                        var url = item.status == 1 ? "/html/" + item.id + ".html" : "javaScript:$.toast('待审核或审核失败的无法查看！');";
                        var statu = item.status == 1 ? "已通过" : item.status == 2 ? "未通过" : "等待审核";
                        var status_cls = item.status == 1 ? "success" : item.status == 2 ? "bad" : "等待审核";
                        li += '<li> <a href="' + url + '" class="clearfix"> <div class="img"> <img src="' + item.cover_img + '" onerror="this.src=\'http://www.nxecw.com/template/layres/images/no-img1.png\';" > </div> <div class="info"> <h3 class="list-title">' + item.title + '</h3> <div class="clearfix"> <font>' + item.created_at + '</font> <b class="' + status_cls + '">' + statu + '</b> </div> </div> </a> </li>';
                    });
                    if (e.pages > jcPage) {
                        /*添加新内容*/
                        $(".list-li").show().append(li);
                    } else if (e.pages <= jcPage) {
                        $(".list-li").show().append(li);
                        $(".list").eq(1).append("<div class='no-mores'>没有更多了</div>").find(".add-more").remove();
                    }

                }
            });
        }

        function loadComment() {
            request({
                url: config.api.my_comment_list,
                loading: false,
                data: {
                    page: plPage + 1,
                    uuid: $(".uuid_val").attr('data-uuid'),
                },
                success: function (e) {
                    plPage++;
                    $(".list").eq(2).find(".infinite-scroll-preloader").remove();
                    if (e.pages == 0) {
                        $(".list").eq(2).html('<div class="no-data"><img src="http://www.nxecw.com/public/images/nodataList.png" style="width:5rem;"><span>暂无内容！</span></div>');
                        return;
                    } else if (e.pages > jcPage) {
                        if ($(".list").eq(2).find(".add-more").length <= 0) {
                            $(".list").eq(2).append('<a class="add-more"> 加载更多 </a>');
                        }
                    }


                    var li = "";
                    e.list.forEach(function (item, index) {
                        li += '<li> <div class="info"> <div class="cons">' + item.content + '</div> <div class="dec clearfix"> <div class="left">' + item.created_at + '</div> <a class="right" href="http://www.nxecw.com/html/' + item.id + '.html" target="_blank">来自：' + item.title + '</a> </div> </div> </li>';
                    });
                    if (e.pages > plPage) {
                        /*添加新内容*/
                        $(".pl-lists").show().append(li);
                    } else if (e.pages <= plPage) {
                        $(".pl-lists").show().append(li);
                        $(".list").eq(2).append("<div class='no-mores'>没有更多了</div>").find(".add-more").remove();
                    }

                }
            })
        }


    } else if (pageId === "u-change") {
        /*退出登录*/
        $(".exit").click(function (e) {
            $.confirm('是否真的退出账号?',
                function () {
                    location = "/";
                }
            );
        });

        /*修改头像*/
        $(".changeImg").click(function () {
            document.getElementById("trim").contentWindow.upload();
        });
        /*修改昵称*/
        $(".nick").click(function (e) {
            var that = $(this);
            chanegNick(that);
        });
        /*修改用户名*/
        $(".username").click(function (e) {
            var that = $(this);
            chanegUsername(that);
        });

        function chanegUsername(that) {
            $.prompt('修改用户名(每月只能改1次)', function (value) {
                if (value.length <= 3) {
                    $.toast("太短了，输长一点吧！");
                    chanegUsername(that);
                    return;
                } else if (value.length > 18) {
                    $.toast("太长了，输短一点吧！");
                    chanegUsername(that);
                    return;
                }
                request({
                    data: {username: value}, success: function (result) {
                        $.toast("用户名" + result.msg);
                        that.find(".right .cont").html(value);
                    }
                });

            });
            $(".modal-text-input").val(that.find(".right .cont").html());
        }
        function chanegNick(that) {
            $.prompt('修改昵称', function (value) {
                if (value.length <= 3) {
                    $.toast("太短了，输长一点吧！");
                    chanegNick(that);
                    return;
                } else if (value.length > 18) {
                    $.toast("太长了，输短一点吧！");
                    chanegNick(that);
                    return;
                }
                request({
                    data: {nick: value}, success: function (result) {
                        $.toast("昵称" + result.msg);
                        that.find(".right .cont").html(value);
                    }
                });

            });
            $(".modal-text-input").val(that.find(".right .cont").html());
        }


        /*男女性格*/
        $("#gender").picker({
            toolbarTemplate: '<header class="bar bar-nav">\
		  <button class="button button-link pull-right close-picker" style="font-size:0.7rem;">确定</button>\
		  <h1 class="title" style="font-size:0.7rem;">选择性别</h1>\
		  </header>',
            cssClass: "genden",
            cols: [{
                textAlign: 'center',
                values: ['男生', '女生']
            }],
            onOpen: function () {
                $("body").append('<div class="shadeClose" style="position:fixed;z-index:9999;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3)"></div>');
                if ($("#gender .icon-nan").length > 0) {
                    $("#gender").picker("setValue", ["男生"]);
                } else {
                    $("#gender").picker("setValue", ["女生"]);
                }
            }
        });
        $("html").on("click", ".shadeClose", function () {
            $(".shadeClose").remove();
        });
        $("body").off("click").on("click", ".close-picker", function () {
            var val = $(".genden .picker-selected").attr("data-picker-value");
            request({
                data: {gender: val === "男生" ? 0 : 1}, success: function (result) {
                    $.toast("性别" + result.msg);
                    if (result.code === 1) {
                        var gen = $("#gender .genico").removeClass("icon-nan").removeClass("icon-nv");
                        if (val === "男生") {
                            gen.addClass("icon-nan");
                        } else {
                            gen.addClass("icon-nv");
                        }
                        $(".shadeClose").remove();
                    }
                }
            });

        });

        /*修改QQ*/
        $(".myqq").click(function (e) {
            var that = $(this);
            chanegqq(that);
        });

        function chanegqq(that) {
            $.prompt('修改QQ号码', function (value) {
                if (value.length <= 4) {
                    $.toast("兄弟,你家QQ号这么短的吗!");
                    chanegqq(that);
                    return;
                } else if (value.length > 14) {
                    $.toast("这QQ怎么这么长,都快有我屌长了..");
                    chanegqq(that);
                    return;
                }
                request({
                    data: {qq: value}, success: function (result) {
                        $.toast("QQ" + result.msg);
                        result.code === 1 && that.find(".right .cont").html(value);
                    }
                });
            });
            $(".modal-text-input").val(that.find(".right .cont").html());
        }
    } else if (pageId === "changeGexin") {
        /* 个人推广帮助按钮 */
        $(".icon-bangzhu").click(function () {
            $.alert('此处个性推广用于展示在个人主页，设置后 用户查看到您主页时， 会在底部显示此自定义按钮，用户点击后可跳转到您想跳转的页面， 一般用于推广自己的网站或加线报群使用。');
        });

        /* 保存 */
        $("#form").submit(function () {
            var vf = $(this).verify({
                web_title: function (v, item) {
                    if (!/^[\u4e00-\u9fa5_\w]+$/.test(v)) {
                        return "站名只能输入中文";
                    }
                },
                web_url: function (v, item) {

                    if (!/^((https|http)?:\/\/)[^\s]+$/.test(v)) {
                        return "链接地址错误!";
                    }
                }
            });
            if (vf) {
                request({
                    data: $(this).field(),
                    success: function (result) {
                        result.msg && $.alert(result.msg, function (e) {
                            result.code === 1 && $.router.back();
                        });
                    }
                });
            }
            return false
        })


    } else if (pageId === "bind") {
        /* 绑定按钮 */
        $(".bind-list li i").click(function () {
            var type = $(this).attr("data-type");
            var user = $(this).attr("data-user");
            var that = $(this);
            if (type === "qq") {
                if (user) {
                    $.confirm('您当前绑定的为： <font color="#F30">' + user + '</font> 若您解绑后 QQ号无法正常登陆，请知晓。', function () {
                        $.toast("解绑成功!");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    });
                } else {
                    location = "http://www.nxecw.com/user/qqlogin.html";
                }
            } else {
                var object = type == 'phone' ? '手机号' : '邮箱';
                var checkType = type == 'phone' ? 2 : 1;
                if (user) {
                    $.confirm('您当前绑定的为： <font color="#F30">' + user + '</font> 解绑后将无法使用' + object + '登陆，需先验证原' + object + '才能解绑', function () {
                        $.popup('.popup-phone');
                        $(".modal-overlay-visible").remove();//关掉初始化后的阴影

                        $("#phone_form").find("[name=mobile]").attr('placeholder', '请输入你的' + object);

                        $("#send_code").timeOut({
                            send: function (send_cmd, send_val) {
                                var phone_form = $("#phone_form");
                                var data_val = phone_form.field();
                                var vf = phone_form.verify({
                                    mobile: function (v, item) {
                                        var objectCheck;
                                        if (type == 'phone') {
                                            objectCheck = isPhone(v);
                                        } else {
                                            objectCheck = isEmail(v);
                                        }
                                        if (!objectCheck) {
                                            return "请输入正确的" + object;
                                        }
                                    },
                                    captcha: function (v, item) {
                                        if (v.length != 4) {
                                            return "请输入4位图形验证码";
                                        }
                                    }
                                });

                                if (vf) {
                                    request({
                                        url: config.api.ck_phone_msg,
                                        data: {
                                            data: data_val
                                        },
                                        success: function (res) {
                                            if (res.code === 1) {
                                                send_cmd();
                                            }
                                            $.alert(res.msg);
                                        }
                                    })
                                }

                            }
                        });
                        $(".btn_over").click(function () {
                            var phone_form = $("#phone_form");
                            var data_val = phone_form.field();
                            var vf = phone_form.verify({
                                mobile: function (v, item) {
                                    var objectCheck;
                                    if (type == 'phone') {
                                        objectCheck = isPhone(v);
                                    } else {
                                        objectCheck = isEmail(v);
                                    }
                                    if (!objectCheck) {
                                        return "请输入正确的" + object;
                                    }
                                },
                                captcha: function (v, item) {
                                    if (v.length !== 4) {
                                        return '请输入4位图形验证码';
                                    }
                                },
                                mobile_code: function (v, item) {
                                    if (v.length !== 6) {
                                        return '请输入6位验证码';
                                    }
                                }
                            });
                            if (vf) {
                                request({
                                    url: config.api.unbind_phone,
                                    data: {
                                        data: data_val
                                    },
                                    success: function (res) {
                                        if (res.code === 1) {
                                            setTimeout(function () {
                                                location.reload();
                                            }, 2000);
                                        }
                                        $.toast(res.msg);
                                    }
                                })
                            }

                        });

                    });
                } else {
                    $.popup('.popup-phone');
                    $(".modal-overlay-visible").remove();//关掉初始化后的阴影
                    $("#send_code").timeOut({
                        send: function (send_cmd, send_val) {
                            var phone_form = $("#phone_form");
                            var data_val = phone_form.field();
                            var vf = phone_form.verify({
                                mobile: function (v, item) {
                                    var objectCheck;
                                    if (type == 'phone') {
                                        objectCheck = isPhone(v);
                                    } else {
                                        objectCheck = isEmail(v);
                                    }
                                    if (!objectCheck) {
                                        return "请输入正确的";
                                    }

                                },
                                captcha: function (v, item) {
                                    if (v.length !== 4) {
                                        return "请输入4位图形验证码";
                                    }
                                }
                            });
                            if (vf) {
                                request({
                                    url: config.api.send_code,
                                    data: {data: data_val},
                                    success: function (res) {
                                        if (res.code === 1) {
                                            send_cmd();
                                        } else {
                                            $(".imgcode").click();
                                            $("input[name=captcha]").val("")
                                        }
                                        $.toast(res.msg);
                                    }
                                })
                            }

                        }
                    });
                    $(".btn_over").click(function () {
                        var phone_form = $("#phone_form");
                        var data_val = phone_form.field();
                        var vf = phone_form.verify({
                            mobile: function (v, item) {
                                var objectCheck;
                                if (type == 'phone') {
                                    objectCheck = isPhone(v);
                                } else {
                                    objectCheck = isEmail(v);
                                }
                                if (!objectCheck) {
                                    return "请输入正确的手机号码";
                                }

                            },
                            captcha: function (v, item) {
                                if (v.length !== 4) {
                                    return '请输入4位图形验证码';
                                }
                            },
                            mobile_code: function (v, item) {
                                if (v.length !== 6) {
                                    return '请输入6位短信验证码';
                                }
                            }
                        })
                        if (vf) {
                            request({
                                url: config.api.bind_phone,
                                data: {
                                    data: data_val
                                },
                                success: function (res) {
                                    if (res.code === 1) {
                                        setTimeout(function () {
                                            location.reload();
                                        }, 2000);
                                    }
                                    $.toast(res.msg);
                                    /*$("input[name=captcha]").val("");
                                    $(".imgcode").click();*/
                                }
                            })
                        }

                    });

                }
            }
        });
    } else if (pageId === "changepass") {
        /* 保存 */
        $("#pass_form").submit(function () {
            var that = this;
            var data = $(this).field();
            var vf = $(that).verify({
                old_password: function (val, item) {
                    if (item && ((val.length) < 6 || (val.length) > 18)) {
                        return '原密码填写 6 - 18 字符!';
                    }
                },
                password: function (val, item) {
                    if (!val || (val.length) < 6 || (val.length) > 18) {
                        return '密码只能填写 6 - 18 为字符!';
                    }
                }
                , password_confirm: function (val, item) {
                    var pwd = $(item).siblings('input[name=password]').val()
                    if (pwd !== val) {
                        return "两次密码输入不一致!";
                    }
                }
            });
            if (vf) {
                request({
                    url: "http://www.nxecw.com/user/changepass.html",
                    data: data,
                    done: function () {
                        that.reset()
                    }
                });
            }
            return false;
        });

    } else if (pageId === "intro") {
        $(".postIntro").click(function () {
            var val = $(".introTeaxt").val().trim();
            if (!val || val.length < 1) {
                $.toast("惜字如金也不能一字留啊！");
                return;
            } else {
                request({
                    url: 'http://www.nxecw.com/user/change_info.html',
                    data: {sign: val},
                    loading: false,
                    success: function (result) {
                        $.toast(result.msg);
                        (result.code === 1) && ($.router.back());
                    }
                });
            }
        });

    } else if (pageId == "aboutMe") {

    } else if (pageId == "ad") {

    } else if (pageId == "tg_rule") {

    } else if (pageId == "idea") {

    } else if (pageId == "article") {
        /*评论插件*/
        plInit();
    } else if (pageId == "soft") {
        /*评论插件*/
        plInit();

        /*下载按钮*/
        if ($.device.ios) {
            $(".downBtn a").addClass("iosDown");
        } else {
            var header = $("#header").clone();
            $("#header").remove();
            $("#" + pageId + " .content").prepend(header);
        }

        $(".iosDown").off("click").on("click", function () {
            var that = $(this);
            if (that.attr("data-pass")) {
                $.confirm('网盘下载需输入密码： ' + that.attr("data-pass"), function () {
                    window.open(that.attr("href"), "_blank");
                });
            } else {
                $.confirm('当前检测到您的系统为iOS,可能无法正常下载附件,是否继续?', function () {
                    window.open(that.attr("href"), "_blank");
                });
            }
            return false;
        });
    } else if (pageId == "appdown") {
        if (!$.device.ios && !$.device.android) {
            location = "http://www.nxecw.com/appdown";
        }
    }
});

$.init();

/*通用代码 绑定事件之类的*/
function public_fun(pageId) {
    (function () {
        var bp = document.createElement('script');
        var curProtocol = window.location.protocol.split(':')[0];
        if (curProtocol === 'https') {
            bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
        } else {
            bp.src = 'http://push.zhanzhang.baidu.com/push.js';
        }
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    })();
    /*回到顶部*/
    if ($("#backtop").length > 0) {
        $(".content").scroll(function (e) {
            var scroH = $(this).scrollTop();
            if (scroH > 200) {
                $("#backtop").show();

            } else {
                $("#backtop").hide();
            }
        });
    }
    $("#backtop").click(function (e) {
        $(".content").scrollTop(0);
    });
}

/*是否今天*/
function isToday(date) {
    date = /\s*/.test(date) ? date.split(" ")[0] : date;
    var now = new Date();
    var seperator1 = "-";
    var month = now.getMonth() + 1;
    var strDate = now.getDate();
    var year = now.getFullYear();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate === date;
}

/*流加载  - 请求的URL，当前处于的页数，模板方法，流加载的ul容器，是否默认加载 */
function loadMore(url, page, template, query, pageId, isAuto) {
    var loading = true;
    /*开放允许下拉加载*/
    var page = page;
    /*当前页数*/

    if (isAuto) {
        start()
    }
    $("#" + pageId).on('infinite', '.infinite-scroll', function () {
        if (!loading) return;
        loading = false;
        start();
    });

    function start() {
        $.getJSON(url + (page + 1), function (data) {
            console.log(data)
            loading = true;
            page++;
            query.show();
            if (data.msg === 'success' && data.data) {
                data = data.data;
            }
            if (data.pages > page) {

                /*添加新内容*/
                query.append(template(data, query));
                $.refreshScroller();
            } else if (data.pages <= page) {
                query.append(template(data, query));
                $.refreshScroller();

                $.detachInfiniteScroll($('.infinite-scroll'));
                $(".infinite-scroll-preloader").after("<div class='no-mores'>没有更多了</div>");
                $('.infinite-scroll-preloader').remove();
            }
        });
    }
}

/*获取参数*/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}


/*转换数字*/
function castnum(number) {
    return number;
}

/*判断是否登陆
 *
 * @param option
 * @returns {object}
 */
var loginStatus = false;

function isLogin(option) {
    if (!loginStatus) {
        request({
            url: config.api.check_login,
            async: false,
            loading: false,
            success: function (result) {
                loginStatus = option ? (result.data.status ? result.data : false) : result.data.status;
            }
        });
    }
    return option ? loginStatus : typeof loginStatus === 'object' ? loginStatus.status : loginStatus;
}

/*退出当前账号*/
function exit() {
    $.confirm("确定要退出登录吗?", function () {
        request({
            url: config.api.login_out, done: function () {
                loginStatus = false;
            }
        });
    });
}

function comments_data(data, isHot) {

    if (isHot) {
        data.list['comments'] = data.list['comments_hot']
    }
    var comments = data.list['comments'];
    var comments_reply = data.list['comments_reply'];
    //处理评论数据
    comments.forEach(function (value, i) {
        value.reply = [];
        comments_reply.forEach(function (item, j) {
            if (value.id === item['root_id']) {
                value.reply.push(item);
            }
        });
    });
    return comments;
}


/*评论相关*/
function plInit() {
    var aid = $("#content").data('id');
    var comment_data = config.api.comment_data + aid;
    /*点赞*/
    $(".data").off("click").on("click", ".left", function () {
        if (!$(this).hasClass("hover")) {
            var that = $(this);
            request({
                url: config.api.thumbs_up,
                data: {aid: aid},
                loading: false,
                success: function (result) {
                    if (result.code === 1) {
                        that.html('<i class="iconfont icon-dianzan"></i>' + (parseInt(that.text()) + 1));
                    } else {
                        $.toast("您已经点过赞了");
                    }
                    that.addClass("hover");
                }
            });
        } else {
            $.toast("您已经点过赞了");
        }

    });

    /*评论点赞*/
    $(".heihei").off("click").on("click", ".li-dz", function () {
        if (!$(this).hasClass("hover")) {

            var that = $(this);
            var id = that.parents('.li-info').data('id');
            request({
                url: config.api.thumbs_up,
                data: {id: id},
                loading: false,
                success: function (result) {
                    if (result.code === 1) {
                        that.addClass("hover").html('<i class="iconfont icon-dianzan"></i>' + (parseInt(that.text()) + 1));
                    } else {
                        $.toast("您已经点过赞了");
                        that.addClass("hover")
                    }
                }
            });

        } else {
            $.toast("您已经点过赞了");
        }
    });


    /*获取数据，并且初始化*/

    var datas;
    request({
        url: comment_data,
        success: function (data) {
            datas = data;
            resetData(data.data);
        }
    });

    /* 子评论加载更多 */
    $(".user-pl").off("click").on("click", ".zi-loadmore", function (e) {
        var that = $(this);
        that.prev("ul").find("li").each(function (i, e) {
            e.removeAttribute("hidden");
            that.remove()
        });
        that.html("正在加载中...");
        var lis = "";
        /*    $.get("/test/getinfo.php?type=zisay", function (data) {
                if (data.length > 0) {
                    $(data).each(function (index, val) {
                        var a = "";
                        if (val.say1) {
                            a = '<a href="' + val.say1url + '" target="_blank" class="zi-nick" style="margin-right:7px;">' + val.say1 + '</a>回复';
                        }
                        lis += '<li> <div class="zi-pl-content"> ' + a + ' <a href="' + val.say2url + '" target="_blank" class="zi-nick">' + val.say2 + '</a>： ' + val.content + ' </div> <div class="zi-cz"> <a class="huifubtn">回复</a> · ' + val.time + ' </div> </li>';
                    });
                    that.parent().find("ul").append(lis);
                    that.html("查看更多回复");
                } else {
                    that.remove();
                }
            });*/
    });

    /* 父评论加载更多 */
    $(".new-list").off("click").on("click", ".showMore", function (e) {

        var that = $(this);
        that.html("正在加载中...");
        var temp = $("#pl-template");
        var page = parseInt(that.data("page")),
            pages = datas.data.pages;

        if (page < pages) {
            request({
                url: comment_data,
                data: {page: page + 1},
                success: function (result) {
                    that.data('page', ++page);
                    $(".new-list .heihei").append(template(comments_data(result.data)));
                    (page >= pages) ? that.html("没有更多了") : that.html("查看更多评论 ");
                }
            });
            console.log(that.data('page'));
        } else {
            that.html("没有更多了");
        }
    });

    /* 点击回复按钮 */
    var atext = "";
    $(".content").off("click").on("click", ".huifubtn", function (e) {
        if (datas.data.allow) {
            $.toast("管理员已禁止评论");
        } else {
            if (isLogin()) {
                if ($(this).html() === "收起") {
                    $(this).html(atext);
                    $(".huifu").remove();
                } else {
                    if ($(".huifu").length > 0) {
                        $(".huifu").parent().find(".huifubtn").html(atext);
                    }
                    atext = $(this).html();
                    $(this).html("收起");
                    $(".huifu").remove();
                    $(this).parent().append('<div class="huifu clearfix"> <input class="huifucontent"/> <b class="sendhf">回复</b> </div>');
                    $(".huifucontent").focus();
                }
            } else {
                $.toast("没有登录");
                // location="http://www.nxecw.com/user/login.html";
            }
        }
    });

    /*开始回复按钮*/
    var sendhf = true;
    $(".page-group").off("click").on("click", ".sendhf", function (e) {
        var that = $(this);
        if (that.parent().find(".huifucontent").val()) {
            if (sendhf) {
                sendhf = false;
                that.html('提交中..');
                var comment_id = that.parents('.li-info').data("id");
                var content = that.prev(".huifucontent").val().trim();
                var pid = that.parents('.zi-cz').length ? that.parents('.zi-cz').data("id") : false;
                var user = isLogin(true);
                var data = {content: content, aid: aid, comment_id: comment_id};
                pid && (data.pid = pid);
                request({
                    url: config.api.comment,
                    data: data,
                    success: function (result) {

                        if (result.code === 1) {

                            var comm_id = result.data['comment_id'];
                            var parents = that.parents(".li-info");
                            var person = "/person/" + user.uuid + ".html", nick = user.nick;

                            /*当回复成功了 执行以下代码，如果回复失败了  直接弹出提示以下  然后return即可。*/

                            var li = '<li> <div class="zi-pl-content"> <a href="' + person + '" class="zi-nick">' + nick + '</a>： ' + that.parent().find(".huifucontent").val() + ' </div> <div class="zi-cz" data-id="' + comm_id + '"> <a class="huifubtn">回复</a> · 刚刚 </div> </li>';
                            /*开始模拟将自己的回复写入网页*/
                            if (that.parents(".li-go").length > 0) {
                                parents.find(".zi-pl").show().find("ul").prepend(li);
                            } else {
                                var clickNick = that.parents(".zi-cz").parent().find(".zi-pl-content .zi-nick").eq(0);
                                parents.find(".zi-pl ul").prepend('<li> <div class="zi-pl-content"> <a href="' + person + '" class="zi-nick" style="margin-right:7px;">' + nick + '</a>回复   <a href="' + clickNick.attr("href") + '" target="_blank" class="zi-nick" style="margin-right:7px;">' + clickNick.html() + '</a> ： ' + that.parent().find(".huifucontent").val() + ' </div> <div class="zi-cz" data-id="' + comm_id + '"> <a class="huifubtn">回复</a> · 刚刚 </div> </li>');
                            }

                            $(".huifu").parent().find(".huifubtn").html(atext);
                            $(".huifu").remove();
                            sendhf = true;
                            $.toast("回复成功");
                        }

                    }
                });
            }
        } else {
            $.toast("您好像还没有编写回复内容~");
        }
    });


    /*发送评论*/
    var ifs = true;

    $(".myinfo").off("click").on("click", ".sendpl", function () {
        var that = $(this);
        if (!that.hasClass("disabled")) {
            if (!isLogin()) {
                $.toast("您还没有登陆！");
            } else {
                if (ifs) {
                    if ($("#pl_content").val()) {
                        ifs = false;
                        that.html('发送中...');
                        var content = $("#pl_content").val().trim();
                        var data = {
                            content: content,
                            aid: aid
                        };
                        request({
                            url: config.api.comment,
                            data: data,
                            loading: false,
                            success: function (result) {

                                if (result.code === 1) {
                                    var comment_id = result.data['comment_id'];
                                    $.toast(result.msg);
                                    that.html("发表评论");
                                    $(".textarea textarea").val("");
                                    ifs = true;
                                    /*模拟向网页写入数据*/
                                    var new_data = [{
                                        'id': comment_id,
                                        "avatar": isLogin(true).avatar,
                                        "nick": isLogin(true).nick,
                                        "time": "刚刚",
                                        "url": '/person/' + isLogin(true).uuid + ".html",
                                        "content": content,
                                        "up": 0,
                                        "reply_count": 0,
                                        "reply": []
                                    }];
                                    $(".new-list").show().find(".heihei").prepend(template(new_data));
                                    $(".content").scrollTop($(".s-introduce").height() + $(".a-header").height() + $(".s-header").height() + $(".article-content").height() + $(".data").height() + $(".send").height() + $(".hot-list").height() + 70);
                                }
                            }
                        });
                    } else {
                        $.toast("请填写评论内容..");
                    }
                }
            }
        } else {
            $.toast("管理员已禁止评论");
        }
    });
}

/*初始化数据方法*/
function resetData(data) {
    // $(".data .left").html('<i class="iconfont icon-dianzan"></i>' + data.good);
    // $(".data .right").html('阅读('+ data.person +')');
    if (data.pl) {
        $(".send .titles font").html(data.pl + '个评论,' + data.hf + "个回复");
    }
    var comments = comments_data(data);
    var comments_hot = comments_data(data, 1);
    var login = isLogin(true);

    if (data.allow) {
        $(".sendpl").addClass("disabled");
    }
    /*判断当前是否处于登陆状态*/
    $(".layui-layedit-iframe").parent().css("position", "relative");
    if (isLogin()) {

        $(".logineds").show().html('<a class="my-nick" href="http://www.nxecw.com/person/' + login.uuid + '.html" target="_blank"><img src="' + login.avatar + '">' + login.nick + '</a> <button onclick="exit();" class="exit">退出</button>');
        if (data.allow) {
            $(".send .textarea").append('<div style="position: absolute; width: 100%; height: 100%; left: 0; bottom: 0; background: #f9f9f9;"><div class="everyone"> 该文章已被管理员关闭评论 </div></div>');
        }
    } else {
        if (data.allow) {
            $(".send .textarea").append('<div style="position: absolute; width: 100%; height: calc(100% - 43px ); left: 0; bottom: 0; background: #f9f9f9;"><div class="everyone"> 该文章已被管理员关闭评论 </div></div>');
        } else {
            $(".send .textarea").append('<div class="closepl"><div class="everyone"> 请先<a href="http://www.nxecw.com/user/login.html">登录</a>后再评论 </div></div>');
        }
    }
    if (comments_hot && comments_hot.length > 0) {
        $(".hot-list .heihei").append(template(comments_hot)).parent().show();
    }
    if (comments && comments.length > 0) {
        $(".new-list .heihei").append(template(comments)).parent().show();
    }
    if (data.pages > 1) {
        $(".showMore").css("display", "block").data('page', 1);
    }
}


function isPhone(v) {
    return /^0?(13|14|15|17|18|19)[0-9]{9}$/.test(v);
}

function isEmail(v) {
    return /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.test(v);
}

$.fn.isHide = function () {
    return $(this).offset().width <= 0 && $(this).offset().height <= 0;
};

/**
 *
 * @param {Object} config
 * @returns {boolean}
 */
$.fn.verify = function (config) {
    var arr_data = $(this).field();
    for (var key in config) {
        var item = $(this).find("[name=" + key + "]");//$("[data-verify=" + key + "]");
        msg = config[key](arr_data[key], item);
        if (typeof (msg) !== 'undefined') {
            // item.addClass("error");
            // setTimeout(function (item) {
            //     item.removeClass('error');
            // },200);
            item.focus();
            $.toast(msg);
            return false;
        }
    }
    return true;
};

$.fn.field = function () {
    var arr_data = $(this).serializeArray();
    var formData = {};
    if (arr_data.length > 0) {
        arr_data.forEach(function (item) {
            formData[item.name] = item.value;
        });
    }
    return formData;
};

/**
 * 倒计时
 * @param {Object} option
 */
$.fn.timeOut = function (option) {
    if (typeof (option) !== "object") {
        console.error("倒计时参数异常");
    }

    var btn = this;//document.querySelector(option.btn || '');

    var time = option.time || 60;
    var txt = option.text || "{s}秒";
    var objtxt = function (t) {
        btn.html(t);
    };
    console.log(btn[0].id)
    btn.on('click', function () { //touchstart

        if (!btn.disabled && !btn.hasClass(option.class || "disabled")) {

            var sd = function () {
                var timer = setInterval(function () {
                    sd = null;
                    var innerHTML = '';
                    if (time < 1) {
                        clearInterval(timer);
                        btn[0].removeAttribute('disabled');
                        btn.removeClass(option.class || "disabled");
                        innerHTML = option.endtxt || "重新发送";
                        time = option.time || 60;
                        option.end && option.end();
                        btn.html(innerHTML);
                        return;
                    } else {
                        btn.addClass(option.class || "disabled");
                        btn[0].setAttribute('disabled', true);
                        innerHTML = txt.replace("{s}", time);
                    }
                    btn.html(innerHTML);
                    time--;
                }, 1000);
            };
            option.send && option.send(sd, objtxt);
        }
    });
};


/**
 *
 * @param option
 * @returns {boolean}
 */
function request(option) {
    if (typeof (option) !== 'object') {
        console.warn("option is not a 'object'");
        return false;
    }
    if (typeof (option.loading) !== 'boolean') {
        if (typeof option.loading === 'string')
            $.showPreloader(option.loading);
        else {
            $.showIndicator();
        }
    }
    $.ajax({
        url: option.url || location.pathname,
        data: option.data || null,
        dataType: option.dataType || 'json',
        type: option.type || 'post',
        async: typeof (option.async) === 'boolean' ? option.async : true,
        success: option.success || function (res) {
            option.done && option.done(res);
            if (res.data) {
                var delay = res.data.delay || 0;
                delay && (delay *= 1000);
                res.data.redirect && (setTimeout(function () {
                    location = res.data.redirect;
                }, delay));
                res.data.reload && (option.reload = parseFloat(res.data.reload));
                if (res.data.alert) {
                    $.alert(res.msg);
                    return;
                }
            }
            res.msg && $.toast(res.msg);
        },
        complete: function (XMLHttpRequest, status) {
            if (status === 'timeout') {
                $.toast("请求超时!");
            }
            if (typeof (option.loading) !== 'boolean') {
                var ld = typeof option.loading === 'string' ? $.hidePreloader() : $.hideIndicator();
            }
            setTimeout(function () {
                var ret = option.reload || false;
                if (ret) {
                    ret = (typeof (ret === 'number')) ? ret : 0;
                    setTimeout(function () {
                        location.reload();
                    }, ret * 1000);
                }
            }, 10);
        }, error: option.error || function (e) {
            $.toast('网络异常:' + e.statusText || e.statusMessage);
        }
    });

}


//获取今天日期 格式为 m-d
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = month + seperator1 + strDate;
    return currentdate;
}

//时间格式化 将Y-m-d H:i:s转成m-d
function formt_md(old_time) {
    var strs = old_time.split(" "); //字符分割
    var strs_arr = strs[0].split("-"); //字符分割
    var m = strs_arr[1];
    var d = strs_arr[2];
    return m + "-" + d;
}

function getDateDiff(dateTimeStamp) {
    dateTimeStamp = dateTimeStamp.replace(/\-/g, "/");

    if (dateTimeStamp !== '刚刚') {
        var dt = new Date(dateTimeStamp).getTime();
        if (dt) {
            dateTimeStamp = dt;
        } else {
            return dateTimeStamp;
        }
    }
    var result = 0;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
}

function saveUserHead(value) {
    request({
        data: {avatar: value}, done: function (result) {
            if (result.code) {
                $(".user-img").attr("src", result.data.src);
            }
            $.closeModal('.popup-trim');
        }
    });
}

/*评论列表模板*/
function template(data) {
    var html = "";

    data.forEach(function (item, index) {
        var zi = "";
        var morebtn = '';
        if (item.reply.length > 2) {
            morebtn = '<a href="javaScript:void(0)" class="zi-loadmore">查看更多回复</a>';
        }
        item.reply.forEach(function (items, indexs) {
            var HDReply = indexs > 1 ? "hidden" : "";
            zi += '<li ' + HDReply + '>\
				<div class="zi-pl-content">\
				<a href="http://www.nxecw.com/person/' + items.uuid + '.html" class="zi-nick">' + items.nick + '</a>';
            item.reply.forEach(function (items2, indexs2) {
                if (items.pid === items2.id) {
                    zi += ' 回复 <a href="http://www.nxecw.com/person/' + items2.uuid + '.html" class="zi-nick">' + items2.nick + '</a>';
                }
            });
            zi += '：  ' + items.content + '\
				</div>\
				<div class="zi-cz" data-id="' + items.id + '"> <a class="huifubtn">回复</a> · ' + getDateDiff(items.time) + ' </div>\
			</li>';
        });

        var rank = "";
        var uuid = $(".athuor").attr("data-uuid");
        if (uuid === item.uuid) {
            rank = '<em style="font-weight: normal;font-style: normal;background: #4bc4ff; margin-left: 8px; margin-right: -8px; color: #ffffff; padding: 2px 4px; font-size: 12px; line-height: 13px; border-radius: 1px; height: 16px; display: inline-block; vertical-align: middle; margin-top: -4px;">作者</em>';
        } else if (item.rank == "管理员" || item.rank == "金牌作者") {
            rank = '<em style="font-weight: normal; margin-left: 11px; font-style: normal; background: #ff6d6d; color: #ffffff; padding: 2px 4px; font-size: 12px; line-height: 13px; border-radius: 1px; height: 16px; display: inline-block; vertical-align: middle; margin-top: -4px;">' + item.rank + '</em>';
        }
        html += '<li class="clearfix">\
			<a href="http://www.nxecw.com/person/' + item.uuid + '.html" class="li-img"> <img src="' + item.avatar + '"  onerror="this.src=\'http://www.nxecw.com/public/images/userhead/efault.png\';"> </a>\
			<div class="li-info" data-id="' + item.id + '">\
				<a href="/person/' + item.uuid + '.html" class="li-nick">' + item.nick + rank + ' <i>' + getDateDiff(item.time) + '</i></a>\
				<div class="li-content">' + item.content + '</div>\
				<div class="zi-pl" ' + (item.reply.length > 0 ? "" : "hidden") + '>\
					<ul>' + zi + '</ul>' + morebtn + '\
				</div>\
				<div class="li-go">\
					<a class="huifubtn"><i class="iconfont icon-message"></i>回复</a>\
					<a href="javaScript:void(0);" class="li-dz"><i class="iconfont icon-dianzan"></i>' + item.up + '</a>\
				</div>\
			</div>\
		</li>';
    });
    return html;
}

/*返回按钮操作*/
$("body").on("click", ".back", function () {
    console.log(document.referrer);
    console.log(window.location.href);
    //
    if (document.referrer) {
        if (window.location.href == document.referrer) {
            location = '/';
        } else {
            window.location = document.referrer;
        }
    } else {
        window.location = '/';
    }
});

function setCookie(name, value, time) {
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + "; path=/;expires=" + exp.toGMTString();
};

function getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
};
Array.prototype.ArrDelVal = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}
