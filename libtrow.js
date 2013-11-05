/**
 * a javascript TROW library
 * @module libtrow
 */
define(['jquery', 'jquery.crypt'],
	function(jquery, nil) {
		/**
		the class starts here.
		@class libtrow
		@constructor
		*/
		return function(Appkey, Appsecret) {
			var $ = jquery;
			/**
			 * remember last time got time.
			 * @property last
			 * @type {Number}
			 */
			this.last = 0;
			/** 
			place to save time got from server.
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
			@type {String}
			@property appkey
			*/
			this.appkey = Appkey;
			/**
			result of calcAppToken()
			@private
			@property apptoken
			*/
			var apptoken; //calc by calcAppToken()
			/**
			result of getLogin().
			@property uid
			*/
			this.uid = "";
			/**
			result of getLogin().
			@property utoken
			*/
			var utoken = ""; //get by getLogin

			/**
			 * to get time from the server.
			 * @method getTime
			 * @param {Function} callback a callback when done
			 */
			this.getTime = function(callback) {
				$.ajaxSetup({
					cache: false
				});
				$.getJSON('http://trow.cc/api/stats/time', $.proxy(function(json, textStatus) {
					this.servertime = json.data.time;
					this.last = event.timeStamp; //renew last time
					this.calcAppToken(); //recalc token
					if (typeof(callback) === "function") {
						callback();
					}
				}, this));
			}
			/**
			calculate the apptoken for further use.
			@method calcAppToken
			*/
			this.calcAppToken = function() {
				//example: $apptoken = md5($appkey.sha1($appsecret.$t))
				var md5 = function(source) {
					return $().crypt({
						method: "md5",
						source: source
					})
				}
				var sha1 = function(source) {
					return $().crypt({
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
			this.getLogin = function(uname, ucode, callback) {
				var inner = $.proxy(function() {
					//must post
					$.post('https://trow.cc/api/members/login', {
							't': this.servertime,
							'apptoken': apptoken,
							'appkey': this.appkey,
							'uname': uname,
							'ucode': ucode
						},
						$.proxy(function(json, textStatus) {
							if (json.code == 42) {
								this.uid = json.data.uid;
								utoken = json.data.utoken;
								if (typeof(callback) === "function") {
									callback(this.uid);
								}
							} else {
								console.log(json.message);
								if (typeof(callback) === "function") {
									callback();
								}
							}
						}, this)
					);
				}, this);

				//get time first
				if (+new Date - this.last > 200000) {
					this.getTime( //so we need a callback
						$.proxy(function() {
							inner();
						}, this)
					);
				} else {
					inner();
				}
			}
			/**
			get user id's info
			@function getInfo
			@param {Number} id user's id
			@param {Function} callback callback when done.
			*/
			this.getInfo = function(id, callback) {
				var inner = $.proxy(function() {
					$.getJSON('http://trow.cc/api/members/info', {
							't': this.servertime,
							'apptoken': apptoken,
							'appkey': this.appkey,
							'id': id,
							'uid': this.uid,
							'utoken': utoken
						},
						$.proxy(function(json) {
							if (json.code == 42) {
								console.log(JSON.stringify(json));
								if (typeof(callback) === "function") {
									callback(json);
								}
							} else {
								console.log(json.message);
								if (typeof(callback) === "function") {
									callback();
								}
							}
						}, this));
				}, this);

				//get time first
				if (+new Date - this.last > 200000) {
					this.getTime( //so we need a callback
						$.proxy(function() {
							inner();
						}, this)
					);
				} else {
					inner();
				}
			}

			/**
			get topics from trow
			@function getTopic
			@param {Number} fid
			@param {Number} limit
			@param {Number} start
			*/
			this.getTopic = function(fid, limit, start) {
				var inner = $.proxy(function() {
					data = {
						't': this.servertime,
						'apptoken': apptoken,
						'appkey': this.appkey,
						'uid': this.uid,
						'utoken': utoken
					}
					if (fid) data.fid = fid;
					if (limit) data.limit = limit;
					if (start) data.start = start;
					$.getJSON('http://trow.cc/api/topics/list', data,
						$.proxy(function(json) {
							if (json.code == 42) {
								console.log(JSON.stringify(json));
								if (typeof(callback) === "function") {
									callback(json);
								}
							} else {
								console.log(json.message);
								if (typeof(callback) === "function") {
									callback();
								}
							}
						}, this));
				}, this);

				//get time first
				if (+new Date - this.last > 200000) {
					this.getTime( //so we need a callback
						$.proxy(function() {
							inner();
						}, this)
					);
				} else {
					inner();
				}
			}
		}
	}
)