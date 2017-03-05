$(function() {

	$.ajax({
		type: "get",
		url: "json/goods.json",
		async: true,
		datatype: 'json',
		success: function(response) {
			
			$(response).each(function(i, e) {

				var $div = $('<div class=menu1></div>')
				var $i = response[i];

				$(e.twoLevel).each(function(index, ele) {
					
					var $p = $('<p></p>');
					var $b = $('<b></b>');
					var $a1 = $('<a></a>');

					$a1.attr('href',ele.href);
					$a1.html(ele.title);

					var $c = ele.con;

					$a1.appendTo($b);
					$b.appendTo($p);
					$($c).each(function(_index, _ele) {

						var $a2 = $('<a></a>');
						$a2.attr('href', _ele.href);
						$a2.html(_ele.name);
						$a2.appendTo($p);

					});

					$p.appendTo($div);
					$div.appendTo($('#menu'));

				});

			});

		},
		error: function(response) {
			alert("加载数据失败" + response.status)
		}
	});
})



                             //待修改
