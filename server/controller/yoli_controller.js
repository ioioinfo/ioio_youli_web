const uu_request = require('../utils/uu_request');
const uuidV1 = require('uuid/v1');
var service_info = "ioio youli service";
var youli_service = "http://211.149.248.241:17002";

var do_get_method = function(url,cb){
	uu_request.get(url, function(err, response, body){
		if (!err && response.statusCode === 200) {
			var content = JSON.parse(body);
			cb(false, content);
		} else {
			cb(true, null);
		}
	});
};
var do_post_method = function(data,url,cb){
	uu_request.request(url, data, function(err, response, body) {
		console.log(body);
		if (!err && response.statusCode === 200) {
			cb(false,body);
		} else {
			cb(true,null);
		}
	});
};
//获取当前cookie cookie_id
var get_cookie_id = function(request){
	var cookie_id;
	if (request.state && request.state.cookie) {
		var cookie = request.state.cookie;
		if (cookie.cookie_id) {
			cookie_id = cookie.cookie_id;
		}
	}
	return cookie_id;
};
//登入检查
var login_check = function(data,cb){
	var url = youli_service + "/shop/login_check";
	do_post_method(data,url,cb);
};
//确认订单
var confirm_order = function(data,cb){
	var url = youli_service + "/shop/orders/shangjia_confirm";
	do_post_method(data,url,cb);
};
//项目上架
var up_project = function(data,cb){
	var url = youli_service + "/shop/project/shelve";
	do_post_method(data,url,cb);
};
//项目下架
var down_project = function(data,cb){
	var url = youli_service + "/shop/project/unshelve";
	do_post_method(data,url,cb);
};
//获取当前cookie 商家id 信息
var get_cookie_id = function(request){
	var id;
	if (request.state && request.state.cookie) {
		var cookie = request.state.cookie;
		if (cookie.id) {
			id = cookie.id;
		}
	}
	return id;
};
//获取当前cookie 当前用户user_id 信息
var get_user_id = function(request){
	var user_id;
	if (request.state && request.state.cookie) {
		var cookie = request.state.cookie;
		if (cookie.user_id) {
			user_id = cookie.user_id;
		}
	}
	return user_id;
};
//获取商家信息
var get_tenant_info = function(id,cb){
	var url = youli_service + "/shop/profile?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家商品项目信息
var get_project_infos = function(id,cb){
	var url = youli_service + "/shop/projects?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家预约信息
var get_order_infos = function(id,cb){
	var url = youli_service + "/shop/orders/daiqueren?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家已确认信息
var make_sure_infos = function(id,cb){
	var url = youli_service + "/shop/orders/yiqueren?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家已完成项目
var finish_project_infos = function(id,cb){
	var url = youli_service + "/shop/orders/yiwancheng?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家申诉项目
var appeal_project_infos = function(id,cb){
	var url = youli_service + "/shop/orders/shensuzhong?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取项目详细数量
var project_detail_number = function(id,cb){
	var url = youli_service + "/shop/summary?tenant_id=" + id;
	do_get_method(url,cb);
};

//查看指定项目
var check_project = function(id,cb){
	var url = youli_service + "/shop/project/" + id;
	do_get_method(url,cb);
};
exports.register = function(server, options, next){
	server.route([
		//后台店家登入接口
		{
			method: 'GET',
			path: '/login',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					cookie_id = uuidV1();
				}
				var cookie = request.state.cookie;
				if (!cookie) {
					cookie = {};
				}
				cookie.cookie_id = cookie_id;
				return reply.view("pc_login").state('cookie', cookie, {ttl:10*365*24*60*60*1000});
			}
		},
		//登入验证
		{
			method: 'POST',
			path: '/do_login',
			handler: function(request, reply){
				var data = {};
				data.username = request.payload.username;
				data.password = request.payload.password;
				data.tenant_code = "001";
				login_check(data, function(err,row){
					if (!err) {
						if (row.success) {
							var id = row.row.id;
							var user_id = row.user_id;
							var cookie = request.state.cookie;
							if (!cookie) {
								return reply({"success":false});
							}
							cookie.id = id;
							cookie.user_id = user_id;
							return reply({"success":true,"service_info":service_info,"service_info":service_info}).state('cookie', cookie, {ttl:10*365*24*60*60*1000});
						}else {
							return reply({"success":false,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"service_info":service_info});
					}
				});
			}
		},
		//商家信息
		{
			method: 'GET',
			path: '/tenant_info',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = get_cookie_id(request);
				get_tenant_info(id, function(err,row){
					if (!err) {
						if (row.success) {
							console.log(row);
							return reply({"success":true,"tenant_info":row.row,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家项目列表信息
		{
			method: 'GET',
			path: '/project_infos',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = get_cookie_id(request);
				get_project_infos(id, function(err,rows){
					if (!err) {
						if (rows.success) {
							console.log(rows);
							return reply({"success":true,"project_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家预约列表信息
		{
			method: 'GET',
			path: '/project_order_infos',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = get_cookie_id(request);
				get_order_infos(id, function(err,rows){
					if (!err) {
						if (rows.success) {
							console.log(rows);
							return reply({"success":true,"order_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家已确认
		{
			method: 'GET',
			path: '/make_sure_infos',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = get_cookie_id(request);
				make_sure_infos(id, function(err,rows){
					if (!err) {
						if (rows.success) {
							console.log(rows);
							return reply({"success":true,"make_sure_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家已完成列表
		{
			method: 'GET',
			path: '/finish_project_infos',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = get_cookie_id(request);
				finish_project_infos(id, function(err,rows){
					if (!err) {
						if (rows.success) {
							console.log(rows);
							return reply({"success":true,"finish_project_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家申诉列表
		{
			method: 'GET',
			path: '/appeal_project_infos',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = get_cookie_id(request);
				appeal_project_infos(id, function(err,rows){
					if (!err) {
						if (rows.success) {
							console.log(rows);
							return reply({"success":true,"appeal_project_infos":rows.rows,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家项目查看
		{
			method: 'GET',
			path: '/check_project',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = request.query.id;
				check_project(id, function(err,row){
					if (!err) {
						if (row.success) {
							console.log(row);
							return reply({"success":true,"project_info":row.project,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//查看项目数量
		{
			method: 'GET',
			path: '/project_detail_number',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				var id = cookie_id;
				project_detail_number(id, function(err,row){
					if (!err) {
						if (row.success) {
							console.log(row);
							return reply({"success":true,"project_info":row.projects,"subscribes_info":row.subscribes,"service_info":service_info});
						}else {
							return reply({"success":false,"message":"search wrong","service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"search wrong","service_info":service_info});
					}
				});
			}
		},
		//商家确认接口
		{
			method: 'POST',
			path: '/confirm_order',
			handler: function(request, reply){
				var data = {};
				data.project_subscribe_id = request.payload.project_subscribe_id;
				data.contract_amount = request.payload.contract_amount;
				console.log("data:"+JSON.stringify(data));
				confirm_order(data, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"service_info":service_info});
						}else {
							return reply({"success":false,"message":rows.message,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"operation wrong","service_info":service_info});
					}
				});
			}
		},
		//商品上架
		{
			method: 'POST',
			path: '/up_project',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = {};
				data.project_id = request.payload.project_id;
				data.user_id = user_id;
				console.log("data:"+JSON.stringify(data));
				up_project(data, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"service_info":service_info});
						}else {
							return reply({"success":false,"message":rows.message,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"operation wrong","service_info":service_info});
					}
				});
			}
		},
		//商品下架
		{
			method: 'POST',
			path: '/down_project',
			handler: function(request, reply){
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = {};
				data.project_id = request.payload.project_id;
				data.user_id = user_id;
				console.log("data:"+JSON.stringify(data));
				down_project(data, function(err,rows){
					if (!err) {
						if (rows.success) {
							return reply({"success":true,"service_info":service_info});
						}else {
							return reply({"success":false,"message":rows.message,"service_info":service_info});
						}
					}else {
						return reply({"success":false,"message":"operation wrong","service_info":service_info});
					}
				});
			}
		},
		//创建项目
		{
			method: 'POST',
			path: '/add_project',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				return reply.view("pc_login").state('cookie', cookie, {ttl:10*365*24*60*60*1000});
			}
		},

	]);

    next();
};

exports.register.attributes = {
    name: 'yoli_controller'
};
