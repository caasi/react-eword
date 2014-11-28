React = require 'react'

{ svg, g } = React.DOM
{ Stroke } = require 'react-zh-stroker'

Stroke = React.createFactory Stroke

Word = module.exports = React.createClass do
  displayName: 'EWord.Word'
  getDefaultProps: ->
    data:
      word:   []
      length: 0
    x: 0
    y: 0
    width:  410
    height: 410
    # XXX: Maybe modifying the original Word from color
    # to colors in react-zh-stroker is a better idea.
    color:     \black
    highlight: \red
    progress: 0
  render: ->
    { word } = @props.data
    { progress } = @props
    progress = 0 if progress < 0
    progress = word.length if progress > word.length
    svg do
      width:  @props.width
      height: @props.height
      view-box: "0 0 2050 2050"
      version: 1.1
      xmlns: 'http://www.w3.org/2000/svg'
      g do
        x: @props.x
        y: @props.y
        for i to progress
          stroke = word[i]
          Stroke do
            key:   i
            data:  stroke
            color: if i isnt progress
              then @props.color
              else @props.highlight

