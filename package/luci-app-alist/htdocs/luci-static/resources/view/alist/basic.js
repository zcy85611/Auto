'use strict';
'require form';
'require fs';
'require poll';
'require rpc';
'require uci';
'require view';
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

	render: function (data) {
		
		var port = uci.get_first('alist', 'alist', 'port');
		var running = Object.keys(data[0].instances || {}).length > 0;
		var button, status;
		if (running) {
		    status = '<font color="green" size=3><b>' + _('AList is running') + '</b></font>';
		    button = '&#160;<a class="btn" href="http://' + window.location.hostname + ':' + port + '" target="_blank">' + _('Open Web Interface') + '</a>';}
		    else {
		    status = '<font color="red" size=3><b>' + _('AList is not running') + '</b></font>';
		    button = '';}
		    
		var m, s, o;
		var webport = uci.get(data[0], '@alist[0]', 'port') || '5244';
		var ssl = uci.get(data[0], '@alist[0]', 'ssl') || '0';
		var protocol;
		if (ssl === '0') {
			protocol = 'http:';
		} else if (ssl === '1') {
			protocol = 'https:';
		}

		m = new form.Map('alist', _('Alist'),
			_('Default webUI/WebDAV login username is %s and password is %s.').format('<code>admin</code>', '<code>admin</code>') +
			'<br><a href="https://alist.nn.ci/zh/guide/drivers/local.html" target="_blank">' +
			_('User Manual') +
			'</a>');
			
		s = m.section(form.TypedSection);
		s.title = _('Running Status');
		s.description = status + button;
		s.anonymous = true;
		
		// init
		s = m.section(form.TypedSection, 'alist', _('Basic Settings'));
		s.anonymous = true;

		o = s.option(form.Flag, 'enabled', _('Enabled'));
		o.default = o.disabled;
		o.rmempty = false;

		o = s.option(form.Value, 'port', _('Port'));
		o.datatype = 'and(port,min(1))';
		o.default = '5244';
		o.rmempty = false;

		o = s.option(form.Value, 'delayed_start', _('Delayed Start (seconds)'));
		o.datatype = 'uinteger';
		o.default = '0';
		o.rmempty = false;

		o = s.option(form.Flag, 'allow_wan', _('Open firewall port'));
		o.rmempty = false;

		// global
		s = m.section(form.TypedSection, 'alist', _('Global Settings'));
		s.anonymous = true;

		o = s.option(form.Flag, 'force', _('Force read config'),
			_('Setting this to true will force the program to read the configuration file, ignoring environment variables.'));
		o.default = true;
		o.rmempty = false;

		o = s.option(form.Value, 'site_url', _('Site URL'),
			_('When the web is reverse proxied to a subdirectory, this option must be filled out to ensure proper functioning of the web. Do not include \'/\' at the end of the URL'));

		o = s.option(form.Value, 'cdn', _('CDN URL'));
		o.default = '';

		o = s.option(form.Value, 'token_expires_in', _('Login Validity Period (hours)'));
		o.datatype = 'uinteger';
		o.default = '48';
		o.rmempty = false;

		o = s.option(form.Value, 'max_connections', _('Max Connections'),
			_('0 is unlimited, It is recommend to set a low number of concurrency (10-20) for poor performance device'));
		o.default = '0';
		o.datatype = 'uinteger';
		o.rmempty = false;

		o = s.option(form.Flag, 'tls_insecure_skip_verify', _('Disable TLS Verify'));
		o.default = true;
		o.rmempty = false;

		o = s.option(form.Value, 'data_dir', _('Data directory'));
		o.default = '/etc/alist';

		o = s.option(form.Value, 'temp_dir', _('Cache directory'));
		o.default = '/tmp/alist';
		o.rmempty = false;

		// Logs
		s = m.section(form.TypedSection, 'alist', _('Logs'));
		s.anonymous = true;

		o = s.option(form.Flag, 'log', _('Enable Logs'));
		o.default = 1;
		o.rmempty = false;

		o = s.option(form.Value, 'log_path', _('Log path'));
		o.default = '/var/log/alist.log';
		o.rmempty = false;
		o.depends('log', '1');

		o = s.option(form.Value, 'log_max_size', _('Max Size (MB)'));
		o.datatype = 'uinteger';
		o.default = '10';
		o.rmempty = false;
		o.depends('log', '1');

		o = s.option(form.Value, 'log_max_backups', _('Max backups'));
		o.datatype = 'uinteger';
		o.default = '5';
		o.rmempty = false;
		o.depends('log', '1');

		o = s.option(form.Value, 'log_max_age', _('Max age'));
		o.datatype = 'uinteger';
		o.default = '28';
		o.rmempty = false;
		o.depends('log', '1');

		o = s.option(form.Flag, 'log_compress', _('Log Compress'));
		o.default = 'false';
		o.rmempty = false;
		o.depends('log', '1');

		// database
		s = m.section(form.TypedSection, 'alist', _('Database'));
		s.anonymous = true;

		o = s.option(form.ListValue, 'database_type', _('Database Type'));
		o.default = 'sqlite3';
		o.value('sqlite3', _('SQLite'));
		o.value('mysql', _('MySQL'));
		o.value('postgres', _('PostgreSQL'));

		o = s.option(form.Value, 'mysql_host', _('Database Host'));
		o.depends('database_type','mysql');
		o.depends('database_type','postgres');

		o = s.option(form.Value, 'mysql_port', _('Database Port'));
		o.datatype = 'port';
		o.default = '3306';
		o.depends('database_type','mysql');
		o.depends('database_type','postgres');

		o = s.option(form.Value, 'mysql_username', _('Database Username'));
		o.depends('database_type','mysql');
		o.depends('database_type','postgres');

		o = s.option(form.Value, 'mysql_password', _('Database Password'));
		o.depends('database_type','mysql');
		o.depends('database_type','postgres');

		o = s.option(form.Value, 'mysql_database', _('Database Name'));
		o.depends('database_type','mysql');
		o.depends('database_type','postgres');

		o = s.option(form.Value, 'mysql_table_prefix', _('Database Table Prefix'));
		o.default = 'x_';
		o.depends('database_type','mysql');
		o.depends('database_type','postgres');

		o = s.option(form.Value, 'mysql_ssl_mode', _('Database SSL Mode'));
		o.depends('database_type','mysql');
		o.depends('database_type','postgres');

		o = s.option(form.Value, 'mysql_dsn', _('Database DSN'));
		o.depends('database_type','mysql');
		o.depends('database_type','postgres');

		// scheme
		s = m.section(form.TypedSection, 'alist', _('Web Protocol'));
		s.anonymous = true;

		o = s.option(form.Flag, 'ssl', _('Enable SSL'));
		o.rmempty = false;

		o = s.option(form.Flag, 'force_https', _('Force HTTPS'));
		o.rmempty = false;
		o.depends('ssl', '1');

		o = s.option(form.Value, 'ssl_cert', _('SSL cert'),
			_('SSL certificate file path'));
		o.rmempty = false;
		o.depends('ssl', '1');

		o = s.option(form.Value, 'ssl_key', _('SSL key'),
			_('SSL key file path'));
		o.rmempty = false;
		o.depends('ssl', '1');

		// tasks
		s = m.section(form.TypedSection, 'alist', _('Task threads'));
		s.anonymous = true;

		o = s.option(form.Value, 'download_workers', _('Download Workers'));
		o.datatype = 'uinteger';
		o.default = '5';
		o.rmempty = false;

		o = s.option(form.Value, 'download_max_retry', _('Download Max Retry'));
		o.datatype = 'uinteger';
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Value, 'transfer_workers', _('Transfer Workers'));
		o.datatype = 'uinteger';
		o.default = '5';
		o.rmempty = false;

		o = s.option(form.Value, 'transfer_max_retry', _('Transfer Max Retry'));
		o.datatype = 'uinteger';
		o.default = '2';
		o.rmempty = false;

		o = s.option(form.Value, 'upload_workers', _('Upload Workers'));
		o.datatype = 'uinteger';
		o.default = '5';
		o.rmempty = false;

		o = s.option(form.Value, 'upload_max_retry', _('Upload Max Retry'));
		o.datatype = 'uinteger';
		o.default = '0';
		o.rmempty = false;

		o = s.option(form.Value, 'copy_workers', _('Copy Workers'));
		o.datatype = 'uinteger';
		o.default = '5';
		o.rmempty = false;

		o = s.option(form.Value, 'copy_max_retry', _('Copy Max Retry'));
		o.datatype = 'uinteger';
		o.default = '2';
		o.rmempty = false;

		// cors
		s = m.section(form.TypedSection, 'alist', _('CORS Settings'));
		s.anonymous = true;

		o = s.option(form.Value, 'cors_allow_origins', _('Allow Origins'));
		o.default = '*';
		o.rmempty = false;

		o = s.option(form.Value, 'cors_allow_methods', _('Allow Methods'));
		o.default = '*';
		o.rmempty = false;

		o = s.option(form.Value, 'cors_allow_headers', _('Allow Headers'));
		o.default = '*';
		o.rmempty = false;

		// s3
		s = m.section(form.TypedSection, 'alist', _('Object Storage'));
		s.anonymous = true;

		o = s.option(form.Flag, 's3', _('Enabled S3'));
		o.rmempty = false;

		o = s.option(form.Value, 's3_port', _('Port'));
		o.datatype = 'and(port,min(1))';
		o.default = 5246;
		o.rmempty = false;
		o.depends('s3', '1');

		o = s.option(form.Flag, 's3_ssl', _('Enable SSL'));
		o.rmempty = false;
		o.depends('s3', '1');

		return m.render();
	}
});
