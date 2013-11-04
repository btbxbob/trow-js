/**
* a javascript TROW library
* @module libtrow
*/
define(['jquery', 'jquery.crypt'],
	function(jquery, nil)
	{
		/**
		the class starts here.
		@class libtrow
		@constructor
		*/
		return function(Appkey, Appsecret)
		{
			var $ = jquery;
			/**
			* remember last time got time.
			* @property last
			* @type {Number}
			*/
			this.last = 0; 
			/** 
			place to save time got from server
			inthel said the token will timeout in 5 minutes, about 300,000 ms.
			@property servertime
			@type {Number}
			*/
			this.servertime = 0; 
			/**
			appsecret got from trow.cc
			@private
			@property appsecret
			*/
			var appsecret = Appsecret; //secret must be secret
			/**
			appkey got from trow.cc
			@property appkey
			*/
			this.appkey = Appkey;
			/**
			result by calcAppToken()
			@private
			@property apptoken
			*/
			var apptoken; //calc by calcAppToken()
			
			this.uid = ""; //get by getLogin
			var utoken = ""; //get by getLogin

			/**
			* to get time from the server.
			* @method getTime
			* @param {Function} callback a callback when done
			*/
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
			/**
			calculate the apptoken for further use.
			@method calcAppToken
			*/
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
			/**
			to login.
			@method getLogin
			@param {String} uname user name.
			@param {String} ucode password.
			@param {Function} callback callback when done.
			*/
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
								utoken = json.data.utoken;
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
			this.getInfo = function(id, callback)
			{
				if (+new Date - this.last > 200000)
				{
					this.gettime();
				}
				var inner = $.proxy(function()
				{
					$.getJSON('http://trow.cc/api/members/info',
						{
							't': this.servertime,
							'apptoken': apptoken,
							'appkey': this.appkey,
							'id': id,
							'uid': this.uid,
							'utoken': utoken
						},
						$.proxy(function(json)
						{
							if (json.code == 42)
							{
								console.log(JSON.stringify(json));
								if (typeof(callback) === "function")
								{
									callback(json);
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
						}, this));
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