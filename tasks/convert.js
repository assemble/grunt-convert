/*
 * grunt-convert-xml
 * https://github.com/jonschlinkert/grunt-convert-xml
 *
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT license.
 */
'use strict';

 module.exports = function(grunt) {

  var plist = require('plist');
  var YAML = require('yamljs');
  var path = require('path');
  var util = require('util');
  var csv = require('csv');
  var fs = require('fs');

  grunt.registerMultiTask('convert', 'Build the i18n dictionaries from the csv file', function() {

    //Tell grunt that this is an async task
    var done = this.async();

    var options = this.options({
      pretty: true,
      mergeAttrs: true,
      inline: 8,
      indent: 2,
      csv: {
        columns: true,
        delimeter: ','
      }
    });

    grunt.verbose.writeflags(options, 'Options');

    grunt.util.async.forEach(this.files, function (f, next) {

      if (f.src.length < 1) {
        // No src files, issued warn and goto next target.
        grunt.log.warn('Destination not written because no source files were found.');
        return;
      }

      var srcFiles = f.src.map(grunt.file.read).join(grunt.util.normalizelf(grunt.util.linefeed)),
          srcExt = path.extname(f.src[0]),
          destExt = path.extname(f.dest),
          data = srcFiles;

      // source/destination same, goto next target.
      if (srcExt === destExt) {
        return;
      }
      
      if (srcExt === '.csv') {
        
        if (destExt === '.json') {
          csv()
            .from(srcFiles, options.csv)
            .to.array( function( row ) {
              data = JSON.stringify(row, null, options.indent);
              grunt.file.write(f.dest, data);
              return;
          });
        } else {
          grunt.log.warn('CSV to XML or YAML converter not supported yet. Please use csv2json output to convert to XML or YAML. Sorry.');
          return;          
        }
        next();

      } else if (srcExt === '.xml') {

        var parse = require('xml2js').parseString;
        parse(srcFiles, options, function(err, result) {
          data = JSON.stringify(result, null, options.indent);
        });

      } else if (srcExt === '.yml') {

        data = JSON.stringify(YAML.load(f.src[0]), null, options.indent);

      } else if (srcExt === '.plist') {

        data = JSON.stringify(plist.parseFileSync(f.src[0]), null, options.indent);

      }

      // Check destination type
      if (destExt === '.csv') {

        data = JSON.parse(data);

        csv()
          .from(data)
          .to(f.dest, options.csv);
        next();

      } else if (destExt === '.xml') {

        data = toXML(JSON.parse(data), options.header);
        data = (options.pretty) ? require('pretty-data').pd.xml(data) : data; 

      } else if (destExt === '.yml') {

        data = YAML.stringify(JSON.parse(data), options.inline, options.indent);

      } else if (destExt === '.plist') {

        data = plist.build(JSON.parse(data)).toString();

      }

      // Write the destination file.
      grunt.file.write(f.dest, data);

      // Print a success message.
      grunt.log.ok('File ' + f.dest.cyan + ' converted.' + ' OK'.green);

      next();    
    }, this.async());
  });

  var toXML = function xml(json, options) {

      var XML_CHARACTER_MAP = {
            '&': '&amp;',
            '"': '&quot;',
             "'": '&apos;',
            '<': '&lt;',
            '>': '&gt;'
          },
          result = options.header ? '<?xml version="1.0" encoding="UTF-8"?>' : '',
          type = json.constructor.name;
      
      options.header = false;

      if(type==='Array'){
        json.forEach(function(node){
          result += xml(node, options);
        });

      } else if(type ==='Object' && typeof json === "object") {

        Object.keys(json).forEach(function(key){
          if(key!==options.attrkey){
            var node = json[key],
            attributes = '';

            if(options.attrkey && json[options.attrkey]){
              Object.keys(json[options.attrkey]).forEach(function(k){
                attributes += util.format(' %s="%s"', k, json[options.attrkey][k]);
              });
            }
            var inner = xml(node,options);

            if(inner){
              result += util.format("<%s%s>%s</%s>", key, attributes, xml(node,options), key);
            } else {
              result += util.format("<%s%s/>", key, attributes);
            }
          }
        });
      } else {
        return json.toString()
        .replace(/([&"<>''])/g, function(str, item) {
          return XML_CHARACTER_MAP[item];
        });  
      }

      return result;
    };
};
