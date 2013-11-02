function libtrow($,Appsecret)
{
	this.stime=0;
	this.appsecret=Appsecret;
	function time()
	{
		$.getJSON('http://trow.cc/api/stats/time', function(json, textStatus) {
				/*optional stuff to do after success */
				this.stime=json;
		});
	}
	this.time=time;
}
