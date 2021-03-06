var webtools_my = {
	objs:new Object(),
	init:function(d,config){
		this.objs.config = config;
		switch(d.data.cus){
			case 'youku':
			this.csrf_youku(d.data.vid,'ups.youku.com','03020101');
			break;
			case 'tudou':
			this.csrf_youku(d.data.vid,'ups.cp31.ott.cibntv.net','050F','DIl58SLFxFNndSV1GFNnMQVYkx1PP5tKe1siZu/86PR1u/Wh1Ptd+WOZsHHWxysSfAOhNJpdVWsdVJNsfJ8Sxd8WKVvNfAS8aS8fAOzYARzPyPc3JvtnPHjTdKfESTdnuTW6ZPvk2pNDh4uFzotgdMEFkzQ5wZVXl2Pf1/Y6hLK0OnCNxBj3+nb0v72gZ6b0td+WOZsHHWxysSo/0y9D2K42SaB8Y/+aD2K42SaB8Y/+ahU+WOZsHcrxysooUeND');
			break;
			case 'qqv':
			this.csrf_qqv(d.data.vid);
			break;
			case 'iqiyi':
			this.csrf_iqiyi(d.data.vid);
			break;
		}
	},
	csrf_iqiyi:function(vid){
		var time = webtools.gettime();
		$.ajax({
			url:'//mixer.video.iqiyi.com/jp/mixin/videos/'+vid,
			async:false,
			dataType:'text',
			success:function(d){
				var json = JSON.parse(d.replace('var tvInfoJs=',''));
				var vidm = json.vid;
				var turl = json.url;
				if(vidm == '' || json.isPurchase == 2){
					rundao.msg('资源正在路上,请等待。。。');
					return;
				}
				var param = {
					uid:'',
					cupid:'qc_100001_100102',
					src:'02020031010000000000',
					platForm:'h5',
					qdv:1,
					qdx:'n',
					qdy:'x',
					qds:0,
					__jsT:'sgve',
					t:time,
					type:'m3u8'
				};
				var url = '/jp/tmts/'+vid+'/'+vidm+'/';
				var vf = md5(url+'?'+$.param(param)+'3sj8xof48xof4tk9f4tk9ypgk9ypg5ul');
				param.vf = vf;
				$.ajax({
					url:'//cache.m.iqiyi.com'+url,
					async:false,
					data:param,
					dataType:'text',
					success:function(d){
						var json = JSON.parse(d.replace('var tvInfoJs=',''));
						if(json.code != 'A00000'){
							rundao.msg('资源正在路上,请等待。。。');
							return;
						}
						var item = json.data.vidl;
						if(item == ''){
							rundao.msg('资源正在路上,请等待。。。');
							return;
						}
						var ary = new Object();
						var arys = new Array();
						for(var key in item){
							var obj = item[key];
							if(obj.m3utx != ''){
								switch(obj.vd){
									case 96:
										arys[0] = {
											name:'流畅',
											type:'hls',
											url:obj.m3utx
										};
									break;
									case 1:
										arys[1] = {
											name:'标清',
											type:'hls',
											url:obj.m3utx
										};
									break;
									case 2:
										arys[2] = {
											name:'高清',
											type:'hls',
											url:obj.m3utx
										};
									break;
									case 4:
										arys[3] = {
											name:'超清',
											type:'hls',
											url:obj.m3utx
										};
									break;
									case 5:
										arys[4] = {
											name:'蓝光',
											type:'hls',
											url:obj.m3utx
										};
									break;
									case 10:
										arys[5] = {
											name:'原画',
											type:'hls',
											url:obj.m3utx
										};
									break;
								}
							}
						}
						ary.url = arys[arys.length-1].url;
						rundao.dplayer({data:arys,mobile:ary.url});
					}
				});
			}
		});
	},
	csrf_youku:function(vid,url,code,ckey){
		var time = webtools.gettime();
		$.ajax({
			url:'//log.mmstat.com/eg.js',
			dataType:'script',
			async:false,
			success:function(){
				var utid = window.goldlog.Etag;
				document.cookie = 'cna='+utid+';';
				$.ajax({
					url:'//'+url+'/ups/get.json',
					dataType:'jsonp',
					jsonpCallback:'json'+time,
					async:false,
					data:{
						vid:vid,
						ccode:code,
						client_ip:'192.168.1.1',
						utid:utid,
						client_ts:time,
						ckey:ckey
					},
					success:function(e){
						rundao.setimg('//gm.mmstat.com/yt/youkuplayer.fdl.send?'+$.param({
							cna:utid,
							title:e.data.video.title,
							vip:false,
							psid:e.data.ups.psid,
							Useragent:navigator.userAgent,
							ccode:code,
							log_type:3,
							t:e.data.ups.ups_ts,
							vid:e.data.video.id,
							fileid:'',
							ups_client_netip:e.data.ups.ups_client_netip
						}));
						var ary = new Object();
						var arys = new Array();
						for(var key in e.data.stream){
							var obj = e.data.stream[key];
							switch(obj.stream_type){
								case '3gphd':
									arys[0] = {
										name:'流畅',
										type:'mp4',
										url:obj.m3u8_url
									};
								break;
								case 'flvhd':
									arys[1] = {
										name:'标清',
										type:'mp4',
										url:obj.m3u8_url
									};
								break;
								case 'mp4hd':
								case 'mp4sd':
									arys[2] = {
										name:'高清',
										type:'mp4',
										url:obj.m3u8_url
									};
								break;
								case 'mp4hd2':
								case 'mp4hd2v2':
									arys[3] = {
										name:'超清',
										type:'mp4',
										url:obj.m3u8_url
									};
								break;
								case 'mp4hd3':
								case 'mp4hd3v2':
									arys[4] = {
										name:'蓝光',
										type:'mp4',
										url:obj.m3u8_url
									};
								break;
							}
						}
						ary.url = arys[arys.length-1].url;
						ary.mobile = ary.url;
						webtools.setflash(ary);
					},
					error:function(){
						rundao.msg('资源正在路上,请等待。。。');
					}
				});
			}
		});
	},
	csrf_qqv:function(vid){
		var time = webtools.gettime();
		var guid = webtools.createGUID();
		var platform = '10201';//webtools.getPlatform();
		var stdfrom = 'v1010';//webtools.getStdfrom(platform);
		webtools.getPushGuid(vid,guid,platform,'');
		$.ajax({
			url:'//vd.l.qq.com/proxyhttp',
			async:false,
			type:'POST',
			dataType:'json',
			crossDomain:!0,
			xhrFields:{
				withCredentials:!0
			},
			contentType:'text/plain',
			data:JSON.stringify({
				adparam:'',
				buid:'vinfoad',
				vinfoparam:$.param({
					charge:0,
					defaultfmt:'auto',
					otype:'json',
					guid:guid,
					flowid:webtools.createGUID()+'_'+platform,
					platform:platform,
					sdtfrom:stdfrom,
					defnpayver:1,
					appVer:'3.5.40',
					refer:'http://film.qq.com/film_index_prevue/index.html?firstVid='+vid,
					host:'film.qq.com',
					ehost:'http://film.qq.com/film_index_prevue/index.html',
					tm:time,
					spwm:4,
					vid:vid,
					defn:'mp4',
					fhdswitch:0,
					show1080p:0,
					isHLS:1,
					dtype:3,
					defsrc:1,
					encryptVer:webtools.getencrypt(),
					cKey:webtools.ckey7(vid,time,platform)
				})
			}),
			success:function(d){
				var json = webtools.strsub(d.vinfo,'QZOutputJson=','};')+'}';
				json = JSON.parse(json);
				if(json.vl.vi[0].drm == 1){
					platform = '11001';
					var qv = webtools.qv(platform,vid,stdfrom,1,time);
					$.ajax({
						url:'//h5vv.video.qq.com/getinfo',
						async:false,
						dataType:'jsonp',
						jsonpCallback:'jsonp'+time,
						data:{
							charge:0,
							defaultfmt:'auto',
							otype:'json',
							guid:guid,
							flowid:webtools.createGUID()+'_'+platform,
							platform:platform,
							sdtfrom:stdfrom,
							defnpayver:0,
							appVer:'3.3.367',
							host:'m.v.qq.com',
							ehost:'http://m.v.qq.com/play.html?vid='+vid,
							_rnd:time,
							spwm:4,
							vid:vid,
							defn:'mp4',
							fhdswitch:0,
							show1080p:0,
							isHLS:0,
							fmt:'auto',
							defsrc:1,
							dtype:1,
							clip:4,
							sphls:0,
							_qv_rmt:qv.u1,
							_qv_rmt2:qv.u2
						},
						success:function(d){
							var url = d.vl.vi[0].ul.ui[1].url+d.vl.vi[0].fn+'?sdtfrom='+stdfrom+'&guid='+guid+'&vkey='+d.vl.vi[0].fvkey.substring(0,64)+'&platform=2';
							url = url.replace('http:','');
							webtools.getPushGuid(vid,guid,platform,url);
							rundao.dplayer({data:[{
								name:'自动',
								type:'mp4',
								url:url
							}],mobile:url});
						}
					});
				}else{
					if(json.dltype == 3){
						var url = json.vl.vi[0].ul.ui[1].url+json.vl.vi[0].ul.ui[0].hls.pt;
						url = url.replace('http:','');
						url = url.replace('ltsdl.qq.com','stsws.qq.com');
						webtools.getPushGuid(vid,guid,platform,url);
						rundao.dplayer({data:[{
							name:'自动',
							type:'hls',
							url:url
						}],mobile:url});
					}else if(json.dltype == 1){
						var url = json.vl.vi[0].ul.ui[1].url+json.vl.vi[0].fn+'?sdtfrom='+stdfrom+'&guid='+guid+'&vkey='+json.vl.vi[0].fvkey+'&platform=2';
						url = url.replace('http:','');
						webtools.getPushGuid(vid,guid,platform,url);
						rundao.dplayer({data:[{
							name:'自动',
							type:'mp4',
							url:url
						}],mobile:url});
					}
				}
			}
		});
	},
	setflash:function(d){
		var isiPad = navigator.userAgent.match(/iPad|iPhone|Android|Linux|iPod/i) != null;
		if(isiPad){
			if(!rundao.isempty(d.mobile)){
				rundao.msg('当前视频不支持手机端播放,请等待管理员后续更新');
				return;
			}
			var strs = '';
			if(this.objs.config.pauto == 1)
				strs = 'autoplay="autoplay"';
			$('.player').html('<video src="'+d.mobile+'" controls="controls" '+strs+' width="100%" height="100%"></video>');
		}else{
			if(!rundao.isflash())
				return;
			var swf = this.objs.config.playerurl+'player.swf';
			var par = '';
			if(rundao.isempty(d.url)){
					par = 'f='+swf.replace('player.swf','m3u8.swf')+'&a='+encodeURIComponent(d.url)+'&c=1&h=3&s=4&lv=0';
				if(this.objs.config.pauto == 1)
					par += '&p=1';
				else
					par += '&p=0';
				rundao.setswf(swf,par);
			}else{
				rundao.msg('资源正在路上,请等待。。。');
			}
		}
	},
	getStdfrom: function(a){
		var c='v.qq.com';
		if (a && "70201" == a) return "v1104";
		if (a && "70901" == a) return "v1103";
		if (a && "3670201" == a) return "v1105";
		var b = "view.inews.qq.com" === b,
		c = c.indexOf("caixin.com") > -1;
		return c ? "v1093": this.useragent().mobile || "ke.qq.com" !== c ? this.useragent().os.iphone || this.useragent().os.ipod ? b ? "v3110": "v3010": this.useragent().os.ipad ? b ? "v4110": "v4010": this.useragent().os.android ? this.useragent().os.tablet ? "v6010": b ? "v5110": "v5010": this.useragent().browser.IEMobile ? "v7010": "v1010": "v1101"
	},
	dateFormat:function(a){
		var b = new Date(),
		a = a || "yyyy-MM-dd hh:mm:ss";
		var c = {
			"M+": b.getMonth() + 1,
			"d+": b.getDate(),
			"h+": b.getHours(),
			"m+": b.getMinutes(),
			"s+": b.getSeconds(),
			"q+": Math.floor((b.getMonth() + 3) / 3),
			S: b.getMilliseconds()
		};
		/(y+)/.test(a) && (a = a.replace(RegExp.$1, (b.getFullYear() + "").substr(4 - RegExp.$1.length)));
		for (var d in c) new RegExp("(" + d + ")").test(a) && (a = a.replace(RegExp.$1, 1 == RegExp.$1.length ? c[d] : ("00" + c[d]).substr(("" + c[d]).length)));
		return a
	},
	getPushGuid:function(vid,guid,platform,url){
		var reportUrls = new Array(),
			ctime = this.dateFormat("yyyy-MM-dd hh:mm S");
		if(url == ''){
			reportUrls.push("//tj.video.qq.com/fcgi-bin/set_cookie?"+$.param({
				lv_irt_id:'',
				dm:'v.qq.com',
				ua:navigator.userAgent,
				r:'',
				vid:vid,
				sr:'1600x900',
				ul:'zh-CN',
				tv:'0.0.7',
				pt:'腾讯视频',
				guid:guid,
				url:'//film.qq.com/film_index_prevue/index.html?firstVid='+vid,
				from:'//film.qq.com/film_index_prevue/index.html?firstVid='+vid,
				playing_url:''
			}));
			reportUrls.push("//btrace.video.qq.com/kvcollect?"+$.param({
				BossId:'3717',
				Pwd:'1055758521',
				version:'3.3.367',
				uid:guid,
				pid:guid,
				vid:vid,
				player_type:'h5',
				video_type:1,
				platform:platform,
				usr_action:'pause',
				usr_action_detail:'',
				url:'//film.qq.com/film_index_prevue/index.html?firstVid='+vid,
				vid:vid,
				ptag:'v.qq.com#v.play.adaptor#2',
				mreferrer:'//v.qq.com/',
				start:0
			}));
			reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4501&Pwd=142347456&loginid=&loginex=&logintype=0&guid="+guid+"&longitude=&latitude=&vip=0&online=1&p2p=0&downloadkit=0&resolution=1280*720*1.5&testid=&osver=windows+10.0&playerver=&playertype=1&uip=&confid=&cdnip=&cdnid=&cdnuip=&freetype=&sstrength=&network=&speed=&device=&appver=3.3.367&p2pver=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&refer=&ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ptag=&flowid="+guid+"_"+platform+"&platform="+platform+"&dltype=1&vid="+vid+"&fmt=&rate=&clip=&status=&type=&duration=&data=%7B%22code%22%3A%22%22%2C%22stime%22%3A1508894110924%7D&step=0&seq=0");
            reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4501&Pwd=142347456&loginid=&loginex=&logintype=0&guid="+guid+"&longitude=&latitude=&vip=0&online=1&p2p=0&downloadkit=0&resolution=1280*720*1.5&testid=&osver=windows+10.0&playerver=&playertype=1&uip=&confid=&cdnip=&cdnid=&cdnuip=&freetype=&sstrength=&network=&speed=&device=&appver=3.3.367&p2pver=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&refer=&ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ptag=&flowid="+guid+"_"+platform+"&platform="+platform+"&dltype=1&vid="+vid+"&fmt=&rate=&clip=&status=&type=&duration=&data=%7B%22stime%22%3A1508894111146%2C%22etime%22%3A1508894111834%2C%22code%22%3A%22%22%7D&step=5&seq=1");
            reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4298&Pwd=686148428&uin=&vid="+vid+"&coverid=&pid="+guid+"&guid="+guid+"&unid=&vt=&type=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&bi=&bt=&version=3.3.367&platform="+platform+"&format=&defn=&ctime="+ctime+"&ptag=&isvip=0&tpid=1&pversion=chromehls&hc_uin=&hc_main_login=&hc_vuserid=&hc_openid=&hc_appid=&hc_pvid=494205040&hc_ssid=&hc_qq=&hh_ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ckey=&iformat=&hh_ref=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&vurl=&v_idx=0&rcd_info=&extrainfo=&step=3&val=1&idx=0&diagonal=1009&isfocustab=1&isvisible=1");
		}else{
			reportUrls.push("//btrace.video.qq.com/kvcollect?"+$.param({
				BossId:'2865',
				Pwd:'1698957057',
				_dc:0,
				version:'TenPlayerHTML5V2.0',
				vid:vid,
				rid:webtools.createGUID(),
				pid:webtools.createGUID(),
				url:'//film.qq.com/film_index_prevue/index.html?firstVid='+vid,
				platform:platform,
				pfversion:'9.1',
				vt:203,
				tpid:9,
				vurl:url,
				bt:5905,
				step:3,
				ctime:ctime,
				val:1,
				isshortvd:0,
				opensource:0,
				cmid:webtools.createGUID(),
				ua:navigator.userAgent
			}));
		}
		for (var i=0;i<reportUrls.length;i++)
			rundao.setimg(reportUrls[i]);
    },
	useragent:function(a){
        var a = a || navigator.userAgent,
        a = a.toLowerCase(),
        browser = {},
        os = {},
        phone = {},
        mobile = !1;
        a.indexOf("mobile") > -1 && (mobile = !0);
        var b, c, d = {
            android_1: /android[\s\/]([\d\.]+)/i,
            android_2: /android/i,
            android_3: /MIDP-/i,
            ipod_1: /iPod\stouch;\sCPU\siPhone\sos\s([\d_]+)/i,
            ipod_100: /iPod.*os\s?([\d_\.]+)/i,
            iphone: /iPhone;\sCPU\siPhone\sos\s([\d_]+)/i,
            iphone_100: /iPhone.*os\s?([\d_\.]+)/i,
            ipad_1: /ipad;\scpu\sos\s([\d_]+)/i,
            ipad_2: /ipad([\d]+)?/i,
            windows: /windows\snt\s([\d\.]+)/i,
            mac: /Macintosh.*mac\sos\sx\s([\d_\.]+)/i,
            linux: /Linux/i
        };
        for (var e in d) if (b = d[e].exec(a)) {
            c = e.replace(/_\d+/, ""),
            os[c] = !0,
            os.name = c,
            b[1] && (os.version = b[1].replace(/_/g, "."));
            break
        } (os.iphone || os.ipad || os.ipod) && (os.ios = !0);
        var f, g, h = {
            wechat: /MicroMessenger\/([\d\.]+)/i,
            ipadqq: /IPadQQ\/([\d\.]+)/i,
            mqq: /qq\/([\d\.]+)/i,
            qzone: /QZONEJSSDK\/([\d\.]+)/i,
            mqqbrowser: /mqqbrowser\/([\d\.]+)/i,
            qqbrowser: /[^m]QQBrowser\/([\d\.]+)/i,
            x5: /tbs\/(\d+)/i,
            uc: /UCBrowser\/([\d\.]+)/i,
            safari_1: /Version\/(([\d\.]+))\sSafari\/[\d\.]+/i,
            safari_2: /Safari\/([\d\.]+)/i,
            firefox: /Firefox\/([\d\.]+)/i,
            opera: /OPR\/([\d\.]+)/i,
            ie_1: /MSIE\s([\d\.]+)/i,
            ie_2: /(trident\/\d\.\d)/i,
            ie_3: /(Edge)\/\d+\.\d+/i,
            weibo: /weibo__([\d\.]+)/i,
            qqnews: /qqnews\/([\d\.]+)/i,
            qqlive_1: /QQLiveBrowser\/([\d\.]+)/i,
            qqlive_2: /QQLiveHDBrowser\/([\d\.]+)/i,
            kuaibao: /qnreading\/([\d\.]+)/i,
            liebao: /LieBaoFast\/([\d\.]+)/i,
            douban: /com\.douban\.frodo\/([\d\.]+)/i,
            miuibrowser: /MiuiBrowser/i,
            baidu: /baiduboxapp/i,
            browser360: /360browser/i,
            oppobrowser: /OppoBrowser/i,
            chrome_1: /CriOS\/([\d\.]+)/i,
            chrome_2: /Chrome\/([\d\.]+)/i,
            qqdownloader: /qqdownloader\/([\d\.]+)/i
        };
        for (var i in h) if (f = h[i].exec(a)) {
            if (g = i.replace(/_\d+/, ""), browser[g]) return;
            browser[g] = {
                version: f[1]
            }
        }
        os.android && browser.safari && delete browser.safari,
        browser.chrome && browser.safari && delete browser.safari,
        browser.ie && browser.ie.version && browser.ie.version.indexOf("trident") > -1 && (browser.ie.version.indexOf("6.0") > -1 ? browser.ie.version = "10": browser.ie.version.indexOf("5.0") > -1 ? browser.ie.version = "9": browser.ie.version.indexOf("4.0") > -1 ? browser.ie.version = "8": browser.ie.version = "11");
        var j, k = {
            ipod: /iPod/i,
            ipad: /iPad/i,
            iphone: /iPhone/i,
            wp:/Windows Phone ([\d.]+)/,
            huawei_1: /HUAWEI([\w_-]+)/i,
            huawei_2: /(CHM-\w+)/i,
            huawei_3: /(HonorChe)/i,
            huawei_4: /HONORPLK/i,
            huawei_5: /(Che\d+-CL\d+)/i,
            huawei_6: /(H\d+-L\d+)/i,
            huawei_100: /HUAWEI/i,
            xiaomi_1: /(HM\sNOTE)/i,
            xiaomi_2: /(HM\s\w+)/i,
            xiaomi_3: /(MI\s\w+)/i,
            xiaomi_4: /(MI-ONE\sPlus)/i,
            xiaomi_5: /(M1)\sBuild/i,
            xiaomi_6: /(HM\d+)/i,
            xiaomi_7: /Xiaomi[\s_]?([\w_]+)/i,
            samsung_1: /(GT-\w+)/i,
            samsung_2: /(SCH-\w+)/i,
            samsung_3: /(SM-\w+)/i,
            vivo: /vivo\s(\w+)/i,
            oneplus: /ONEPLUS-([a-z0-9]+)/i,
            lenovo_1: /Lenovo[\s-]?([\w-]+)/i,
            lenovo_100: /Lenovo/i,
            zte_1: /ZTE\s?(\w+)?/i,
            zte_2: /ZTE/i,
            coolpad_1: /Coolpad\s(\w+)/i,
            coolpad_100: /Coolpad/i,
            oppo_1: /OPPO\s?(\w+)/i,
            oppo_2: /(R7Plus|R8007|R801|R831S|R8205)/i,
            oppo_100: /OPPO/i,
            meizu_1: /(MX\d+)/i,
            meizu_2: /(m\d+\snote)\sBuild/i,
            htc_1: /HTC\s?(\w+)/i,
            htc_100: /HTC/i,
            tcl: /TCL\s(\w+)/i,
            lephone: /lephone\s(\w+)/i,
            lg: /LG[\s-]?(\w+)/i,
            galaxy: /(galaxy\d+)/,
            hisense_1: /Hisense/i,
            hisense_2: /HS-(\w+)/i,
            philips: /Philips\s?(\w+)?/i,
            "é‡‘ç«‹": /(GN\w+)\sBuild/i,
            sonny: /sonny/i,
            "å¤©è¯­": /K-Touch/i,
            "MiPad":/XiaoMi\/MiPad/i,
            "lepad":/lepad/i,
            yoga:/YOGA/i,
            mediapad:/MediaPad/i,
            gtp:/GT-P/i,
            smt:/SM-T/i,
            gt_n5100:/GT-N5100/i,
            sch_i800:/sch-i800/i,
            "huawei":/HUAWEI\s?[MTS]\d+-\w/i,
            nexus_s7:/Nexus\s7/i,
            nexus_s8:/Nexus\s8/i,
            nexus_s11:/Nexus\s11/i,
            "Kindle_Fire":/Kindle Fire HD/i,
            Tablet:/Tablet/i,
            samsung_tab:/tab/i
        };
        for (var l in k) if (j = k[l].exec(a)) {
            phone.name = l.replace(/_\d+/, ""),
            j[1] && (phone.version = j[1].replace(/^[_-]/gi, ""));
            break
        }
        return {
            browser : browser,
            os      : os,
            phone   : phone,
            mobile  : mobile,
            mac     : /mac/i.test(a)
        };
    },
	getBusinessId:function(){
		var d = this.useragent();
		if (d.browser.wechat) return 6;
		if (d.browser.mqq) return 17;
		var a = "";
		if (document.location.href.indexOf("//v.qq.com/iframe/") >= 0 && window != top) {
			var b = document.referrer;
			if ("" !== b) {
				var c = document.createElement("a");
				c.href = b,
				a = c.hostname,
				c = null
			}
		}
		"" === a && (a = 'v.qq.com');
		var e = [{
			r: /(\w+\.)?weixin\.qq\.com$/i,
			v: 6
		},
		{
			r: /^(v|film)\.qq\.com$/i,
			v: 1
		},
		{
			r: /^news\.qq\.com$/i,
			v: 2
		},
		{
			r: /(\w+\.)?qzone\.qq\.com$/i,
			v: 3
		},
		{
			r: /(\w+\.)?t\.qq\.com$/i,
			v: 5
		},
		{
			r: /^3g\.v\.qq\.com$/i,
			v: 8
		},
		{
			r: /^m\.v\.qq\.com$/i,
			v: 10
		},
		{
			r: /3g\.qq\.com$/i,
			v: 12
		}];
		a = a.toLowerCase();
		for (var f = 0,
		g = e.length; f < g; f++) {
			var h = e[f];
			if (h.r.test(a)) return h.v
		}
		return 7
	},
	getPlatform:function(){
		var a = this.getBusinessId(),
			b = this.getDeviceId();
		return 1e4 * a + 100 * b + 1
	},
	getDeviceId:function(){
		var a = navigator.userAgent,d = this.useragent();
		return d.os.ipad ? 1 : d.os.windows ? /Touch/i.test(a) ? 8 : /Phone/i.test(a) ? 7 : 2 : d.os.android ? d.mobile ? 3 : 5 : d.os.iphone ? 4 : d.os.mac ? 9 : 10
	},
	strsub:function(str,start,end){
		var s = str.indexOf(start) + start.length;
		var e = str.indexOf(end,s);
		return str.substring(s,e);
	},
	tempcalc : function(a, b){
		for (var c = "",d = 0; d < a.length; d++)
			c += String.fromCharCode(a.charCodeAt(d) ^ b.charCodeAt(d % 4));
		return c
	},
	u1: function(a, b){
		for (var c = "",d = b; d < a.length; d += 2)
			c += a.charAt(d);
		return c
	},
	urlenc : function(a, b, d) {
		var _urlStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		for (var e, f, g, h, i, j, k, l = "",
		m = 0; m < a.length;) e = a.charCodeAt(m++),
		f = a.charCodeAt(m++),
		g = a.charCodeAt(m++),
		15 == m && (l += "A", l += b, l += d),
		h = e >> 2,
		i = (3 & e) << 4 | f >> 4,
		j = (15 & f) << 2 | g >> 6,
		k = 63 & g,
		isNaN(f) ? j = k = 64 : isNaN(g) && (k = 64),
		l = l + _urlStr.charAt(h) + _urlStr.charAt(i) + _urlStr.charAt(j) + _urlStr.charAt(k);
		return l
	},
	qv:function(a, b, d, e, f){
		f = f || parseInt( + new Date / 1e3),
		e = ("" + e).charAt(0);
		var g = "",
		h = "",
		i = {
			plt: a || "",
			vid: b || "",
			std: d || "",
			sts: e || "",
			ts: f,
			rf: g,
			ua: h
		};
		i = window.JSON ? JSON.stringify(i) : function(){
			var a = [];
			for (var b in i) a.push('"' + b + '":"' + i[b] + '"');
			return "{" + a.join(",") + "}"
		}(i);
		var j = this.hexToString(md5(a + b + f + "#$#@#*ad" + g + h + e.charAt(0) + d)),
			k = this.urlenc(this.tempcalc(j, "#$#@#*ad"), e.charAt(0), f),
			l = this.urlenc(this.tempcalc(j, "86FG@hdf"), e.charAt(0), f),
			m = this.u1(k, 0),
			n = this.u1(k, 1);
		return {
			p: i,
			u: k,
			c: l,
			u1: m,
			u2: n,
			t: f
		}
	},
	hexToString: function(a){
		for (var b = "",c = "0x" == a.substr(0, 2) ? 2 : 0; c < a.length; c += 2)
			b += String.fromCharCode(parseInt(a.substr(c, 2), 16));
		return b
	},
	gettime:function(){
		return parseInt(new Date().getTime()/1000);
	},
	notempty:function(ary){
		return ary.filter(t => t!=undefined && t!==null);
	},
	getencrypt:function(){
		var day = new Date().getDay(),
			g = (day == 0 ? 7 : day);
		return '7.'+g;
	},
	ckey7:function(vid,tm,platform){
		var day = new Date().getDay(),
			g = (day == 0 ? 7 : day),
			magic='';
		if( g == 1 ){
			magic = "06fc1464";
		} else if( g == 2 ){
			magic = "4244ce1b";
		} else if( g == 3 ){
			magic = "77de31c5";
		} else if( g == 4 ){
			magic = "e0149fa2";
		} else if( g == 5 ){
			magic = "60394ced";
		} else if( g == 6 ){
			magic = "2da639f0";
		} else if( g == 7 ){
			magic = "c2f0cf9f";
		}
		return md5(magic + vid + tm + "*#06#" + platform);
	},
	createGUID:function(a){
		a = a || 32;
		for (var b = "",c = 1; c <= a; c++){
			var d = Math.floor(16 * Math.random()).toString(16);
			b += d
		}
		return b
	}
};