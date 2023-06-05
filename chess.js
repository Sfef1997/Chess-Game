
const gameBoard = document.querySelector(".gameborad")
const player = document.querySelector(".player")
const info = document.querySelector("#info")

// Initial chessboard setup
const startPieces =[
rook, knight, bishop ,queen , king ,bishop ,knight,rook,
pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
"", "", "", "", "", "", "", "",
"", "", "", "", "", "", "", "",
"", "", "", "", "", "", "", "",
"", "", "", "", "", "", "", "",
pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
rook, knight, bishop ,queen , king ,bishop ,knight, ,rook,
]
const width = 8;
let playerGo ="black"
player.textContent = "Black"


// Create the chessboard

function  creatBorad(){
    startPieces.forEach((startPices,i)=>{
        const square = document.createElement("div")
        square.setAttribute("square-id",i)
        square.classList.add("square")
        square.firstChild?.setAttribute("draggable",true) 
        square.innerHTML = startPices
        // Styling squaers Color
        const row = Math.floor( (63 - i ) / 8) + 1
        if(row % 2 === 0 ){
            square.classList.add( i % 2 === 0 ? "biege"   : "brown")
        }else{
            square.classList.add( i % 2 === 0 ? "brown"   : "biege")
        }
        // Add class to black and white player pieces
           if( i <= 15){
            square.firstChild.classList.add("black") 
            // add own Class on the Secound  Play to Change His Color
        }else if(i >= 48){
             square.firstChild.classList.add("white") 
        }
         square.firstChild?.setAttribute("draggable",true) 
        gameBoard.append(square)
        
    })
};

creatBorad()


const allSquaers = document.querySelectorAll(".square")



allSquaers.forEach((square=>{

    square.addEventListener("dragstart",dragStart)
    square.addEventListener("dragover",dragOver)
    square.addEventListener("drop",dragDrop)
}))

let startPositionId 
let draggedElment 
function dragStart(e){
    startPositionId =e.target.parentNode.getAttribute("square-id")
    draggedElment = e.target
    
}


function dragOver(e){
    e.preventDefault()
   
}

function dragDrop(e){
    e.stopPropagation()
    const correctGo = draggedElment.classList.contains(playerGo)
    const taken = e.target.classList.contains("pices")
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo === "white" ? "black" : "white"
    const takenByOpponent = e.target.classList.contains(opponentGo)

    if(correctGo){
        if(takenByOpponent && valid){
            // Move piece if valid move and capture opponent piece
            e.target.parentNode.append(draggedElment)
            e.target.remove()
            checkWinners()
            changPlayerNow()
            return
        }
        if(taken && !takenByOpponent){
              // Display error message if move is invalid
            info.innerHTML="you Cannot go here"
            setTimeout(() => {info.innerHTML = ""}, 2000);
            return 
        }
        if(valid){
            // Move piece if valid move
            e.target.append(draggedElment)
            checkWinners();
            changPlayerNow();
            return
        }
    }
    changPlayerNow()
}

function checkIfValid(target){
    // Check if the move is valid for the selected piece
    const targetId = Number(target.getAttribute("square-id"))|| 
                    Number(target.parentNode.getAttribute("square-id"))
    const startId = Number(startPositionId)
    const piece = draggedElment.id
    switch(piece){
        case "pawn" :
            const  starterRow = [8,9,10,11,12,13,14,15]
            if(
                starterRow.includes(startId) && startId + width * 2 === targetId ||
                startId + width  === targetId ||
                startId + width - 1 === targetId  && document.querySelector(`[square-id ="${startId + width - 1}"]`).firstChild  ||
                startId + width + 1 === targetId  && document.querySelector(`[square-id ="${startId + width + 1}"]`).firstChild  
                
                ){
                    return true
                }
                break;
                case "knight" :
                    if(
                            startId + width * 2 + 1 === targetId ||
                            startId + width * 2 - 1  === targetId ||
                            startId + width - 2  === targetId ||
                            startId + width + 2 === targetId  ||

                            startId - width * 2 + 1 === targetId ||
                            startId - width * 2 - 1  === targetId ||
                            startId - width - 2  === targetId ||
                            startId - width + 2 === targetId  
                    ){
                        return true
                    }
                    break;
                    case "bishop" :
                        if(
                           Math.abs(targetId % width - startId % width) ===
                            Math.abs(Math.floor(targetId / width) - Math.floor(startId / width))
                        ){
                           return (startId, targetId);
                        }
                         break;
                         case "rook" :
                         if(
                            Math.abs(targetId % width - startId % width) === 0 ||
                            Math.floor(targetId / width) === Math.floor(startId / width)
                         ){
                            return true
                         }
                         break;
                         case "queen" :
                            if(
                                Math.abs(targetId % width - startId % width) ===
                                Math.abs(Math.floor(targetId / width) - Math.floor(startId / width)) ||
                                Math.abs(targetId % width - startId % width) === 0 ||
                                Math.floor(targetId / width) === Math.floor(startId / width)
                            ){
                                return true
                            } break;
                            case "king" :
                                if(
                                        targetId === startId - 1 ||
                                        targetId === startId + 1 ||
                                        targetId === startId - width ||
                                        targetId === startId + width ||
                                        targetId === startId - width - 1 ||
                                        targetId === startId - width + 1 ||
                                        targetId === startId + width - 1 ||
                                        targetId === startId + width + 1
                                ){
                                    return true
                                        
                                }
    }
}
// Function to change the current player's turn
function changPlayerNow (){
    if(playerGo == "black"){
         reverseIds()
        playerGo = "white"
        player.textContent="white"
    }else{
        reverteIds()
        playerGo = "black"
        player.textContent="black"
    }
}
// Function to reverse square IDs for white player's turn
function reverseIds(){
    const allSquares =document.querySelectorAll(".square")
    allSquares.forEach((square,i)=>{    
    square.setAttribute("square-id",( width * width -1 ) -i)
    })
}

// Function to revert square IDs for black player's turn
function reverteIds(){
    const allSquares =document.querySelectorAll(".square")
    allSquares.forEach((square,i)=>{
    square.setAttribute("square-id" , i )
    })   
}   

    // Function to check if there are any winners    
function checkWinners(){
    const kings = Array.from(document.querySelectorAll("#king"))
    if(!kings.some(king=> king.classList.contains("white"))){
        info.innerHTML = "Blacked player Is wins" 
        allSquaers.forEach((square)=>{
         square.firstElementChild?.setAttribute("draggable",false)
        })
    } if(!kings.some(king=> king.classList.contains("black"))){
        info.innerHTML = "white player Is wins" 
                 allSquaers.forEach((square)=>{
            square.firstElementChild?.setAttribute("draggable",false)
        })
    }
}
