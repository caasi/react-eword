$     = require 'jquery'
React = require 'react'
ReactDOM = require 'react-dom'
punycode = require 'punycode'

require './index.css'

createClass = React.createFactory << React.createClass

{ div, ol, li, span } = React.DOM
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
Row = createClass do
  displayName: 'Row'
  render: ->
    { children } = @props
    div do
      style:
        display: 'flex'
        flex-direction: 'column-reverse'
      children
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
        display: 'flex'
        flex-direction: 'row'
        margin-bottom: 5
        width: charHeight * (charCount + 2) + 1
        border: 'solid 1px black'
      div do
        className: 'word'
        style:
          border-right: 'solid 1px black'
        span do
          style:
            display: 'block'
            transform: 'rotate(-90deg)'
          WholeWord do
            data: @props.data
            width:  charHeight
            height: charWidth
            progress: Infinity
      ol do
        className: 'printing'
        style:
          display: 'flex'
          flex-flow: 'row wrap'
          align-items: 'flex-end'
          list-style: \none
          padding: 0
          margin: 0
          width: charHeight * (charCount + 1)
        for i til word.length
          li do
            key: i
            className: 'partial'
            style:
              width: charHeight
              height: charWidth
            span do
              style:
                display: 'block'
                transform: 'rotate(-90deg)'
              Word do
                data: @props.data
                width:  charHeight
                height: charWidth
                progress: i

codes = punycode.ucs2.decode '然後他就死掉了'
codes = for code in codes => code.toString 16

ds <- getData codes
ReactDOM.render do
  Row {},
    for d, i in ds
      Col { key: i, data: computeLength d }
  document.getElementById \container

