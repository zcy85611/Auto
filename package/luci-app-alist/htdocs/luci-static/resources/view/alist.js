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
	expect: { 'alist': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callServiceList('alist')),
			uci.load('alist')
		]);
	},
	render: function(res) {

		var port = uci.get_first('alist', 'alist', 'port');
		var running = Object.keys(res[0].instances || {}).length > 0;
		var button, status;
		if (running) {
		    status = '<font color="green" size=3><b>' + _('Alist is running') + '</b></font>';
		    button = '&#160;<a class="btn" href="http://' + window.location.hostname + ':' + port + '" target="_blank">' + _('Open Web Interface') + '</a>';}
		    else {
		    status = '<font color="red" size=3><b>' + _('Alist is not running') + '</b></font>';
		    button = '';}
		    
		var m, s, o;
		
		m = new form.Map('alist');
		m.title = _('Alist');
		m.description = _('A file list program that supports multiple storage.');
		
		s = m.section(form.TypedSection);
		s.title = _('Running Status');
		s.description = status + button;
		s.anonymous = true;

		s = m.section(form.TypedSection, 'alist', _('Basic Settings'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.rmempty = false;

		o = s.option(form.Value, 'port', _('Port'));
		o.datatype = 'and(port,min(1))'
		o.placeholder = '5244';
		o.rmempty = true;
		o.default = '5244';

		o = s.option(form.Flag, 'log', _('Enable Logs'));
		o.rmempty = false;

		o = s.option(form.Flag, 'ssl', _('Enable SSL'));
		o.rmempty = false;
		
		o = s.option(form.Value, 'ssl_cert', _('SSL Cert'), _(('SSL certificate file path')));
		o.datatype = 'file';
		o.depends('ssl','1');

		o = s.option(form.Value, 'ssl_key', _('SSL Key'), _(('SSL key file path')));
		o.datatype = 'file';
		o.depends('ssl','1');

		o = s.option(form.Flag, 'mysql', _('Enable MySQL'));
		o.rmempty = false;
		
		o = s.option(form.Value, 'mysql_host', _('MySQL Host'));
		o.datatype = 'string';
		o.depends('mysql', '1');
		
		o = s.option(form.Value, 'mysql_port', _('MySQL Port'));
		o.datatype = 'and(port,min(1))';
		o.default = '3306';
		o.depends('mysql', '1');
		
		o = s.option(form.Value, 'mysql_username', _('MySQL Username'));
		o.datatype = 'string'
		o.depends('mysql', '1');
		
		o = s.option(form.Value, 'mysql_password', _('MySQL Password'));
		o.datatype = 'string';
		o.password = true;
		o.depends('mysql', '1');
    
		o = s.option(form.Value, 'mysql_database', _('Database Name'));
		o.datatype = 'string';
		o.depends('mysql', '1');

		o = s.option(form.Flag, 'allow_wan', _('Allow Access From Internet'));
		o.rmempty = false;
       
		o = s.option(form.Value, 'site_url', _('Site URL'), _(('When the web is reverse proxied to a subdirectory, this option must be filled out to ensure proper functioning of the web. Do not include / at the end of the URL')));
		o.datatype = 'string';
    		
		o = s.option(form.Value, 'max_connections', _('Max Connections'), _(('0 is unlimited, It is recommend to set a low number of concurrency (10-20) for poor performance device')));
		o.datatype = 'and(uinteger,min(0))';
		o.default = '0';
		o.rmempty = false;

		o = s.option(form.Value, 'token_expires_in', _('Login Validity Period (hours)'));
		o.datatype = 'and(uinteger,min(0))';
		o.default = '48';
		o.rmempty = false;

		o = s.option(form.Value, 'delayed_start', _('Delayed Start (seconds)'));
		o.datatype = 'and(uinteger,min(0))';
		o.default = '0';
		o.rmempty = false;
	   
		o = s.option(form.Value, 'data_dir', _('Data directory'));
		o.datatype = 'string';
		o.default = '/etc/alist';
		
		o = s.option(form.Value, 'temp_dir', _('Cache directory'));
		o.datatype = 'string';
		o.default = '/tmp/alist';
		o.rmempty = false;

		return m.render();
	}
});