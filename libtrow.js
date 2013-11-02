define(['jquery','jquery.md5'],
function(jquery,Appkey,Appsecret)
{
	var $=jquery;
	this.last=event.timeStamp; //inthel said the token will timeout in 5 minutes, about 300,000 ms.
	this.servertime=0;
	var appsecret=Appsecret;
	this.appkey=Appkey;
	this.getTime=function()
	{
		$.getJSON('http://trow.cc/api/stats/time', $.proxy(function(json, textStatus) {
				this.servertime=json.data.time;
				this.last=event.timeStamp; //renew last time
		}, this));
	}
    this.calcAppToken=function()
    {

    }

}
)