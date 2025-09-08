'use strict';
'require view';
'require fs';
'require uci';
'require rpc';
'require form';

var callServiceList = rpc.declare({
    object: 'service',
    method: 'list',
    params: ['name'],
    expect: {
        'vlmcsd': {}
    }
});

return view.extend({
    load: function() {
        return Promise.all([
            L.resolveDefault(callServiceList('vlmcsd'), {}),
            uci.load('vlmcsd'),
            L.resolveDefault(fs.read('/etc/vlmcsd/vlmcsd.ini'), '')
        ]);
    },

    render: function(res) {
        var running = Object.keys(res[0].instances || {}).length > 0;
        var status;
        
        if (running) {
            status = '<font color="green" size=3><b>' + _('Service is running') + '</b></font>';
        } else {
            status = '<font color="red" size=3><b>' + _('Service is not running') + '</b></font>';
        }

        var m, s, o;

        m = new form.Map('vlmcsd', _('KMS Server'), _('A KMS Server Emulator to activate your Windows or Office'));

        s = m.section(form.TypedSection);
        s.title = _('Running Status');
        s.description = status;
        s.anonymous = true;

        s = m.section(form.TypedSection, 'vlmcsd', _('Basic Settings'));
        s.addremove = false;
        s.anonymous = true;

        o = s.option(form.Flag, 'enabled', _('Enable'));
        o.rmempty = false;

        s = m.section(form.TypedSection, 'vlmcsd', _('Config File'));
        s.addremove = false;
        s.anonymous = true;

        o = s.option(form.TextValue, 'config');
        o.description = _('This file is /etc/vlmcsd/vlmcsd.ini.');
        o.rows = 25;
        
        o.cfgvalue = function(section_id) {
            return res[2] || '';
        };
        
        o.write = function(section_id, formvalue) {
            return fs.write('/etc/vlmcsd/vlmcsd.ini', formvalue.trim().replace(/\r\n/g, '\n') + '\n');
        };

        return m.render();
    }
});