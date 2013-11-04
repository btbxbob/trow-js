define(['jquery', 'jquery.crypt'],
	function(jquery, nil)
	{
		return function(Appkey, Appsecret)
		{
			var $ = jquery;
			this.last = 0; //inthel said the token will timeout in 5 minutes, about 300,000 ms.
			this.servertime = 0; //time get frome server
			var appsecret = Appsecret;
			this.appkey = Appkey;
			var apptoken; //calc by calcAppToken()
			this.uid = ""; //get by getLogin
			this.utoken = ""; //get by getLogin
			this.getTime = function(callback)
			{
				$.ajaxSetup(
				{
					cache: false
				});
				$.getJSON('http://trow.cc/api/stats/time', $.proxy(function(json, textStatus)
				{
					this.servertime = json.data.time;
					this.last = event.timeStamp; //renew last time
					this.calcAppToken(); //recalc token
					if (typeof(callback) === "function")
					{
						callback();
					}
				}, this));
			}
			this.calcAppToken = function()
			{
				//example: $apptoken = md5($appkey.sha1($appsecret.$t))
				var md5 = function(source)
				{
					return $().crypt(
					{
						method: "md5",
						source: source
					})
				}
				var sha1 = function(source)
				{
					return $().crypt(
					{
						method: "sha1",
						source: source
					})
				}
				apptoken = md5(this.appkey + sha1(appsecret + this.servertime));
			}
			this.getLogin = function(uname, ucode, callback)
			{
				var inner = $.proxy(function()
				{
					//must post
					$.post('https://trow.cc/api/members/login',
						{
							't': this.servertime,
							'apptoken': apptoken,
							'appkey': this.appkey,
							'uname': uname,
							'ucode': ucode
						},
						$.proxy(function(json, textStatus)
						{
							if (json.code == 42)
							{
								this.uid = json.data.uid;
								this.utoken = json.data.utoken;
								if (typeof(callback) === "function")
								{
									callback(this.uid);
								}
							}
							else
							{
								console.log(json.message);
								if (typeof(callback) === "function")
								{
									callback();
								}
							}
						}, this)
					);
				}, this);

				//get time first
				if (+new Date - this.last > 200000)
				{
					this.getTime( //so we need a callback
						$.proxy(function()
						{
							inner();
						}, this)
					);
				}
				else
				{
					inner();
				}
			}
		}
	}
)