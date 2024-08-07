const http = require("http");
const app = require ("express")();
app.get("/", (req,res)=> res.sendFile(__dirname + "/index.js"))
app.listen(9091, () => console.log("Listening on http port 9091"))
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"));

const clients = {};
const games = {};

const wsServer = new websocketServer({
  "httpServer": httpServer

})
wsServer.on("request", request => {
  const connection = request.accept(null, request.origin);
  connection.on("open", () => console.log("opened"))
  connection.on("close", () => {
    if(games != null){
      let x = 0, y = 0, count = 0, gameid, gamenum, turn = false, countready = 0;
      Object.entries(games).forEach(Game =>{
        Game[1].clients.forEach(c=>{
          if(c.clientId === clientId){
            if(c.turn === true){
              turn = true;
            }

            x = count;
            gameid = Game[1].id;
            gamenum = y;
          }
          if(c.ready){
            countready ++;
          }
          count++;


        })
         y++;
          
        
      });
      
      if(games[gameid] != null){
        let turnchange = games[gameid].clients.findIndex(x => x.clientId === clientId) - 1
        if(turnchange >= 0 && turn){
          games[gameid].clients[turnchange].turn = true
        }
        
        games[gameid].clients.splice(x,1)
        
        if(games[gameid].clients[0] != null){
          if(turnchange<0 && turn){
            games[gameid].clients[games[gameid].clients.length - 1].turn = true
          }
          if(games[gameid].clients[0].duty === "Child"){
            games[gameid].clients[0].duty = "Parent"

          }

          const Game = games[gameid]
          if(turn){
            const payLoad = {
              "method": "delete",
              "game" : Game,
              "roundchange" : true
            }
            Game.clients.forEach(c=>{
              clients[c.clientId].connection.send(JSON.stringify(payLoad));
              
            })
          }else{
            console.log(countready + " " + Game.clients.length)
            if(Game.stage == 2 && (countready === Game.clients.length-1)){
              const payLoad = {
                "method": "delete",
                "game" : Game,
                "stage3" : true,
                "client" : clientId
              }
              Game.clients.forEach(c=>{
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
                
              })
            }else{
              const payLoad = {
                "method": "delete",
                "game" : Game,
                "roundchange" : false
              }
              Game.clients.forEach(c=>{
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
                
              })
            }
            
            
          }
          
  
          
        }
        if(games[gameid].clients.length == 0 || (games[gameid].state === "Running" && games[gameid].clients.length <= 2) ){
          const Game = games[gameid]
          const payLoad = {
            "method": "serverClosed",
            "game" : Game
          }
          
  
          Game.clients.forEach(c=>{
            clients[c.clientId].connection.send(JSON.stringify(payLoad));
          })
          games[gameid].clients.length = 0;
          delete games[gameid]
        }
      }
      

      
    }
    
    console.log("closed")
  })
  connection.on("message", message =>{
    const result = JSON.parse(message.utf8Data)
    
    
    if(result.method === "create"){
      const clientId = result.clientId;
      const clientName = result.clientName;
      const gameId = guidServer();
      games[gameId] = {
        "id": gameId,
        "clients": [],
        "availability" : "private",
        "state": "waiting",
        "acronym": "",
        "stage": 1,
        "roundWinner" : ""
      }
      const Game = games[gameId];
      if(Game.clients.length >= 3){
        return;
      }
      const colour = {"0": "Red", "1": "Green", "2": "Blue", "3": "Yellow",  "4": "Orange", "5": "Purple"}[Game.clients.length];
      Game.clients.push({
        "clientId": clientId,
        "clientName": clientName,
        "colour" : colour,
        "duty" : "Parent",
        "score": 0,
        "turn": true,
        "ready": false,
        "answer": ""
        
      })
      const payLoad = {
        "method": "create",
        "game" : Game
      }
      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    }

    
    if(result.method === "RandomServer"){
      const clientId = result.clientId;
      const clientName = result.clientName;
      let Gamecheck = CheckAvailability();
      
      
      //Add If statement to see if the availability is there
      if(Gamecheck === false){
        const gameId = guidServer();
        games[gameId] = {
          "id": gameId,
          "clients": [],
          "availability" : "Public",
          "state": "waiting",
          "acronym": "",
          "stage": 1,
          "roundWinner" : ""
        }
        const Game = games[gameId];
        if(Game.clients.length >= 5){
          return;
        }
        const colour = {"0": "Red", "1": "Green", "2": "Blue", "3": "Yellow",  "4": "Orange", "5": "Purple"}[Game.clients.length];
        Game.clients.push({
          "clientId": clientId,
          "clientName": clientName,
          "colour" : colour,
          "duty": "Parent",
          "score": 0,
          "turn": true,
          "ready": false,
          "answer": ""
        })
        const payLoad = {
          "method": "RandomServer",
          "game" : Game,
          "duty" : "Parent"
        }
        const con = clients[clientId].connection;
        con.send(JSON.stringify(payLoad));
      } else {
        const Game = games[Gamecheck];
        if(Game.clients.length >= 6){
          return;
        }
        let colourList = [];
        Game.clients.forEach(c =>{
          if(c.colour === 'Red'){
            colourList.push(0)
          }
          if(c.colour === 'Green'){
            colourList.push(1)
          }
          if(c.colour === 'Blue'){
            colourList.push(2)
          }
          if(c.colour === 'Yellow'){
            colourList.push(3)
          }
          if(c.colour === 'Orange'){
            colourList.push(4)
          }
          if(c.colour === 'Purple'){
            colourList.push(5)
          }
        })
        let colourchoice;
        if(colourList.includes(0)){
          if(colourList.includes(1)){
            if(colourList.includes(2)){
              if(colourList.includes(3)){
                if(colourList.includes(4)){
                  if(colourList.includes(5)){
                    
                  }else{
                    colourchoice = 5;
                  }
                }else{
                  colourchoice = 4;
                }
              }else{
                colourchoice = 3;
              }
            }else{
              colourchoice = 2;
            }
          }else{
            colourchoice = 1;
          }
        }else{
          colourchoice = 0;
        }
        const colour = {"0": "Red", "1": "Green", "2": "Blue", "3": "Yellow",  "4": "Orange", "5": "Purple"}[colourchoice];
        Game.clients.push({
          "clientId": clientId,
          "clientName": clientName,
          "colour" : colour,
          "duty" : "Child",
          "score": 0,
          "turn": false,
          "ready": false,
          "answer": ""
        })
        if(Game.clients.length >= 6){
          Game.availability = "Full";
        }
  
        const payLoad = {
          "method": "RandomServer",
          "game": Game,
          "duty": "Child",
        }
  
        Game.clients.forEach(c=>{
          clients[c.clientId].connection.send(JSON.stringify(payLoad));
        })
      }
      
    }
    if(games[result.gameId] !== undefined){
      if(result.method === "join"){
        const clientId = result.clientId;
        const clientName = result.clientName;
        const gameId = result.gameId;
        const Game = games[gameId];
        if(Game != null){
          if(Game.clients.length >= 6){
            const payLoad = {
              "method": "serverFull"
            }
    
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
            return;
          }
          let colourList = [];
          Game.clients.forEach(c =>{
            if(c.colour === 'Red'){
              colourList.push(0)
            }
            if(c.colour === 'Green'){
              colourList.push(1)
            }
            if(c.colour === 'Blue'){
              colourList.push(2)
            }
            if(c.colour === 'Yellow'){
              colourList.push(3)
            }
            if(c.colour === 'Orange'){
              colourList.push(4)
            }
            if(c.colour === 'Purple'){
              colourList.push(5)
            }
          })
          let colourchoice;
          if(colourList.includes(0)){
            if(colourList.includes(1)){
              if(colourList.includes(2)){
                if(colourList.includes(3)){
                  if(colourList.includes(4)){
                    if(colourList.includes(5)){
                      
                    }else{
                      colourchoice = 5;
                    }
                  }else{
                    colourchoice = 4;
                  }
                }else{
                  colourchoice = 3;
                }
              }else{
                colourchoice = 2;
              }
            }else{
              colourchoice = 1;
            }
          }else{
            colourchoice = 0;
          }
          const colour = {"0": "Red", "1": "Green", "2": "Blue", "3": "Yellow",  "4": "Orange", "5": "Purple"}[colourchoice];
          Game.clients.push({
            "clientId": clientId,
            "clientName": clientName,
            "colour" : colour,
            "duty" : "Child",
            "score": 0,
            "turn": false,
            "ready": false,
            "answer": ""
          })
    
          const payLoad = {
            "method": "join",
            "game": Game,
          }
    
          Game.clients.forEach(c=>{
            clients[c.clientId].connection.send(JSON.stringify(payLoad));
          })
        }else{
          const payLoad = {
            "method": "join",
            "game" : null
  
          }
          const con = clients[clientId].connection;
          con.send(JSON.stringify(payLoad));
        }
        
  
      }
  
      if(result.method === "count"){
        const gameId = result.gameId;
        const Game = games[gameId];
  
        const payLoad = {
          "method": "count",
          "game": Game
        }
        
      }
  
      if(result.method === "start"){
        const gameId = result.gameId;
        const Game = games[gameId];
        Game.state = "Running"
  
        const payLoad = {
          "method": "start",
          "game": Game
        }
        Game.clients.forEach(c=>{
          clients[c.clientId].connection.send(JSON.stringify(payLoad));
        })
      }
  
      if(result.method === "select"){
        const gameId = result.gameId;
        const Game = games[gameId];
        const word = result.acronym;
        Game.acronym = word;
        Game.stage = 2;
        const payLoad = {
          "method": "select",
          "game": Game
        }
        Game.clients.forEach(c=>{
          clients[c.clientId].connection.send(JSON.stringify(payLoad));
        })
      }
  
      if(result.method === "submit"){
        const gameId = result.gameId;
        const Game = games[gameId];
        const word = result.acronym;
        const user = result.clientId;
        let readycount = 0;
        Game.clients.forEach(c => {
          if(user === c.clientId){
            c.answer = word;
            c.ready = true;
          }
          if(c.ready === true){
            readycount ++;
          }
        })
        if(readycount >= Game.clients.length - 1){
          Game.stage = 3;
        }
        const payLoad = {
          "method": "submit",
          "game": Game
        }
        Game.clients.forEach(c=>{
          clients[c.clientId].connection.send(JSON.stringify(payLoad));
        })
      }
  
      if(result.method === "point"){
        const gameID = result.gameId;
        const Game = games[gameID];
        const word = result.acronym;
        const user = result.user;
        let name;
        Game.clients.forEach(c => {
          if(user == c.clientId){
            c.score ++;
            name = c.clientName;
          }
        })
        Game.roundWinner = name;
        Game.stage = 4;
        Game.acronym = word;
        const payLoad = {
          "method": "point",
          "game": Game,
        }
        Game.clients.forEach(c=>{
          clients[c.clientId].connection.send(JSON.stringify(payLoad));
        })
      }
  
      if(result.method === "round"){
        const gameID = result.gameId;
        const Game = games[gameID];
        let next = false, end = false, restartTurn = false, winner;
        let payLoad;
        let position = Game.clients.length - 1
        if(Game.clients.length === 0){
          position = 0
        }
        const final = Game.clients[position].clientId
        Game.clients.forEach(c =>{
          if(c.score === 7){
            end = true;
          }
        })
        if(end === true){
          Game.stage = 5;
          Game.clients.forEach(c =>{
            c.answer = "";
            c.ready = false;
          })
          payLoad = {
            "method": "round",
            "game": Game,
          }
        }else{
          Game.clients.forEach(c =>{
            if(final === c.clientId && c.turn === true){
              restartTurn = true;
            }
            if(c.turn === true){
              c.turn = false;
              next = c.clientId;
            }
            c.answer = "";
            c.ready = false;
          })
          if(restartTurn === true){
            Game.clients[0].turn = true; 
          }else{
            Game.clients[Game.clients.findIndex(x => x.clientId === next) + 1].turn = true;
          }
          Game.stage = 1;
          payLoad = {
            "method": "round",
            "game": Game,
          }
        }
        
        Game.clients.forEach(c=>{
          clients[c.clientId].connection.send(JSON.stringify(payLoad));
        })
      }
  
      if(result.method === "reset"){
        const gameID = result.gameId;
        const Game = games[gameID];
        Game.clients.forEach(c =>{
          c.score = 0;
          c.ready = false;
          c.turn = false;
        })
        Game.clients[0].turn = true;
        Game.stage = 1;
        const payLoad = {
          "method": "reset",
          "game": Game,
        }
        Game.clients.forEach(c=>{
          clients[c.clientId].connection.send(JSON.stringify(payLoad));
        })
      }
    }
    
  })

  

  function CheckAvailability(){
    let Gamecheck = false;

    Object.entries(games).forEach(a =>{
      if(a[1].availability === "Public"){
        if(a[1].clients.length <=6)
        Gamecheck = a[1].id;
        return Gamecheck;
      }
    });
    return Gamecheck;
  }

  const clientId = guidClient();
  clients[clientId] = {
    "connection": connection
  }

  const payLoad = {
    "method" : "connect",
    "clientID" : clientId
  }

  connection.send(JSON.stringify(payLoad))
})



function S4(){
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

const guidClient = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

const guidServer = () => (S4() + S4() + S4()).toLowerCase();
