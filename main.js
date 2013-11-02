require(["jquery-2.0.3.min","jquery.terminal-0.7.7.min","libtrow"]
	);
require(["domready!"],function(doc)
{
		function trow_login(name,pass,callback) {
			// body...
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
		        name: 'js_demo',
		        height: 200,
		        //tabcompletion: true,
		        login: trow_login,
		        prompt: 'js> '});
		});
})