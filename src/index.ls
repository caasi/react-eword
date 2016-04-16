$     = require 'jquery'
React = require 'react'
ReactDOM = require 'react-dom'

createClass = React.createFactory << React.createClass

{ ol, li } = React.DOM
{ computeLength } = require 'react-zh-stroker/lib/data'
{ Word } = require './EWord'

Word = React.createFactory Word

##
# main
data <- $.getJSON 'https://www.moedict.tw/json/840c.json'
data = computeLength data

App = createClass do
  displayName: 'App'
  defaultProps: ->
    data: null
  render: ->
    { word } = @props.data
    ol do
      className: 'printing'
      style:
        list-style: \none
        padding: 0
      for i til word.length
        li do
          key: i
          className: 'partial'
          Word do
            data: @props.data
            width:  400
            height: 400
            progress: i

ReactDOM.render do
  App { data }
  document.getElementById \container

