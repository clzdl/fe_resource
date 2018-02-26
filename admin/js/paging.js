layui.define(['layer', 'laypage', 'laytpl'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		layer = layui.layer,
		laytpl = layui.laytpl;

	var Paging = function() {
		this.config = {
			url: undefined, //数据远程地址
			type: 'POST', //数据的获取方式  get or post
			elem: undefined, //内容容器
			params: null,
			tempElem: undefined, //模板容器
			paged: true,
			pageConfig: { //参数应该为object类型
				elem: undefined,
				pageSize:15
			},
			isProcessLock: true,  ///动态加载数据时，是否琐屏  
			popLayIndex: undefined,    ///动态弹出的涂层索引
			success: function(d){
				var pager = $('#'+this.pageConfig.elem);
				if(d.count <= this.pageConfig.pageSize){
					pager.hide();
					return ;
				}
				if(pager && pager.html()){
					pager.prepend('<div class="layui-box layui-laypage layui-laypage-default"><span class="layui-laypage-curr"><em class="layui-laypage-em"></em><em>共计：'+d.count+' 条数据</em></span></div>');
				}
			}, //type:function
			
			fail: undefined, //type:function
			complate: undefined, //type:function
			serverError: function(xhr, status, error) { //ajax的服务错误
				throwError("错误提示： " + xhr.status + " " + xhr.statusText);
			}
		};
	};
	/**
	 * 设置
	 * @param {Object} options
	 */
	Paging.prototype.set = function(options) {
		var that = this;
		$.extend(true, that.config, options);
		return that;
	};
	/**
	 * 初始化
	 * @param {Object} options
	 */
	Paging.prototype.init = function(options) {
		var that = this;
		$.extend(true, that.config, options);
		var _config = that.config;
		if(_config.url === undefined) {
			throwError('Paging Error:请配置远程URL!');
		}
		if(_config.elem === undefined) {
			throwError('Paging Error:请配置参数elem!');
		}
		if($(_config.elem).length === 0) {
			throwError('Paging Error:找不到配置的容器elem!');
		}
		if(_config.tempElem === undefined) {
			throwError('Paging Error:请配置参数tempElem!');
		}
		if($(_config.tempElem).length === 0) {
			throwError('Paging Error:找不到配置的容器tempElem!');
		}
		if(_config.paged) {
			var _pageConfig = _config.pageConfig;
			if(_pageConfig.elem === undefined) {
				throwError('Paging Error:请配置参数pageConfig.elem!');
			}
		}
		if(_config.type.toUpperCase() !== 'GET' && _config.type.toUpperCase() !== 'POST') {
			throwError('Paging Error:type参数配置出错，只支持GET或都POST');
		}
		that.get({
			pageIndex: 1,
			pageSize: _config.pageConfig.pageSize
		});

		return that;
	};
	/**
	 * 获取数据
	 * @param {Object} options
	 */
	Paging.prototype.get = function(options) {
		var that = this;
		var _config = that.config;
		//默认参数
		var df = {
			pageIndex:1,
			pageSize:_config.pageConfig.pageSize
		};
		
		$.extend(true, df,options, _config.params);
		$.ajax({
			type: _config.type,
			url: _config.url,
			data: df,
			dataType: 'json',
			beforeSend: function(){
				if(_config.isProcessLock){
					_config.popLayIndex = layer.load(1, {
						  shade: [0.5,'#d2d2d2'] //0.1透明度的灰色背景
						});
				}
			},
			success: function(result, status, xhr) {
				if(result.flag === 1 && result.data) {
					//获取模板
					var tpl = $(_config.tempElem).html();
					//渲染数据
					laytpl(tpl).render(result.data, function(html) {
						$(_config.elem).html(html);
					});
					if(_config.paged) {
						if(result.data.count === null ) {
							throwError('Paging Error:请返回数据总数！');
							return;
						}
						var _pageConfig = _config.pageConfig;

						var defaults = {
							elem: _pageConfig.elem,
							curr: df.pageIndex,
							count: result.data.count,
							limit: _config.pageConfig.pageSize,
							jump: function(obj, first) {
								//得到了当前页，用于向服务端请求对应数据
								if(!first) {
									$.extend(true, options, {
										pageIndex: obj.curr,
										pageSize:  obj.limit
									});
									that.get(options);
								}
							}
						};
						$.extend(defaults, _pageConfig);
						//layui.laypage(defaults);
						layui.laypage.render(defaults);
					}
					_config.success(result.data); //渲染成功
				} else {
					_config.fail(result.errorMsg); //获取数据失败
				}
				_config.complate(); //渲染完成
				
				if(_config.isProcessLock){
					layer.close(_config.popLayIndex);
				}
			},
			error: function(xhr, status, error) {
				_config.serverError(xhr, status, error); //服务器错误
				if(_config.isProcessLock){
					layer.close(_config.popLayIndex);
				}
			}
		});
	};
	/**
	 * 抛出一个异常错误信息
	 * @param {String} msg
	 */
	function throwError(msg) {
		throw new Error(msg);
		return;
	};

	var paging = new Paging();
	exports('paging', function(options) {
		return paging.set(options);
	});
});
