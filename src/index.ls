$     = require 'jquery'
React = require 'react'

{ ol, li } = React.DOM
{ computeLength } = require '../node_modules/react-zh-stroker/dist/zhStroker/data'
{ Word } = require './EWord'

Word = React.createFactory Word

##
# main
data <- $.getJSON 'https://www.moedict.tw/json/840c.json'
data = computeLength data

App = React.createClass do
  displayName: 'App'
  getDefaultProps: ->
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
          className: 'partial'
          Word do
            key: i
            data: @props.data
            width:  50
            height: 50
            progress: i
App = React.createFactory App

React.render do
  App { data }
  document.getElementById \container

