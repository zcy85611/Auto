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
	expect: { 'nfsd': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callServiceList('nfsd')),
			uci.load('nfsd')
		]);
	},
	render: function(res) {

		var running = Object.keys(res[0].instances || {}).length > 0;
		var button, status;
		if (running) {
		    status = '<font color="green" size=3><b>' + _('NFS is running') + '</b></font>'}
		    else {
		    status = '<font color="red" size=3><b>' + _('NFS is not running') + '</b></font>'}
		    
		var m, s, o;
		
		m = new form.Map('nfsd');

		s = m.section(form.TypedSection);
		s.title = _('Running Status');
		s.description = status;
		s.anonymous = true;

		s = m.section(form.TypedSection, 'basic',_('Basic Settings'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.rmempty = false;

		s = m.section(form.GridSection, "share", _("Shared Directories"));
		s.anonymous = true;
		s.addremove = true;

		o = s.option(form.Flag, "enabled", _("Enable"));
		o.rmempty = false;
		o.default = "1";

		o = s.option(form.Value, "path", _("Path"));
		o.placeholder = "/mnt/sda1";
		o.rmempty = false;
		o.optional = false;

		o = s.option(form.Value, "clients", _("Clients"));
		o.placeholder = "192.168.1.0/24";
		o.rmempty = false;
		o.optional = false;

		o = s.option(form.ListValue, "permission", _("Permission"));
		o.value("all_squash", _("Map all visiting users to anonymous"));
		o.value("no_all_squash", _("Match with local users first, if fails, map to anonymous"));
		o.value("root_squash", _("Map visiting ROOT users to anonymous"));
		o.value("no_root_squash", _("Keep ROOT user's permission"));
		o.default = "all_squash";
		o.rmempty = false;

		o = s.option(form.Flag, "method", _("Async"));
		o.rmempty = false;
		o.default = "1";

		o = s.option(form.Flag, "subtreecheck", _("Subtree Check"));
		o.rmempty = false
		o.default = "0"

		o = s.option(form.Flag, "read_only", _("Read-only"))
		o.rmempty = false;
		o.default = "0";

		o = s.option(form.Flag, "insecure", _("Insecure"));
		o.default = "1";
		o.rmempty = false;

		s = m.section(form.GridSection, "mount", _("Mounted Points"));
		s.anonymous = true;
		s.addremove = true;

		o = s.option(form.Value, "host", _("Host"));
		o.placeholder = "192.168.1.1";
		o.rmempty = false;
		o.optional = false;

		o = s.option(form.Value, "path", _("Path"));
		o.placeholder = "/media/share";
		o.rmempty = false;
		o.optional = false;

		o = s.option(form.Value, "mount_on", _("Mount On"));
		o.placeholder = "/mnt/sda1";

		o = s.option(form.Flag, "read_only", _("Read-only"));
		o.rmempty = false;
		o.default = "0";
		
		return m.render()
	}
});