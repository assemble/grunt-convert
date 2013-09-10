# [grunt-convert v0.1.5](http://github.com/assemble/grunt-convert) [![Build Status](https://travis-ci.org/assemble/grunt-convert.png)](https://travis-ci.org/assemble/grunt-convert)

> Convert between XML, JSON and YAML, from one format to another.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-convert --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-convert');
```

## The "convert" task
_Run this task with the `grunt convert` command._

Task targets, files and options may be specified according to the Grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


### Options

#### indent
Type: `Int`
Default: `2`

Force indentation ("pretty printing") for JSON and YAML.

#### inline
Type: `Int`
Default: `8`

Force indentation ("pretty printing")  for YAML only.

#### header
Type: `boolean`
Default: false

Use when converting JSON/YAML to XML. Add XML tag header.

See [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js#options) for other available options

#### cvs.delimeter
Type: `string`
Default: `,`

Set the field delimiter. One character only.

#### cvs.columns
Type: `boolean`
Default: true

List of fields or true if autodiscovered in the first CSV line.

See [node-csv](https://github.com/wdavidw/node-csv/blob/master/doc/from.md#from.options) for other available options.


### Usage Examples
In this example, running `grunt convert:xml2yml` (or `grunt convert` because `convert` is a [multi task](http://gruntjs.com/creating-tasks#multi-tasks)) will convert the `convert.xml` source files and writing the output to `dist/convert.yml`.

```js
grunt.initConfig({
  convert: {
    options: {
      explicitArray: false,
    },
    xml2yml: {
      src: ['convert.xml'],
      dest: 'dist/convert.yml'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Please lint and test your code using [Grunt](http://gruntjs.com/).

## Authors

**Jon Schlinkert**

+ [http://twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)
+ [http://github.com/jonschlinkert](http://github.com/jonschlinkert)

**Hariadi Hinta**

+ [http://twitter.com/hariadi](http://twitter.com/hariadi)
+ [http://github.com/hariadi](http://github.com/hariadi)


## License
[MIT License](LICENSE-MIT)

## Release History
* 2013-09-10    v0.1.4    Add support for CSV to JSON.
* 2013-07-16    v0.1.3    JSON/YAML to XML.
* 2013-07-15    v0.1.2    Add support YAML. Added XML to JSON/YAML, JSON to YAML, and YAML to JSON.
* 2013-07-02    v0.1.1    XML to JSON.
