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
	expect: { 'rMcloud': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callServiceList('rMcloud')),
			uci.load('rMcloud')
		]);
	},
	render: function(res) {

		var port = uci.get_first('rMcloud', 'basic', 'port');
		var running = Object.keys(res[0].instances || {}).length > 0;
		var button, status;
		if (running) {
		    status = '<font color="green" size=3><b>' + _('rMcloud is running') + '</b></font>';
		    button = '&#160;<a class="btn" href="http://' + window.location.hostname + ':' + port + '" target="_blank">' + _('Open Web Interface') + '</a>';}
		    else {
		    status = '<font color="red" size=3><b>' + _('rMcloud is not running') + '</b></font>';
		    button = '';}
		    
		var m, s, o;
		
		m = new form.Map('rMcloud');
		m.title = _('rMcloud');
		m.description = '<font color="black" size=3><p>%s</p> <br/> <a href="https://shop127153169.taobao.com" target="_blank">%s</a></font>'.format(_('Developed by 幸运7'), '淘宝店址');
		
		s = m.section(form.TypedSection);
		s.title = _('Running Status');
		s.description = status + button;
		s.anonymous = true;

		s = m.section(form.TypedSection, 'basic', _('Basic Settings'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.rmempty = false;

		o = s.option(form.Value, 'storageurl', _('Storage URL'));
		o.placeholder = 'https://local.appspot.com';
		o.rmempty = true;
		o.default = 'https://local.appspot.com';

		o = s.option(form.Value, 'port', _('Port'));
		o.datatype = 'and(port,min(1))'
		o.placeholder = '3000';
		o.rmempty = true;
		o.default = '3000';

		o = s.option(form.Value, 'datadir', _('Data Path'));
		o.rmempty = true;

		o = s.option(form.ListValue, 'loglevel', _('Log Level'));
		o.value('0', _('info'))
		o.value('1', _('error'))
		o.value('2', _('warn'))
		o.value('3', _('debug'))
		o.default = '1';
		o.rmempty = false;

		s = m.section(form.TypedSection, 'hwr', _('Handwriting Recognition'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Value, 'hmac', _('HMAC'));
		o.rmempty = true;

		o = s.option(form.Value, 'applicationkey', _('Application Key'));
		o.rmempty = true;

		s = m.section(form.TypedSection, 'email', _('Email Settings'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Value, 'smtpserver', _('SMTP Server'), _('Server address in HOST:PORT format'));
		o.rmempty = true;

		o = s.option(form.Value, 'smtpuser', _('SMTP User'));
		o.rmempty = true;

		o = s.option(form.Value, 'smtppasswd', _('SMTP Password'));
		o.rmempty = true;

		return m.render();
	}
});