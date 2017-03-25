(function(){
  var React, ReactDOM, ref$, svg, g, div, Stroke, Word;
  React = require('react');
  ReactDOM = require('react-dom');
  ref$ = React.DOM, svg = ref$.svg, g = ref$.g, div = ref$.div;
  Stroke = require('react-zh-stroker/lib/Stroke');
  Stroke = React.createFactory(Stroke);
  Word = module.exports = React.createClass({
    displayName: 'EWord.Word',
    getDefaultProps: function(){
      return {
        data: {
          word: [],
          length: 0
        },
        x: 0,
        y: 0,
        width: 410,
        height: 410,
        color: 'black',
        highlight: 'red',
        progress: 0
      };
    },
    render: function(){
      var word, ref$, key, progress, i, stroke;
      word = this.props.data.word;
      ref$ = this.props, key = ref$.key, progress = ref$.progress;
      if (progress < 0) {
        progress = 0;
      }
      if (progress > word.length) {
        progress = word.length;
      }
      return svg({
        width: this.props.width,
        height: this.props.height,
        viewBox: "0 0 2050 2050",
        version: 1.1,
        xmlns: 'http://www.w3.org/2000/svg'
      }, g({
        x: this.props.x,
        y: this.props.y
      }, (function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = progress; i$ <= to$; ++i$) {
          i = i$;
          stroke = word[i];
          results$.push(Stroke({
            key: i,
            data: stroke,
            color: i !== progress
              ? this.props.color
              : this.props.highlight
          }));
        }
        return results$;
      }.call(this))));
    }
  });
}).call(this);
