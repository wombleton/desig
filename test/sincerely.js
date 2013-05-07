var async = require('async'),
    fs = require('fs'),
    desig = require('../desig'),
    expected;

expected = {
    1159: 'yours sincerely',
    1160: 'many thanks',
    1161: 'kind regards',
    1162: false,
    1163: 'kind regards',
    1170: false,
    1172: 'kind regards',
    1175: 'Robin Duke',
    1178: 'regards',
    1181: 'regards',
    1182: 'regards',
    1190: 'kind regards',
    1192: 'this email is intended',
    1193: 'regards',
    1194: 'Louella Beltran',
    1201: 'kind regards',
    1203: 'regards',
    1205: 'regards',
    1206: 'regards',
    1208: 'regards',
    1212: 'kind regards',
    1213: 'regards, nicole',
    1214: 'kind regards',
    1216: false,
    1218: 'regards',
    1219: 'brett calkin',
    1221: 'regards',
    1222: 'kind regards',
    1228: 'best regards',
    1237: 'with thanks',
    1238: 'thanks and regards',
    1240: 'regards',
    1241: 'kind regards',
    1242: 'kind regards, nicole',
    1244: 'kind regards',
    1247: 'kind regards',
    1248: false,
    1249: false,
    1251: 'yours sincerely',
    1252: 'many thanks, nicole',
    1257: 'yours sincerely',
    1258: 'kind regards, nicole',
    1260: 'yours sincerely',
};

exports['has'] = function(test) {
    fs.readdir('html', function(err, files) {
        async.each(files, function(file, callback) {
            var match = expected[file];

            match = match && match.toLowerCase()

            if (match !== undefined) {
                fs.readFile('html/' + file, 'utf8', function(err, html) {
                    var has = desig.has(html);

                    has = has && has.toLowerCase();

                    console.log("pass: %s, file: %s with has %s and match %s", match ? has.indexOf(match) >= 0 : !has, file, has, match);
                    if (match) {
                        test.ok(has.indexOf(match) >= 0);
                    } else {
                        test.ok(!has);
                    }
                    callback(err);
                });
            } else {
                callback();
            }
        }, function(err) {
            test.done();
        });
    });
};
