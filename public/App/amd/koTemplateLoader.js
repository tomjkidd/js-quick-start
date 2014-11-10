define(['module'], function (module) {
	'use strict';
	var modconfig = module.config();
	var koTemplateLoader = {
		version: '0.0.1',
		load: function (name, parentRequire, onload, config) {
			var oReq = new XMLHttpRequest();
			var url =  modconfig.templatePath + '/' + name + modconfig.extension
			oReq.open("get", url, true);
			oReq.onreadystatechange = function () {
				if (oReq.readyState === 4) {
					var s = document.createElement('script');
					s.id = name;
					s.type = 'text/html';
					s.src = url;
					s.innerHTML = oReq.responseText;
					document.getElementsByTagName('head')[0].appendChild(s);
					onload(oReq.responseText);
				}
			};
			oReq.send(null);
		}
	};
	return koTemplateLoader;
});