var c = $("#myCanvas")[0];
var ctx = c.getContext("2d");

var url = 'https://ucslpcontenidos-agario.herokuapp.com/';
var color = "red";
var misDatos = {
  nom: "Adrian",
  pos: [Math.random()*800,Math.random()*800],
  tam: 12,
  col: color
}
//Math.random()*800,Math.random()*800

var jugadores = [];
var bolitas = [];
var d = null;

setInterval(Dibujar, 100);
  jugar();
function jugar(){
  $.get(url + '?' + $.param({
    jugador: JSON.stringify(misDatos)
  }), actualizar);
}

function actualizar(e){
  jugadores = e[0];
  bolitas = e[1];
  Juez();
  comeBolitas();
  jugar();
}

$("#R").click(()=>{
  misDatos.col = "red";
  jugar();
});
$("#G").click(()=>{
  misDatos.col = "green";
  jugar();
});
$("#B").click(()=>{
  misDatos.col = "blue";
  jugar();
});

function Creador(c,ctx,x){
  var posx = x.pos[0];
  var posy = x.pos[1];
   posx += 400;
   posy += 400;

  ctx.beginPath();
  ctx.fillStyle = x.col;
  ctx.arc(posx - misDatos.pos[0],posy - misDatos.pos[1],x.tam*2,0,2*Math.PI);
  ctx.fill();
}


function Dibujar(){
  ctx.clearRect(0, 0, 1000, 1000);

  Creador(c,ctx,misDatos);
  for (var i = 0; i < jugadores.length; i++) {
    if(jugadores[i].nom !== "Adrian"){
      Creador(c,ctx,jugadores[i]);
    }
  }
  for (var i = 0; i < bolitas.length; i++) {
    Creador(c,ctx,bolitas[i]);
  }
}

document.addEventListener("keydown", function(e){
  if(e.keyCode == "39"){
    misDatos.pos[0]+=10;
    jugar();
  } else if(e.keyCode == "37"){
    misDatos.pos[0]-=10;
    jugar();
  }
  if(e.keyCode == "40"){
    misDatos.pos[1]+=10;
    jugar();
  }else if(e.keyCode == "38"){
    misDatos.pos[1]-=10;
    jugar();
  }
});

function Juez(){
  if (jugadores.length > 1) {
    for (var i = 0; i < jugadores.length; i++) {
      if(jugadores[i].nom != misDatos.nom){
        if(jugadores[i].dis < (misDatos.tam*2 + jugadores[i].tam*2)){
          $.get(url + '?eliminarJugador=["'+ misDatos.nom +'","'+ jugadores[i].nom +'"]', ()=>{
            for (var i = 0; i < jugadores.length; i++){
              if(jugadores[i].tam > misDatos.tam){
                misDatos.pos[0] = Math.random()*800;
                misDatos.pos[1] = Math.random()*800;
                misDatos.tam = 12;
              }
            }
          });
          misDatos.tam += jugadores[i].tam/10;
        }
      }
    }
  }
}

function comeBolitas(){
  for (var i = 0; i < bolitas.length; i++) {
    var dx = bolitas[i].pos[0] - misDatos.pos[0];
    var dy = bolitas[i].pos[1] - misDatos.pos[1];
    var d = Math.sqrt((dx * dx) + (dy * dy));
    if(d < (misDatos.tam*2 + bolitas[i].tam*2)){
      $.get(url + '?eliminar=' + i , ()=>{console.log("incremento");});
      misDatos.tam += bolitas[i].tam/10;
    }
  }
}
