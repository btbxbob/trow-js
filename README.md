trow-js
=======

trow api的js实现版。
trow的doc参见[这里](http://trow.cc/wiki/trow/api/start)。

## 1. INSTALL

这玩意我想方设法用上了什么AMD之类的，
简单来说就是，你需要用requireJS了。像这样：

    require(["jquery-2.0.3.min", "jquery.terminal-0.7.7.min"]);
    require(["domready!", "libtrow"], function(doc, libtrow) //run when dom is ready
    	{
    		tr = new libtrow("[AppKey]", "AppSecret");
    		...
    	}

然后libtrow本身依赖`jquery`和`jquery.crypt`。具体位置请自行利用requireJS指定。

## 2. USAGE
首先

    tr = new libtrow("[AppKey]", "AppSecret");

然后

	tr.getLogin(name,pass);

> 其他的还没写好呢。

联系：btbxbob@gmail.com 最好还是直接开issue吧。