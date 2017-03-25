$     = require 'jquery'
React = require 'react'
ReactDOM = require 'react-dom'
punycode = require 'punycode'

createClass = React.createFactory << React.createClass

{ div, ol, li } = React.DOM
computeLength = require 'react-zh-stroker/lib/data/computeLength'

{ Word } = require './EWord'
Word = React.createFactory Word

WholeWord = require 'react-zh-stroker/lib/Word'
WholeWord = React.createFactory WholeWord

moedict = '//www.moedict.tw/json/'
getData = (utfs = [], cb) ->
  [x, ...xs] = utfs
  if not x
    then cb []
    else
      r  <- $.getJSON "#moedict#x.json"
      rs <- getData xs
      cb [r, ...rs]

##
# main
Row = div
Col = createClass do
  displayName: 'Col'
  getDefaultProps: ->
    data: null
    charWidth:  50
    charHeight: 50
    charCount:  10
  render: ->
    { word } = @props.data
    { charWidth, charHeight, charCount } = @props
    div do
      style:
        display: 'inline-block'
        vertical-align: 'top'
        margin-right: 5
        border: 'solid 1px black'
      div do
        className: 'word'
        style:
          border-bottom: 'solid 1px black'
        WholeWord do
          data: @props.data
          width:  charWidth
          height: charHeight
          progress: Infinity
      ol do
        className: 'printing'
        style:
          display: 'inline-block'
          list-style: \none
          padding: 0
          margin: 0
          width: charWidth
          height: charHeight * charCount
        for i til word.length
          li do
            key: i
            className: 'partial'
            style:
              display: 'inline-block'
            Word do
              data: @props.data
              width:  charWidth
              height: charHeight
              progress: i

codes = punycode.ucs2.decode '然後他就死掉了'
codes = for code in codes => code.toString 16

ds <- getData codes
ReactDOM.render do
  Row {},
    for d, i in ds
      Col { key: i, data: computeLength d }
  document.getElementById \container

