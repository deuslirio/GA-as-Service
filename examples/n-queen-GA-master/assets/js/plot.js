$(document).ready(function(){

  printChessBoard()

})

function printChessBoard(){

  let info = initInfo();

  let adjust = info.side * info.numberOfQueens

  $("#stage").attr({"width":adjust, "height":adjust})

  for(let i = 0; i < info.numberOfQueens; i++){
    for(let j = 0; j < info.numberOfQueens; j++){
      if((i % 2 && !(j % 2)) || (!(i%2) && j % 2)){
        let y = i * info.side
        let x = j * info.side
        printOneSquare(x, y, info.side, info.CanvasContext)  
      }
    }
  }

}

function printOneSquare(paddingLeft, paddingTop, side, context){

  var ctx = context.getContext("2d")
  ctx.fillRect(paddingLeft, paddingTop, side, side)
  ctx.stroke()

}

function printOneBall(paddingLeft, paddingTop, circ, context){

  var ctx = context.getContext("2d")
  ctx.beginPath()
  ctx.arc(paddingLeft, paddingTop, circ, 0, 2*Math.PI)
  ctx.fillStyle = "orange"
  ctx.fill()

}

function plotSolution(vectorQueens){

  let info = initInfo()

  let adjust = info.side / 2
  
  for(let i = 0; i < vectorQueens.length; i++){
    let x = (i * info.side) + adjust
    let y = vectorQueens[i] * info.side + adjust
    printOneBall(x, y, adjust, info.CanvasContext)
  }

}

function initInfo(){

  let plot = $("#plot").width()
  let numberOfQueens = ($('#nqueens').val() != 0)? $('#nqueens').val() : 8
  let side = Math.floor(plot / numberOfQueens)
  let context = document.getElementById("stage")

  return {"plotWidth":plot, "numberOfQueens":numberOfQueens, "side": side, "CanvasContext": context}
}