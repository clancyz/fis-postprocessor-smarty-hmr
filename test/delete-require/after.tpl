{%extends file="common/page/layout.tpl"%}

{%block name="top-head-extend"%}
{%*SCRIPT_INSERT*%}
	
	
  {%*require src="http://rapx.com:8888/rap.plugin.js?projectId=23" type="js"*%}
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