var Dav = function (auth, base) {
    this.auth = 'Basic ' + auth;
    this.base = base;
};

var STATUS_CODES = {
  '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'None-Authoritive Information',
  '204': 'No Content',
  '1223': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Time-out',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Request Entity Too Large',
  '414': 'Request-URI Too Large',
  '415': 'Unsupported Media Type',
  '416': 'Requested range not satisfiable',
  '417': 'Expectation Failed',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Time-out',
  '505': 'HTTP Version not supported',
  '507': 'Insufficient Storage'
};
Dav.prototype = {

    request : function (options) {
        var self = this;
        var xhr = self._getXMLHttp();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var stat = xhr.status.toString();
                var cont = xhr.responseText;
                var statstr = STATUS_CODES[stat];
                options.handler &&
                    options.handler(stat, statstr, cont);
                xhr = null;
            }
        };
        xhr.open(options.type, options.path, true);
        xhr.setRequestHeader("Authorization", self.auth);
        if (options.headers)
            for(var key in options.headers) {
                var val = options.headers[key];
                xhr.setRequestHeader(key, val);
            }
        xhr.send(options.content);
    },
    
    _getXMLHttp : function () {
        var self = this;
        var methods = [
            function () {
                return new XMLHttpRequest();
            },
            function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for (var i = 0, func; func = methods[i]; i++) {
            try {
                self._getXMLHttp = func;
                return func();
            } catch(e) { }
        }
        throw new Error('Your browser not supported XMLHttpRequest');
    },

    OPTIONS : function (ok, err) {
        var self = this;
        self.request({
            type: 'OPTIONS',
            path: this.base,
            headers: {
                'Content-type': 'text/xml;charset=utf-8'
            },
            handler: function (stat, statstr, cont) {
                if (stat == '200') {
                    self.log('OPTIONS request success');
                    var ract = new RegExp([
                        '<D:activity-collection-set>',
                        '<D:href>([^<]+)<\\/D:href>'
                    ].join(''));
                    self.act = cont.match(ract)[1];
                    self.uniqueKey = self._getUniqueKey();
                    self.log('Acitivity path is: ' + self.act);
                    ok && ok(stat, statstr, cont);
                } else {
                    self.log('OPTIONS request fail', 1);
                    self.log(stat + ' ' + statstr, 1);
                    self.log('OPTIONS INFO END', 1);
                    err && err();
                }
            },
            content: [
                '<?xml version="1.0" encoding="utf-8"?>',
                '<D:options xmlns:D="DAV:">',
                '<D:activity-collection-set/>',
                '</D:options>'
            ].join('')
        });
    },

    PROPFIND : function (path, handler, prop) {
        var self = this;
        self.request({
            type: 'PROPFIND',
            path: path,
            headers: {
                'Depth': 0,
                'Content-type': 'text/xml;charset=utf-8'
            },
            content: [
                '<?xml version="1.0" encoding="utf-8"?>',
                '<D:propfind xmlns:D="DAV:">',
                prop ? prop : '<D:allprop />',
                '</D:propfind>'
            ].join(''),
            handler: function (stat, statstr, cont) {
                self.log('PROPFIND ' + path + ':' + stat + ' ' + statstr);
                if (stat == '207')
                    self._parseResponse(cont);
                handler(stat, statstr, cont);
            }
        });
    },

    _parseResponse: function (txt) {
        var self = this;
        var re = self.reg;
        for (var prop in re) {
            var r = re[prop];
            var match = txt.match(r);
            if (match)
                self[prop] = match[1];
        }
    },
    
    reg: {
        'vcc': new RegExp(['version-controlled-configuration>',
                               '<D:href>([^<]+)<\\/D:href>'
                              ].join('')
        ),
        'cki': /:checked-in><D:href>([^<]+)<\/D:href>/,
        'cko': /<\w+>Checked-out resource (\S+) has been created/,
        'blc': /:baseline-collection><D:href>([^<]+)<\/D/,
        'blr': /:baseline-ralative-path>([^<]+)<\//
    },

    MKACTIVITY : function (ok, err) {
        var self = this;
        self.request({
            type: 'MKACTIVITY',
            path: self.act + self.uniqueKey,
            handler: function (stat, statstr, cont) {
                if (stat == '201') {
                    self.log('MKACTIVITY request success');
                    self.log('Activity ' + self.act + self.uniqueKey);
                    self.log('MKACTIVITY INFO END');
                    ok && ok(stat, statstr, cont);
                } else {
                    self.log('MKACTIVITY request fail', 1);
                    self.log(stat + ' ' + statstr, 1);
                    err && err();
                }
            }
        });
    },

    CHECKOUT : function (path, ok, err) {
        var self = this;
        var actpath = self.act + self.uniqueKey;
        self.request({
            type: 'CHECKOUT',
            path: path,
            content: [
                '<?xml version="1.0" encoding="utf-8"?>',
                '<D:checkout xmlns:D="DAV:">',
                '<D:activity-set><D:href>', actpath, '</D:href>',
                '</D:activity-set><D:apply-to-version/></D:checkout>'
            ].join(''),
            handler: function (stat, statstr, cont) {
                if (stat == '201') {
                    self.log('CHECKOUT ' + path + ' done!');
                    self._parseResponse(cont);
                    ok && ok(stat, statstr, cont);
                } else {
                    self.log('CHECKOUT ' + path + ' fail', 1);
                    self.log(stat + ' ' + statstr, 1);
                    self.log('CHECKOUT INFO END');
                    self.rmact();
                }
            }
        });
    },

    PROPPATCH : function (path, props, ok, err) {
        var self = this;
        var props = self._getProppatchXML(props.set, props.del);
        self.request({
            type: 'PROPPATCH',
            path: path,
            headers: {
                'Content-type': 'text/xml;charset=utf-8'
            },
            content: [
                '<?xml version="1.0" encoding="utf-8" ?>',
                '<D:propertyupdate xmlns:D="DAV:"',
                ' xmlns:V="http://subversion.tigris.org/xmlns/dav/"',
                ' xmlns:C="http://subversion.tigris.org/xmlns/custom/"', 
                ' xmlns:S="http://subversion.tigris.org/xmlns/svn/">',
                props,
                '</D:propertyupdate>'
            ].join(''),
            handler: function (stat, statstr, cont) {
                if (stat == '207') {
                    self.log('PROPPATCH success');
                    ok && ok(stat, statstr, cont);
                } else {
                    self.log('PROPPATCH fail', 1);
                    self.log(stat + ' ' + statstr, 1);
                    self.log('PROPPATCH INFO END', 1);
                    self.rmact();
                    err && err();
                }
            }
        });
    },

    PUT : function (file, content, ok, err) {
        var self = this;
        var path = self.cko.indexOf(file) != -1 ? self.cko :
                                            self.cko + '/' + file;
        self.request({
            type: 'PUT',
            path: path,
            headers: {
                'Content-type': 'text/plain'
            },
            content: content,
            handler: function (stat, statstr, cont) {
                if (stat >= 200 && stat < 300) {
                    self.log('PUT ' + path + ' success');
                    ok && ok(stat, stat, statstr, cont);
                } else {
                    self.log('PUT ' + path + ' fail', 1);
                    self.log(stat + ' ' + statstr, 1);
                    self.log('PUT INFO END', 1);
                    self.rmact();
                    err && err();
                }
            }
        });
    },

    DELETE : function (file, ok, err) {
        var self = this;
        var path = typeof file == 'string' ? self.cko + '/' + file :
                                             file.join('');
        self.request({
            type: 'DELETE',
            path: path,
            handler: function (stat, statstr, cont) {
                if (stat >= 200 && stat < 300) {
                    self.log('DELETE ' + path + ' done');
                    ok && ok(stat, statstr, cont);
                } else {
                    self.log('DELETE ' + path + ' fail', 1);
                    self.log(stat + ' ' + statstr, 1);
                    self.log('DELETE INFO END', 1);
                    err && err();
                }
            }
        });
    },

    MOVE : function (path, topath, handler) {
        var self = this;
        self.request({
            type: 'MOVE',
            path: path,
            headers: {
                'Destination': topath,
                'Overwrite': 'F'
            },
            handler: function (stat, statstr, cont) {
                
            }
        });
    },

    COPY : function (path, topath, ok) {
        var self = this;
        self.request({
            type: 'COPY',
            path: path,
            headers: {
                'Destination': topath,
                'Overwrite': 'F'
            },
            handler: function (stat, statstr, cont) {
                if (stat >= 200 && stat < 300) {
                    self.log('COPY ' + path + ' done!');
                    ok && ok(stat, statstr, cont);
                } else {
                    self.log('COPY ' + path + ' fail', 1);
                    self.log(stat + ' ' + statstr, 1);
                    self.rmact();
                }
            }
        });
    },

    MKCOL : function (path, ok, err) {
        var self = this;
        self.request({
            type: 'MKCOL',
            path: path,
            handler: function (stat, statstr, cont) {
                if (stat >= 200 && stat < 300) {
                    self.log('MKCOL ' + path + ' done!');
                    ok && ok(stat, statstr, cont);
                } else {
                    self.log('MKCOL ' + path + ' fail.', 1);
                    self.rmact();
                    err && err();
                }
            }
        });
    },

    LOCK : function () {
        var self = this;
        self.request({
            type: 'LOCK',
            path: path,
            headers: {

            },
            handler: function (stat, statstr, cont) {

            }
        });
    },

    UNLOCK : function () {
        var self = this;
        self.request({
            type: 'UNLOCK',
            headers: {

            },
            handler: function (stat, statstr, cont) {

            }
        });
    },

    MERGE : function (ok, err) {
        var self = this;
        self.request({
            type: 'MERGE',
            path: self.act + self.uniqueKey,
            headers: {
                'X-SVN-Options': 'release-locks',
                'Content-type': 'text/xml;charset=utf-8'
            },
            content: [
                '<?xml version="1.0" encoding="utf-8"?>',
                '<D:merge xmlns:D="DAV:"><D:source>',
                '<D:href>', self.act, self.uniqueKey, '</D:href>',
                '</D:source><D:no-auto-merge/><D:no-checkout/>',
                '<D:prop><D:checked-in/><D:version-name/>',
                '<D:resourcetype/><D:creationdate/>',
                '<D:creator-displayname/></D:prop></D:merge>'
            ].join(''),
            handler: function (stat, statstr, cont) {
                if (stat == '200') {
                    self.log('MERGE done');
                    self.rmact(ok);
                } else {
                    self.log('MERGE fail',  1);
                    self.log(stat + ' ' + statstr, 1);
                    self.log('##### MERGE INFO END', 1);
                    err && err(stat, statstr, cont);
                    self.rmact();
                }
            }
        });
    },

    rmact : function (callback) {
        var self = this;
        self.DELETE([self.act, self.uniqueKey],
                    function (stat, statstr, cont) {
            callback && callback(stat, statstr, cont);
        });
    },

    _getUniqueKey : function () {
        var key = [];
        var lens = [8, 4, 4, 4, 12];
        for (var i = 0; i < 5; i++) {
            var len = lens[i];
            var arr = [];
            for (var j = 0; j < len; j++)
                arr.push(this._getRandomChar());
            key.push(arr.join(''));
        }
        return key.join('-');
    },

    _getRandomChar : function () {
        var source = '0123456789abcdefghijklmnopqrstuvwxyz';
        return source.charAt(
            Math.round(
                Math.random() * 36)
        );
    },

    log : function (str, bad) {
        var color = bad ? 'red' : 'rgb(23, 199, 23)';
        var txtnode = document.createElement('p');
        var date = new Date();
        var time = this._getTime();
        txtnode.style.color = color;
        txtnode.innerHTML = time + ' ==> ' + str;
        Dav.console.appendChild(txtnode);
    },
    _getTime: function () {
        var date = new Date();
        return [
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ].join(':');
    },
    _getProppatchXML: function (propset, propdel) {
        var xml = [];
        if (propset) {
            xml.push('<D:set>');
            for (var ns in propset)
                xml.push(
                    '<D:prop>',
                    '<S:', ns, ' >', propset[ns],
                    '</S:', ns, '>',
                    '</D:prop>'
                );
            xml.push('</D:set>');
        }
        if (propdel) {
            xml.push('<D:remove>');
            for (var i = 0, ns; ns = propdel[i]; i++)
                xml.push(
                    '<D:prop>',
                    '<S:', ns, ' />',
                    '</D:prop>'
                );
            xml.push('</D:remove>');
        }
        return xml.join('');
    }
};

!function () {
    var div = Dav.console = document.createElement('div');
    var h = document.documentElement.clientHeight - 100;
    div.style.cssText = [
        //'position:fixed;z-index:999999;overflow-y:auto;width:500px;',
        //'left:50%;padding:10px;margin-left:-250px;background:#111;',
        //'border-radius:10px;box-shadow:0 0 10px #999;font-family:monaco;',
        //'font-size:12px;height:', h, 'px;display:none;'
    ].join('');
    var btn = document.createElement('button');
    btn.innerHTML = 'Hide';
    div.appendChild(btn);
    btn.onclick = function () {
        div.style.display = 'none';
    };
    document.body.appendChild(div);
}();
