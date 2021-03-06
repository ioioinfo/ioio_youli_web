const uu_request = require('../utils/uu_request');
const uuidV1 = require('uuid/v1');
var eventproxy = require('eventproxy');
var service_info = "ioio youli service";
var youli_service = "http://211.149.248.241:17002";
var path = require('path');
var fs = require('fs');

var state = {
	"yiyuyue":"已预约",
	"wancheng":"完成",
	"shensuzhong":"申诉中",
	"yiqueren":"已确认",
	"yijujue":"已拒绝"
};
var state_map = {
	"edit" : "新建",
	"shelve" : "上架",
	"approve" : "发布"
};

var do_get_method = function(url,cb){
	uu_request.get(url, function(err, response, body){
		if (!err && response.statusCode === 200) {
			var content = JSON.parse(body);
			do_result(false, content, cb);
		} else {
			cb(true, null);
		}
	});
};
var do_post_method = function(data,url,cb){
	uu_request.request(url, data, function(err, response, body) {
		console.log(body);
		if (!err && response.statusCode === 200) {
			do_result(false, body, cb);
		} else {
			cb(true,null);
		}
	});
};
var do_result = function(err,result,cb){
	if (!err) {
		if (result.success) {
			cb(false,result);
		}else {
			cb(true,result);
		}
	}else {
		cb(true,null);
	}
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
//保存项目
var save_project = function(data,cb){
	var url = youli_service + "/shop/project/add";
	do_post_method(data,url,cb);
};
//保存图片
var save_pictures = function(data,cb){
	var url = youli_service + "/shop/project_image/add";
	do_post_method(data,url,cb);
}
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
//待确认信息
var daiqueren = function(id,cb){
	var url = youli_service + "/shop/orders/daiqueren?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家已确认信息
var yiqueren = function(id,cb){
	var url = youli_service + "/shop/orders/yiqueren?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家已完成项目
var yiwancheng = function(id,cb){
	var url = youli_service + "/shop/orders/yiwancheng?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家已拒绝项目
var yijujue = function(id,cb){
	var url = youli_service + "/shop/orders/yijujue?tenant_id=" + id;
	do_get_method(url,cb);
};
//获取商家申诉项目
var shensuzhong = function(id,cb){
	var url = youli_service + "/shop/orders/is_shensu?tenant_id=" + id;
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
//查询所有项目
var project_list = function(tenant_id,cb){
	var url = youli_service + "/shop/all_projects?tenant_id=" + tenant_id;
	do_get_method(url,cb);
};
//商户账号创建
var tenant_user_create = function(data,cb){
	var url = youli_service + "/shop/tenant_user/create";
	do_post_method(data,url,cb);
};
//商户账号查询
var tenant_user_list = function(tenant_id,cb){
	var url = youli_service + "/shop/tenant_user/list?tenant_id="+tenant_id;
	do_get_method(url,cb);
};
//商户账号更新
var tenant_user_update = function(data,cb){
	var url = youli_service + "/shop/tenant_user/update";
	do_post_method(data,url,cb);
};
//商户账号删除
var tenant_user_delete = function(data,cb){
	var url = youli_service + "/shop/tenant_user/delete";
	do_post_method(data,url,cb);
};
//改变推荐人是否有效接口
var change_recommender_valid = function(data,cb){
	var url = youli_service + "/shop/orders/change_recommender_valid"
	do_post_method(data,url,cb);
}
var refuse = function(data,cb){
	var url = youli_service + "/shop/orders/shangjia_reject"
	do_post_method(data,url,cb);
}
//返利统计
var list_wancheng_subscribes = function(tenant_id,cb){
	var url = youli_service + "/bi/list_wancheng_subscribes?tenant_id=" + tenant_id;
	do_get_method(url,cb);
};
var list_wancheng_subscribes_date = function(tenant_id,begin_date,end_date,cb){
	var url = youli_service + "/bi/list_wancheng_subscribes?tenant_id=" + tenant_id+ "&begin_date=" +begin_date +"&end_date="+end_date;
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
				console.log("row:"+JSON.stringify(row));
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
		//商家商户账号删除
		{
			method: 'POST',
			path: '/refuse',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var project_subscribe_id = request.payload.id;
				var reject_reason = request.payload.reason;
				if (!project_subscribe_id || !reject_reason) {
					return reply({"success":false,"message":"params wrong!"});
				}
				var data = {"project_subscribe_id":project_subscribe_id,"reject_reason":reject_reason};
				refuse(data,function(err,content){
					if (!err) {
						return reply({"success":true});
					}else {
						return reply({"success":false,"message":content.message});
					}
				});
			}
		},
		//推荐人有效的 接口
		{
			method: 'POST',
			path: '/change_recommender_valid',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var is_valid = request.payload.is_valid;
				var project_id = request.payload.id;
				if (!is_valid||!id) {
					return reply({"success":false,"message":"params wrong"});
				}
				var data = {"id":project_id,"user_id":user_id,"is_valid":is_valid};
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						change_recommender_valid(data,function(err,result){
							if (!err) {
								return reply({"success":true,"message":"ok"});
							}else {
								return reply({"success":false,"message":result.message});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家商户账号查询
		{
			method: 'GET',
			path: '/tenant_user_list',
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
						tenant_user_list(id,function(err,rows){
							if (!err) {
								return reply({"success":true,"rows":rows.rows});
							}else {
								return reply({"success":false,"message":results.message});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家商户账号删除
		{
			method: 'POST',
			path: '/tenant_user_delete',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = request.payload.data;
				data = JSON.parse(data);
				tenant_user_delete(data,function(err,row){
					if (!err) {
						return reply({"success":true});
					}else {
						return reply({"success":false,"message":results.message});
					}
				});
			}
		},
		//商家商户账号修改
		{
			method: 'POST',
			path: '/tenant_user_update',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = request.payload.data;
				data = JSON.parse(data);
				tenant_user_update(data,function(err,row){
					if (!err) {
						return reply({"success":true});
					}else {
						return reply({"success":false,"message":row.message});
					}
				});
			}
		},
		//商家商户账号新建
		{
			method: 'POST',
			path: '/tenant_user_create',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = request.payload.data;
				data = JSON.parse(data);
				tenant_user_create(data,function(err,row){
					console.log("row:"+JSON.stringify(row));
					if (!err) {
						return reply({"success":true,"tenant_user_id":row.tenant_user_id});
					}else {
						return reply({"success":false,"message":row.message});
					}
				});
			}
		},
		//商家项目列表 project_list
		{
			method: 'GET',
			path: '/',
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
						project_list(id,function(err,rows){
							if (!err) {
								return reply.view("project_list",{"rows":rows.rows,"results":results,"state_map":state_map});
							}else {
								return reply({"success":false,"message":rows.message,"results":results,"service_info":rows.service_info});
							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
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
							return reply({"success":false,"service_info":service_info,"message":row.message});
						}
					}else {
						return reply({"success":false,"service_info":service_info,"message":row.message});
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
				daiqueren(id, function(err,rows){
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
									for (var i = 0; i < rows.rows.length; i++) {
										var project = rows.rows[i];
										if (project.recommender_wx_user) {
										    if (project.recommender_valid != 1) {
											    project.wx_user.mobile  = project.wx_user.mobile.substring(0,project.wx_user.mobile.length-2)+"**";
                                            }
										}
										// if (project.recommender_wx_user) {
										// 	if (project.recommender_valid != 1) {
										// 		project.recommender_wx_user.mobile = project.recommender_wx_user.mobile.substring(0,project.recommender_wx_user.mobile.length-2)+"**";
										// 	}
										// }
									}
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
							if (!err) {
								if (rows.success) {
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
			path: '/yiqueren',
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
						yiqueren(id, function(err,rows){
							console.log("rows:"+JSON.stringify(rows));
							if (!err) {
								if (rows.success) {
									console.log(rows);
									return reply.view("yiqueren",{"rows":rows.rows,"results":results,"service_info":service_info});
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
		//商家已完成列表
		{
			method: 'GET',
			path: '/yiwancheng',
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
						yiwancheng(id, function(err,rows){
							console.log("rows:"+JSON.stringify(rows));
							if (!err) {
								if (rows.success) {
									console.log(rows);
									return reply.view("yiwancheng",{"rows":rows.rows,"results":results,"service_info":service_info});
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
		//商家已拒绝列表
		{
			method: 'GET',
			path: '/yijujue',
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
						yijujue(id, function(err,rows){
							console.log("rows:"+JSON.stringify(rows));
							if (!err) {
								if (rows.success) {
									console.log(rows);
									return reply.view("yijujue",{"rows":rows.rows,"results":results,"service_info":service_info});
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
		//商家申诉列表
		{
			method: 'GET',
			path: '/shensuzhong',
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
						shensuzhong(id, function(err,rows){

							if (!err) {
								if (rows.success) {
									for (var i = 0; i < rows.rows.length; i++) {
										rows.rows[i].state = state[rows.rows[i].state];
									}
									return reply.view("shensuzhong",{"rows":rows.rows,"results":results,"service_info":service_info});
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
		//返利统计
		{
			method: 'GET',
			path: '/fanli_tongji',
			handler: function(request, reply){
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				console.log("id:"+id);
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var begin_date = request.query.begin_date;
				var end_date = request.query.end_date;
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						if (!begin_date||!end_date) {
							list_wancheng_subscribes(id,function(err,rows){
								if (!err) {
									console.log("rows:"+JSON.stringify(rows));
									return reply.view("fanli_tongji",{"rows":rows.rows,"service_info":service_info,"results":results});
								}else {
									return reply({"success":false,"message":rows.message,"service_info":results.service_info});
								}
							});
						}else {
							list_wancheng_subscribes_date(id,begin_date,end_date,function(err,rows){
								if (!err) {
									return reply.view("fanli_tongji",{"rows":rows.rows,"service_info":service_info,"results":results});
								}else {
									return reply({"success":false,"message":rows.message,"service_info":results.service_info});
								}
							});
						}
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//商家信息
		{
			method: 'GET',
			path: '/tenant',
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
						get_tenant_info(id, function(err,row){
							if (!err) {
								if (row.success) {
									console.log(row);
									return reply.view("tenant",{"row":row.row,"results":results,"service_info":service_info});
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
		//项目新增
		{
			method: 'GET',
			path: '/add_project',
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
						return reply.view("add_project",{"results":results,"service_info":service_info});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
					}
				});
			}
		},
		//清空cookie 退出
		{
			method: 'GET',
			path: '/logout',
			handler: function(request, reply){
				var cookie = request.state.cookie;
				delete cookie.id;
				return reply.redirect("/login").state('cookie',cookie,{});
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
				yiqueren(id, function(err,rows){
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
				yiwancheng(id, function(err,rows){
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
				shensuzhong(id, function(err,rows){
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
		//项目保存
		{
			method: 'POST',
			path: '/save_project',
			handler: function(request, reply){
				var project_infos = JSON.parse(request.payload.project_infos);
				var id = get_cookie_id(request);
				if (!id) {
					return reply.redirect("/login");
				}
				var user_id = get_user_id(request);
				if (!user_id) {
					return reply.redirect("/login");
				}
				var data = {};
				if (project_infos.fanli_fangshi == "fanli_bili") {
					project_infos.fanli_fangshi = "百分比";
				}else {
					project_infos.fanli_fangshi = "固定金额";
				}
				if (project_infos.tuijian_fanli_fangshi == "tuijian_fanli_bili") {
					project_infos.tuijian_fanli_fangshi = "百分比";
				}else {
					project_infos.tuijian_fanli_fangshi = "固定金额";
				}
				var project_data = {
					tenant_id : id,
                	user_id : user_id,
                	name : project_infos.name,
                	fanli_fangshi : project_infos.fanli_fangshi,
                	fanli_bili : project_infos.fanli_bili,
                	fanli_jine : project_infos.fanli_jine,
                	tuijian_fanli_fangshi : project_infos.tuijian_fanli_fangshi,
                	tuijian_fanli_bili : project_infos.tuijian_fanli_bili,
                	tuijian_fanli_jine : project_infos.tuijian_fanli_jine,
                	phone : project_infos.phone,
                	description : project_infos.description,
                	xiangmuyoushi : project_infos.xiangmuyoushi,
                	address : project_infos.address,
					price_text : project_infos.price_text
				};
				console.log("project_data:"+JSON.stringify(project_data));
				search_projects_infos(id,user_id,function(err,results){
					if (!err) {
						save_project(project_data,function(err,content){
							if (!err) {
								if (content.success) {
									for (var i = 0; i < project_infos.images.length; i++) {
										var img_data = {};
										img_data = {
											"project_id" : content.project_id,
											"image_src" : project_infos.images[i],
										};
										if (i==0) {
											img_data.is_main_image = 1;
										}else {
											img_data.is_main_image = 0;
										}
										save_pictures(img_data,function(err,result){
											if (!err) {

											}else {

											}
										});
									}
								return reply({"success":true,"results":results,"service_info":service_info});
								}
							}else {

							}
						});
					}else {
						return reply({"success":false,"message":results.message,"service_info":results.service_info});
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
					console.log("payload:"+JSON.stringify(request.payload));
					var filepath = request.payload.files.path;
					var out_name = path.extname(request.payload.files.filename);
					console.log("payload:"+JSON.stringify(request.payload));
					fs.readFile(filepath, function (err, data) {
						var filename = uuidV1() + out_name;
						var newPath = "public/images/" +filename;
						// var newPath = __dirname + '/' + filename;
						console.log(newPath);
						fs.writeFile(newPath, data, function (err) {
							return reply({"src":filename});
						});
					});
				}
			},
		},

	]);

    next();
};

exports.register.attributes = {
    name: 'yoli_controller'
};
