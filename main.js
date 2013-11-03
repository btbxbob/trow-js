require(["jquery-2.0.3.min","jquery.terminal-0.7.7.min"]
	);
require(["domready!","libtrow"],function(doc,libtrow) //run when dom is ready
{
		tr=new libtrow("965cf93c", "773c7406f8e2b167c317b95dd579a83f")

		function trow_login(name,pass,callback) {
			// body...
			try {
			tr.getLogin(name,pass);
			}catch(e)
			{
				console.log("trow_login "+e);
			}
			callback(123);
		}
		
		$(function($, undefined) {
		    $('#terminal1 ').terminal(function(command, term) {
		        if (command !== '') {
		            try {
		                var result = window.eval(command); //actually do the work
		                if (result !== undefined) {
		                    term.echo(new String(result));
		                }
		            } catch(e) {
		                term.error(new String(e));  //error handler

		            }
		        } else {
		           term.echo('');
		        }
		    }, {
		        greetings: 'TROW 命令行访问',
		        name: 'term1',
		        height: 250,
		        //tabcompletion: true,
		        login: trow_login,
		        prompt: "> ",
		        outputLimit :0
		    });

		});

		
})