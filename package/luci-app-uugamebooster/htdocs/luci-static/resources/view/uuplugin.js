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
	expect: { 'uuplugin': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callServiceList('uuplugin')),
			uci.load('uuplugin')
		]);
	},
	render: function(res) {

		var running = Object.keys(res[0].instances || {}).length > 0;
		var status;
		if (running) {
		    status = '<font color="green" size=3><b>' + _('NetEase UU GameAcc is running') + '</b></font>';}
		    else {
		    status = '<font color="red" size=3><b>' + _('NetEase UU GameAcc is not running') + '</b></font>';}
		    
		var m, s, o;
		
		m = new form.Map('uuplugin');
		m.title = _('NetEase UU GameAcc');
		m.description = '<p>%s</p> <br/> <p>%s</p>'.format(_('A Paid Game Acceleration Service from NetEase'), _('Client NetEase UU GameAcc, Download from: iphone - Appstore, Android/Win/MAC - https://uu.163.com'));
		
		s = m.section(form.TypedSection);
		s.title = _('Running Status');
		s.description = status;
		s.anonymous = true;

		s = m.section(form.TypedSection, 'basic', _('Basic Settings'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.rmempty = false;
		
		return m.render();
	}
});