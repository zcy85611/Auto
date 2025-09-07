'use strict';
'require view';
'require fs';
'require uci';
'require rpc';
'require form';
'require tools.widgets as widgets';
var callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: ['name'],
	expect: {
		'dline': {}
	}
});
return view.extend({
	load: function() {
		return Promise.all([L.resolveDefault(callServiceList('dline')), uci.load('dline')]);
	},
	render: function(res) {
		var running = Object.keys(res[0].instances || {}).length > 0;
		var button, status;
		if (running) {
			status = '<font color="green" size=3><b>' + _('Service is running') + '</b></font>';
		} else {
			status = '<font color="red" size=3><b>' + _('Service is not running') + '</b></font>';
		}
		var m, s, o;
		m = new form.Map('dline');
		m.title = _('Dedicated Line');
		s = m.section(form.TypedSection);
		s.title = _('Running Status');
		s.description = status;
		s.anonymous = true;
		s = m.section(form.TypedSection, 'basic', _('Basic Settings'));
		s.addremove = false;
		s.anonymous = true;
		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.rmempty = false;
		o = s.option(form.ListValue, 'loglevel', _("Log Level"));
		o.value("none");
		o.value("error");
		o.value("warning");
		o.value("info");
		o.value("debug");
		o.default = "none";
		o.rmempty = false;
		o = s.option(form.Value, 'serverIP', _('Server IP'));
		o.rmempty = false;
		o = s.option(form.Value, 'serverAddr', _('Server Address'));
		o.rmempty = false;
		o = s.option(form.Value, 'port', _('Port'));
		o.datatype = 'and(port,min(1))'
		o.rmempty = false;
		o = s.option(form.Value, 'uuid', _('UUID'));
		o.rmempty = false;
		return m.render();
	}
});