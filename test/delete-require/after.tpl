{%extends file="common/page/layout.tpl"%}

{%block name="top-head-extend"%}
	
	
  {%*require src="http://rapx.com:8888/rap.plugin.js?projectId=23" type="js"*%}
{%*SCRIPT_INSERT*%}
{%/block%}

{%block name="page-main"%}
	<div id="visit-tag-app">
	</div>
	{%script%}
	  window.$data = {%json_encode($widget_data)%};
    ;
    alert('hello world');

		window.$data = 'a';
		
		alert('hello world')

		window.data='a';;alert('hello world')

		

		

		

		

		
	{%/script%}
{%/block%}