{%extends file="common/page/layout.tpl"%}

{%block name="top-head-extend"%}
	{%require name="namespace:dist/static/vendor.js"%}
	{%require name="namespace:dist/static/app.js"%}
  {%*require src="http://rapx.com:8888/rap.plugin.js?projectId=23" type="js"*%}
{%/block%}

{%block name="page-main"%}
	<div id="visit-tag-app">
	</div>
	{%script%}
	  window.$data = {%json_encode($widget_data)%};
    require("namespace:dist/static/app.js");
    alert('hello world');

		window.$data = 'a';
		require("namespace:dist/static/app.js")
		alert('hello world')

		window.data='a';require("namespace:dist/static/app.js");alert('hello world')

		require  ('namespace:dist/static/app.js')

		require
		('namespace:dist/static/app.js')

		require.async('namespace:dist/static/app.js')

		require   .
			async
			('namespace:dist/static/app.js')


	{%/script%}
{%/block%}