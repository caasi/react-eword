$     = require 'jquery'
React = require 'react'
ReactDOM = require 'react-dom'
punycode = require 'punycode'
debounce = require 'lodash.debounce'

require './index.css'

createClass = React.createFactory << React.createClass

{ div, ol, li, form, input } = React.DOM
computeLength = require 'react-zh-stroker/lib/data/computeLength'

{ Word } = require './EWord'
Word = React.createFactory Word

WholeWord = require 'react-zh-stroker/lib/Word'
WholeWord = React.createFactory WholeWord

moedict = '//www.moedict.tw/json/'
getData = (id, utfs = [], cb) ->
  [x, ...xs] = utfs
  if not x
    then cb id, []
    else
      url = "#moedict#x.json"
      d = $.getJSON "#moedict#x.json"
      d.done (r) ->
        id, rs <- getData id, xs
        cb id, [r, ...rs]
      d.fail ->
        id, rs <- getData id, xs
        cb id, rs

getDataFromWords = debounce do
  (id, words = [], cb) ->
    codes = punycode.ucs2.decode words
    codes = for code in codes => code.toString 16
    getData id, codes, cb
  1000

DEFAULT_WIDTH = 96
DEFAULT_HEIGHT = 96
DEFAULT_COUNT = 8

##
# main
App = createClass do
  displayName: 'App'
  getDefaultProps: ->
    charWidth:  DEFAULT_WIDTH
    charHeight: DEFAULT_HEIGHT
    charCount:  DEFAULT_COUNT
  getInitialState: ->
    id: 0
    words: ''
    data: []
  componentDidUpdate: (prevProps, prevState) ->
    { words } = @state
    if words isnt prevState.words
      @state.id += 1
      id, data <~ getDataFromWords @state.id, words
      @setState { data } if id >= @state.id
  componentWillUnmount: ->
    getDataFromWords.cancel!
  render: ->
    { charWidth, charHeight, charCount } = @props
    { words, data } = @state
    form do
      className: 'app'
      div do
        className: 'input-text'
        input do
          value: words
          onChange: (e) ~> @setState { words: e.target.value }
      Row { charWidth, charHeight, charCount },
        for d, key in data
          Col { key, charWidth, charHeight, charCount, data: computeLength d }
Row = createClass do
  displayName: 'Row'
  getDefaultProps: ->
    charWidth:  DEFAULT_WIDTH
    charHeight: DEFAULT_HEIGHT
    charCount:  DEFAULT_COUNT
  render: ->
    { children, charWidth, charHeight, charCount } = @props
    div do
      className: 'row'
      style:
        display: 'flex'
        flex-flow: 'row wrap'
      children
Col = createClass do
  displayName: 'Col'
  getDefaultProps: ->
    charWidth:  DEFAULT_WIDTH
    charHeight: DEFAULT_HEIGHT
    charCount:  DEFAULT_COUNT
    data: null
  render: ->
    { word } = @props.data
    { charWidth, charHeight, charCount } = @props
    lineCount = 2 * Math.ceil(word.length / charCount)
    fillCount = charCount * lineCount - word.length
    div do
      className: 'col'
      style:
        display: 'flex'
        flex-direction: 'column'
      div do
        className: 'whole-word'
        style:
          width: charWidth * lineCount
          height: charHeight
        WholeWord do
          data: @props.data
          width:  charWidth
          height: charHeight
          progress: Infinity
      ol do
        className: 'printing'
        style:
          display: 'flex'
          flex-flow: 'column wrap'
          align-items: 'flex-end'
          list-style: \none
          padding: 0
          margin: 0
          width: charWidth * lineCount
          height: charHeight * charCount
        for i til word.length
          li do
            key: i
            className: 'partial'
            style:
              width: charWidth
              height: charHeight
            div do
              className: 'grid'
              style:
                width: charWidth
                height: charHeight
            div do
              className: 'word'
              Word do
                data: @props.data
                width:  charHeight
                height: charWidth
                progress: i
        for i til fillCount
          li do
            key: word.length + i
            className: 'partial'
            style:
              width: charWidth
              height: charHeight
            div do
              className: 'grid'
              style:
                width: charWidth
                height: charHeight

ReactDOM.render do
  App {}
  document.getElementById \container

