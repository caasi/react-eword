(function(){
  var $, React, ReactDOM, punycode, debounce, createClass, ref$, div, ol, li, form, input, computeLength, Word, WholeWord, moedict, getData, getDataFromWords, DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_COUNT, App, Row, Col, slice$ = [].slice;
  $ = require('jquery');
  React = require('react');
  ReactDOM = require('react-dom');
  punycode = require('punycode');
  debounce = require('lodash.debounce');
  require('./index.css');
  createClass = compose$(React.createClass, React.createFactory);
  ref$ = React.DOM, div = ref$.div, ol = ref$.ol, li = ref$.li, form = ref$.form, input = ref$.input;
  computeLength = require('react-zh-stroker/lib/data/computeLength');
  Word = require('./EWord').Word;
  Word = React.createFactory(Word);
  WholeWord = require('react-zh-stroker/lib/Word');
  WholeWord = React.createFactory(WholeWord);
  moedict = '//www.moedict.tw/json/';
  getData = function(id, utfs, cb){
    var x, xs, url, d;
    utfs == null && (utfs = []);
    x = utfs[0], xs = slice$.call(utfs, 1);
    if (!x) {
      return cb(id, []);
    } else {
      url = moedict + "" + x + ".json";
      d = $.getJSON(moedict + "" + x + ".json");
      d.done(function(r){
        return getData(id, xs, function(id, rs){
          return cb(id, [r].concat(slice$.call(rs)));
        });
      });
      return d.fail(function(){
        return getData(id, xs, function(id, rs){
          return cb(id, rs);
        });
      });
    }
  };
  getDataFromWords = debounce(function(id, words, cb){
    var codes, res$, i$, len$, code;
    words == null && (words = []);
    codes = punycode.ucs2.decode(words);
    res$ = [];
    for (i$ = 0, len$ = codes.length; i$ < len$; ++i$) {
      code = codes[i$];
      res$.push(code.toString(16));
    }
    codes = res$;
    return getData(id, codes, cb);
  }, 1000);
  DEFAULT_WIDTH = 96;
  DEFAULT_HEIGHT = 96;
  DEFAULT_COUNT = 8;
  App = createClass({
    displayName: 'App',
    getDefaultProps: function(){
      return {
        charWidth: DEFAULT_WIDTH,
        charHeight: DEFAULT_HEIGHT,
        charCount: DEFAULT_COUNT
      };
    },
    getInitialState: function(){
      return {
        id: 0,
        words: '',
        data: []
      };
    },
    componentDidUpdate: function(prevProps, prevState){
      var words, this$ = this;
      words = this.state.words;
      if (words !== prevState.words) {
        this.state.id += 1;
        return getDataFromWords(this.state.id, words, function(id, data){
          if (id >= this$.state.id) {
            return this$.setState({
              data: data
            });
          }
        });
      }
    },
    componentWillUnmount: function(){
      return getDataFromWords.cancel();
    },
    render: function(){
      var ref$, charWidth, charHeight, charCount, words, data, key, d, this$ = this;
      ref$ = this.props, charWidth = ref$.charWidth, charHeight = ref$.charHeight, charCount = ref$.charCount;
      ref$ = this.state, words = ref$.words, data = ref$.data;
      return form({
        className: 'app'
      }, div({
        className: 'input-text'
      }, input({
        value: words,
        onChange: function(e){
          return this$.setState({
            words: e.target.value
          });
        }
      })), Row({
        charWidth: charWidth,
        charHeight: charHeight,
        charCount: charCount
      }, (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = data).length; i$ < len$; ++i$) {
          key = i$;
          d = ref$[i$];
          results$.push(Col({
            key: key,
            charWidth: charWidth,
            charHeight: charHeight,
            charCount: charCount,
            data: computeLength(d)
          }));
        }
        return results$;
      }())));
    }
  });
  Row = createClass({
    displayName: 'Row',
    getDefaultProps: function(){
      return {
        charWidth: DEFAULT_WIDTH,
        charHeight: DEFAULT_HEIGHT,
        charCount: DEFAULT_COUNT
      };
    },
    render: function(){
      var ref$, children, charWidth, charHeight, charCount;
      ref$ = this.props, children = ref$.children, charWidth = ref$.charWidth, charHeight = ref$.charHeight, charCount = ref$.charCount;
      return div({
        className: 'row',
        style: {
          display: 'flex',
          flexFlow: 'row wrap'
        }
      }, children);
    }
  });
  Col = createClass({
    displayName: 'Col',
    getDefaultProps: function(){
      return {
        charWidth: DEFAULT_WIDTH,
        charHeight: DEFAULT_HEIGHT,
        charCount: DEFAULT_COUNT,
        data: null
      };
    },
    render: function(){
      var word, ref$, charWidth, charHeight, charCount, lineCount, fillCount, i;
      word = this.props.data.word;
      ref$ = this.props, charWidth = ref$.charWidth, charHeight = ref$.charHeight, charCount = ref$.charCount;
      lineCount = 2 * Math.ceil(word.length / charCount);
      fillCount = charCount * lineCount - word.length;
      return div({
        className: 'col',
        style: {
          display: 'flex',
          flexDirection: 'column'
        }
      }, div({
        className: 'whole-word',
        style: {
          width: charWidth * lineCount,
          height: charHeight
        }
      }, WholeWord({
        data: this.props.data,
        width: charWidth,
        height: charHeight,
        progress: Infinity
      })), ol({
        className: 'printing',
        style: {
          display: 'flex',
          flexFlow: 'column wrap',
          alignItems: 'flex-end',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          width: charWidth * lineCount,
          height: charHeight * charCount
        }
      }, (function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = word.length; i$ < to$; ++i$) {
          i = i$;
          results$.push(li({
            key: i,
            className: 'partial',
            style: {
              width: charWidth,
              height: charHeight
            }
          }, div({
            className: 'grid',
            style: {
              width: charWidth,
              height: charHeight
            }
          }), div({
            className: 'word'
          }, Word({
            data: this.props.data,
            width: charHeight,
            height: charWidth,
            progress: i
          }))));
        }
        return results$;
      }.call(this)), (function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = fillCount; i$ < to$; ++i$) {
          i = i$;
          results$.push(li({
            key: word.length + i,
            className: 'partial',
            style: {
              width: charWidth,
              height: charHeight
            }
          }, div({
            className: 'grid',
            style: {
              width: charWidth,
              height: charHeight
            }
          })));
        }
        return results$;
      }())));
    }
  });
  ReactDOM.render(App({}), document.getElementById('container'));
  function compose$() {
    var functions = arguments;
    return function() {
      var i, result;
      result = functions[0].apply(this, arguments);
      for (i = 1; i < functions.length; ++i) {
        result = functions[i](result);
      }
      return result;
    };
  }
}).call(this);
