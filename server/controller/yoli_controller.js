const uu_request = require('../utils/uu_request');
const uuidV1 = require('uuid/v1');
var eventproxy = require('eventproxy');
var service_info = "ioio youli service";
var youli_service = "http://211.149.248.241:17002";
var path = require('path');
var fs = require('fs');


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
//获取商家预约信息
var get_order_infos = function(id,cb){
	var url = youli_service + "/shop/orders/daiqueren?tenant_id=" + id;
	do_get_method(url,cb);
};
//待确认信息
var daiqueren = function(id,cb){
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
//获取登入用户信息
var get_login_user = function(user_id,cb){
	var url = youli_service + "/shop/user/" + user_id;
	do_get_method(url,cb);
};
//获取未上架项目信息
var unshelve_projects = function(id,cb){
	var url = youli_service + "/shop/unshelve_projects?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取未审核项目信息
var shelve_projects = function(id,cb){
	var url = youli_service + "/shop/shelve_projects?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取已发布项目信息
var approve_projects = function(id,cb){
	var url = youli_service + "/shop/approve_projects?tenant_id=" + id;
	do_get_method(url,cb);
};
//客户预约列表
var customer_order = function(id,cb){
	var url = youli_service + "/shop/orders/yiyuyue?tenant_id=" + id;
	do_get_method(url,cb);
};
//查看指定项目
var check_project = function(id,cb){
	var url = youli_service + "/shop/project/" + id;
	do_get_method(url,cb);
};
exports.register = function(server, options, next){
	var search_projects_infos = function(id,user_id,cb){
		var ep =  eventproxy.create("tenant_info","project_num_info","subscribes_num_info","login_user",function(tenant_info,project_num_info,subscribes_num_info,login_user){
			cb(false,{"tenant_info":tenant_info,"project_num_info":project_num_info,"subscribes_num_info":subscribes_num_info,"login_user":login_user});
		});
		get_login_user(user_id,function(err,row){
			if (!err) {
				if (row.success) {
					var login_user = row.row;
					ep.emit("login_user", login_user);
				}else {
					ep.emit("login_user", {});
				}
			}else {
				cb(true,{"message":"search login_user wrong","service_info":service_info});
			}
		});
		get_tenant_info(id,function(err,row){
			if (!err) {
				if (row.success) {
					var tenant_info = row.row;
					ep.emit("tenant_info", tenant_info);
				}else {
					ep.emit("tenant_info", {});
				}
			}else {
				cb(true,{"message":"search tenant_info wrong","service_info":service_info});
			}
		});
		project_detail_number(id,function(err,row){
			if (!err) {
				if (row.success) {
					var project_num_info = row.projects;
					var subscribes_num_info = row.subscribes;
					ep.emit("project_num_info", project_num_info);
					ep.emit("subscribes_num_info", subscribes_num_info);
				}else {
					ep.emit("project_num_info", {});
					ep.emit("subscribes_num_info", {});
				}
			}else {
				cb(true,{"message":"search num wrong","service_info":service_info});
			}
		});
	};
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
		//后台管理
		{
			method: 'GET',
			path: '/background',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						return reply.view("background_management",{"results":results});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
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
				data.tenant_code = request.payload.tenant_code;
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
		//未上架项目列表
		{
			method: 'GET',
			path: '/unshelve_projects',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						unshelve_projects(id, function(err,rows){
							if (!err) {
								if (rows.success) {
									console.log(rows);
									return reply.view("unshelve_projects",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//未审核项目列表
		{
			method: 'GET',
			path: '/shelve_projects',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						shelve_projects(id, function(err,rows){
							if (!err) {
								if (rows.success) {
									console.log(rows);
									return reply.view("shelve_projects",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//已发布项目列表
		{
			method: 'GET',
			path: '/approve_projects',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						approve_projects(id, function(err,rows){
							if (!err) {
								if (rows.success) {
									console.log(rows);
									return reply.view("approve_projects",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//客户已预约列表
		{
			method: 'GET',
			path: '/customer_order',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						customer_order(id, function(err,rows){
							console.log("rows:"+JSON.stringify(rows));
							if (!err) {
								if (rows.success) {
									console.log(rows);
									return reply.view("customer_order",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家待确认列表
		{
			method: 'GET',
			path: '/daiqueren',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						daiqueren(id, function(err,rows){
							console.log("rows:"+JSON.stringify(rows));
							if (!err) {
								if (rows.success) {
									console.log(rows);
									return reply.view("daiqueren",{"rows":rows.rows,"results":results,"service_info":service_info});
								}else {
									return reply({"success":false,"message":"search wrong","service_info":service_info});
								}
							}else {
								return reply({"success":false,"message":"search wrong","service_info":service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
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
		//添加项目图片
		{
			method: 'GET',
			path: '/add_picture',
			handler: function(request, reply){
				var data = {};
				// data.project_id = request.payload.project_id;
				data.project_id = 7;
				data.image_src = "";
				data.is_main_image = 0;
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
		//登入后一个页面
		{
			method: 'GET',
			path: '/upload',
			handler: function(request, reply){
				var cookie_id = get_cookie_id(request);
				if (!cookie_id) {
					return reply.redirect("/login");
				}
				return reply.view("upload");
			}
		},

		//处理上传文件
		{
			method: 'POST',
			path: '/do_upload',
			config: {
				payload: {
				   output: 'file',
				   maxBytes: 209715200,
				   parse: true //or just remove this line since true is the default
				},
				handler:function (request, reply) {
					var filepath = request.payload.files.path;
					var out_name = path.extname(request.payload.files.filename);
					console.log("payload:"+JSON.stringify(request.payload));
					fs.readFile(filepath, function (err, data) {
						var filename = uuidV1() + out_name;
						var newPath = __dirname + '/' + filename;
						console.log(newPath);
						fs.writeFile(newPath, data, function (err) {
							return reply({"src":filename});
						});
					});
				}
			},
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
