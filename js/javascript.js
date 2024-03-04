const canvas = document.querySelector('canvas');
const $sprite = document.querySelector('#sprite');
const $bloque = document.querySelector('#bloque');

const ctx = canvas.getContext('2d');//contexto de dibujo
canvas.width = 448;
canvas.height= 500;
//presion de teclas
let derecha  = false;
let izquierda = false;
//velocidad de paleta
const sensibilidad = 7;
//variables de los ladrillos

const filas = 6;
const columnas = 13;
const altura_ladrillos = 40;
const ancho_ladrillos = 30;
const separacion_ladrilos = 2;
const separacion_arriba = 50;
const separacion_izquierda = 20;
const ladrillos = [];

const estado = {
    sano : 1, 
    roto : 0
}

for(let c = 0 ; c < columnas ; c++){
    ladrillos[c] = [];
    for(let f = 0 ; f < filas ; f++){
        const ladrillox = c * (ancho_ladrillos + separacion_ladrilos)+separacion_izquierda; 
        const ladrilloy = f * (altura_ladrillos + separacion_ladrilos)+separacion_arriba; 

        const random = Math.floor(Math.random()*8);

        ladrillos[c][f] = {x:ladrillox ,y:ladrilloy , status: estado.sano , color:random}
    }
}

 //PELOTA******************************************************
 const radio = 4;
 let x = canvas.width/2; 
 let y = canvas.height-40;
//VELOCIDAD DE LA PELOTA
let dx = 3;
let dy = -2;
//DIBUJAR PELOTA
function dibujar_pelota(){
    ctx.beginPath();
    ctx.arc(x,y,radio,0,Math.PI * 2);
    ctx.fillStyle ='#fff';
    ctx.fill();
    ctx.closePath();
}
//MOVIMIENTO PELOTA
function Mover_Pelota(){
    //REBONTE EN LOS LATERALES
    if(x + dx > canvas.width-radio || x + dx< radio){
        dx = -dx ;
    }
    //REBOTE ARRIBA
    if(y+dy < radio){
        dy = -dy;
    }
    const tocalapaletax = x > paletaX && x < paletaX + paleta_ancho;
    const tocalapaletay = y + dy > paletaY;
    if(tocalapaletax && tocalapaletay){//rebote en la paleta
        dy = -dy;
    }else if(y + dy > canvas.height){//pierdes
        document.location.reload();
    }
    //MOVIMIENTO NORMAL
    x += dx;
    y += dy;
}
//LADRILLOS*******************************************
function dibujar_ladrillos(){
    for(let c = 0 ; c < columnas ; c++){
        for(let f = 0 ; f < filas ; f++){
             const ladrillosactual = ladrillos[c][f];
             if (ladrillosactual.estado === estado.roto){
                continue;}
                const clipx =  ladrillosactual.color *16;
                ctx.drawImage(
                    $bloque,
                    clipx,
                    2,
                    16,
                    15,
                    ladrillosactual.x,
                    ladrillosactual.y,
                    ancho_ladrillos,
                    altura_ladrillos
                )     

     }
    }
}
//COLISIONES******************************************

function detectar_colision(){
    for(let c = 0 ; c < columnas ; c++){
        for(let f = 0 ; f < filas ; f++){
             const ladrillosactual = ladrillos[c][f];
             if (ladrillosactual.estado === estado.roto){
                continue;}

                const choca_ladrillox = x>ladrillosactual.x && 
                x< ladrillosactual.x + ancho_ladrillos;
   
                const choca_ladrilloy = y > ladrillosactual.y &&
                y< ladrillosactual.y + altura_ladrillos;
   
   
                if(choca_ladrillox && choca_ladrilloy){
                   dy = -dy;
                   ladrillosactual.estado = estado.roto;
             }
           
}
            }
}

//PALETA**********************************************
const paleta_altura = 10;
const paleta_ancho = 45;

let paletaX = (canvas.width - paleta_ancho)/2;
let paletaY = canvas.height - paleta_altura - 10;


function dibujar_paleta(){

    ctx.drawImage(
       $sprite,
       30,
       174,
       paleta_ancho,
       paleta_altura,
       paletaX,
       paletaY,
       paleta_ancho,
       paleta_altura
    )

}

function Mover_paleta(){
    if(derecha && paletaX < canvas.width - paleta_ancho){
        paletaX += sensibilidad;
    } else if(izquierda && paletaX > 0){
        paletaX -= sensibilidad;
    }
}



//EVENTOS**********************

function Eventos(){
    document.addEventListener('keydown',KeyDownHandler);
    document.addEventListener('keyup',KeyupHandler);

    function KeyDownHandler(event){
        const {key} = event;

        if(key === 'Right' || key === 'ArrowRight'){
            derecha = true;
        }else if (key === 'Left' || key==='ArrowLeft'){
            izquierda = true;
        }

    }

    function KeyupHandler(event){
        const {key} = event;

        if(key === 'Right' || key === 'ArrowRight'){
            derecha = false;
        }else if (key === 'Left' || key==='ArrowLeft'){
            izquierda = false;
        }

    }

}

//BORRAR y REDIBUJAR
function limpiar(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
}


function gameloop(){
    limpiar();
    dibujar_pelota();
    dibujar_paleta();
    dibujar_ladrillos();
    Mover_Pelota();
    Mover_paleta();
    detectar_colision();
    window.requestAnimationFrame(gameloop);
}



gameloop();
Eventos();