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
	params: [ 'name' ],
	expect: { 'petrochina': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callServiceList('petrochina')),
			uci.load('petrochina')
		]);
	},
	render: function(res) {

		var running = Object.keys(res[0].instances || {}).length > 0;
		var status;
		if (running) {
		    status = '<font color="green" size=3><b>' + _('Petrochina Proxy is running') + '</b></font>'}
		    else {
		    status = '<font color="red" size=3><b>' + _('Petrochina Proxy is not running') + '</b></font>'}
		    
		var m, s, o;
		
		m = new form.Map('petrochina');
		m.title = _('Petrochina Proxy');
		
		s = m.section(form.TypedSection);
		s.title = _('Running Status');
		s.description = status;
		s.anonymous = true;

		s = m.section(form.TypedSection, 'global', _('Settings'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.rmempty = false;

		o = s.option(form.Value, 'proxyaddr', _('Proxy Address'));
		o.placeholder = 'proxy3.bj.petrochina';
		o.rmempty = false;

		o = s.option(form.Value, 'port', _('Port'));
		o.datatype = 'and(port,min(1))'
		o.placeholder = '8080';
		o.rmempty = false;
		
		s = m.section(form.TypedSection, 'exception', _('Exception List'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Value, 'excDomain', _('Domain'));
		o.rmempty = true;
		
		o = s.option(form.Value, 'excPort', _('Port'));
		o.rmempty = true;
		
		o = s.option(form.Value, 'excIP', _('IP'));
		o.rmempty = true;

		return m.render();
	}
});