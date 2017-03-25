(function(){
  var $, React, ReactDOM, punycode, createClass, ref$, div, ol, li, span, computeLength, Word, WholeWord, moedict, getData, Row, Col, codes, res$, i$, len$, code, slice$ = [].slice;
  $ = require('jquery');
  React = require('react');
  ReactDOM = require('react-dom');
  punycode = require('punycode');
  require('./index.css');
  createClass = compose$(React.createClass, React.createFactory);
  ref$ = React.DOM, div = ref$.div, ol = ref$.ol, li = ref$.li, span = ref$.span;
  computeLength = require('react-zh-stroker/lib/data/computeLength');
  Word = require('./EWord').Word;
  Word = React.createFactory(Word);
  WholeWord = require('react-zh-stroker/lib/Word');
  WholeWord = React.createFactory(WholeWord);
  moedict = '//www.moedict.tw/json/';
  getData = function(utfs, cb){
    var x, xs;
    utfs == null && (utfs = []);
    x = utfs[0], xs = slice$.call(utfs, 1);
    if (!x) {
      return cb([]);
    } else {
      return $.getJSON(moedict + "" + x + ".json", function(r){
        return getData(xs, function(rs){
          return cb([r].concat(slice$.call(rs)));
        });
      });
    }
  };
  Row = createClass({
    displayName: 'Row',
    render: function(){
      var children;
      children = this.props.children;
      return div({
        style: {
          display: 'flex',
          flexDirection: 'column-reverse'
        }
      }, children);
    }
  });
  Col = createClass({
    displayName: 'Col',
    getDefaultProps: function(){
      return {
        data: null,
        charWidth: 50,
        charHeight: 50,
        charCount: 10
      };
    },
    render: function(){
      var word, ref$, charWidth, charHeight, charCount, i;
      word = this.props.data.word;
      ref$ = this.props, charWidth = ref$.charWidth, charHeight = ref$.charHeight, charCount = ref$.charCount;
      return div({
        style: {
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 5,
          width: charHeight * (charCount + 2) + 1,
          border: 'solid 1px black'
        }
      }, div({
        className: 'word',
        style: {
          borderRight: 'solid 1px black'
        }
      }, span({
        style: {
          display: 'block',
          transform: 'rotate(-90deg)'
        }
      }, WholeWord({
        data: this.props.data,
        width: charHeight,
        height: charWidth,
        progress: Infinity
      }))), ol({
        className: 'printing',
        style: {
          display: 'flex',
          flexFlow: 'row wrap',
          alignItems: 'flex-end',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          width: charHeight * (charCount + 1)
        }
      }, (function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = word.length; i$ < to$; ++i$) {
          i = i$;
          results$.push(li({
            key: i,
            className: 'partial',
            style: {
              width: charHeight,
              height: charWidth
            }
          }, span({
            style: {
              display: 'block',
              transform: 'rotate(-90deg)'
            }
          }, Word({
            data: this.props.data,
            width: charHeight,
            height: charWidth,
            progress: i
          }))));
        }
        return results$;
      }.call(this))));
    }
  });
  codes = punycode.ucs2.decode('然後他就死掉了');
  res$ = [];
  for (i$ = 0, len$ = codes.length; i$ < len$; ++i$) {
    code = codes[i$];
    res$.push(code.toString(16));
  }
  codes = res$;
  getData(codes, function(ds){
    var i, d;
    return ReactDOM.render(Row({}, (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = ds).length; i$ < len$; ++i$) {
        i = i$;
        d = ref$[i$];
        results$.push(Col({
          key: i,
          data: computeLength(d)
        }));
      }
      return results$;
    }())), document.getElementById('container'));
  });
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
