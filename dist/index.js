(function(){
  var $, React, ref$, ol, li, computeLength, Word;
  $ = require('jquery');
  React = require('react');
  ref$ = React.DOM, ol = ref$.ol, li = ref$.li;
  computeLength = require('../node_modules/react-zh-stroker/dist/zhStroker/data').computeLength;
  Word = require('./EWord').Word;
  Word = React.createFactory(Word);
  $.getJSON('https://www.moedict.tw/json/840c.json', function(data){
    var App;
    data = computeLength(data);
    App = React.createClass({
      displayName: 'App',
      getDefaultProps: function(){
        return {
          data: null
        };
      },
      render: function(){
        var word, i;
        word = this.props.data.word;
        return ol({
          className: 'printing',
          style: {
            listStyle: 'none',
            padding: 0
          }
        }, (function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = word.length; i$ < to$; ++i$) {
            i = i$;
            results$.push(li({
              className: 'partial'
            }, Word({
              key: i,
              data: this.props.data,
              width: 50,
              height: 50,
              progress: i
            })));
          }
          return results$;
        }.call(this)));
      }
    });
    App = React.createFactory(App);
    return React.render(App({
      data: data
    }), document.getElementById('container'));
  });
}).call(this);
