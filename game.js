export var marioY;
export var setMarioY;
export var flowerX = 860;
//export var flowerY = Math.floor(Math.random() * (400 - 200)) + 200;
export var flowerY = 300;
export var textToBeDisplayed;
export var setCheatingText;
export var game;
export var setStatistics;

function sketchProc(processing)
{
    //Images
    var bg = 0;
    var obstacle = 0;
    var gift = 0;
    var player = 0;
    var obstacle2 = 0;
    //Bezier Curve for the obstacle
    var obs0 = [800, 104];
    var obs1 = [56, 300];
    var obs2 = [663, 478];
    var obs3 = [-35, 81];
    var obs2Inc = 0;
    //Coordinates Values
    var obs2X = 840;
    var obs2Y = 104;
    var giftX = 860;
    var giftY = 75;
    //helper variables
    //0 indicates that the games is running, 1 win, -1 game over
    game = 0;
    var giftTaken = false;
    var steelTaken = false;
    var flowerTaken = false;
    var textColor = 0;
    var textRect = 0;
    var marioX;

    //Raise Hand GIF
    var raisehand = [];
    var raisehandframe = 0;
    var raisehandlastframe = 0;

    //Cheating Variables
    textToBeDisplayed = 'NA';
    //Statistics Variables
    var maxAngleUpward = 0;
    var maxAngleDownward = 0;
    var maxTransitionTime = 0;

    setStatistics = function(up , down, max)
    {
        maxAngleUpward = up;
        maxAngleDownward = down;
        maxTransitionTime = max;
    }
    
    setCheatingText = function(text)
    {
        textToBeDisplayed = text;
    }
    processing.setup = function(){
        processing.size(800, 450);
        processing.frameRate(30);
        importImgs();
        var chart = document.getElementById("scatter-plot");
        chart.style.display = "none";
        var stat = document.getElementById("stats");
        stat.style.display = "none";
        var b = document.getElementById("play-again");
        b.style.visibility = 'hidden';
        b.addEventListener("click", buttonClicked, false);
        marioX = 120;
        marioY = 370;
    };
    function buttonClicked(){
        obs2Inc = 0;
        obs2X = 840;
        obs2Y = 104;
        giftX = 860;
        game = 0;
        giftTaken = false;
        steelTaken = false;
        flowerTaken = false;
        marioX = 120;
        marioY = 370;
        flowerX = 860;
        maxAngleDownward = 0;
        maxAngleUpward = 0;
        maxTransitionTime = 0;
        if(flowerY == 300)
        {
            flowerY = 100;
            giftY = 400;
        }
        else{
            flowerY = 300;
            giftY = 75;
        }
        handleReplay();
    }
    function importImgs(){
        player = processing.loadImage("../assets/mario.png");
        bg = processing.loadImage("../assets/back-ground.jpg");
        gift = processing.loadImage("../assets/power-up.png");
        obstacle = processing.loadImage("../assets/obstacle.png");
        obstacle2 = processing.loadImage("../assets/obstacle2.png");
        //load gif images
        for(var i = 0; i < 24; i++) {
            var tmp = processing.loadImage("../assets/raisehand/frame_" + processing.nf(i, 2) + "_delay-0.1s.png");
            raisehand.push(tmp);
        }
    }

    setMarioY = function (value)
    {
        if((value > 64) && (value < 370))
        {
            marioY = value;
        }
    }

    processing.draw = function(){
        if(game == 0){
            processing.imageMode(processing.CORNER);
            processing.image(bg,0,0);
            if(textToBeDisplayed != 'NA')
            {
                var color = processing.color(0, 0, 0);
                var fontSize = 25;
                processing.fill(color);
                processing.textSize(fontSize);
                processing.text(textToBeDisplayed, 20, 80);
            }
            drawAnim();
            drawMario();
            checkHeart();
            checkFlower();
            doBezier();
            drawSteel();
            collisionCheck();
        }
        else if (game == 1 || game == -1)
        {
            handleBasicsWinOrLose();
        }
        
    }
    function handleBasicsWinOrLose(){
        var canvas = document.getElementById("canvas1");
        canvas.style.display = "none";
        var stats = document.getElementById("stats");
        stats.style.display = "block";
        var b = document.getElementById("play-again");
        b.style.visibility = "visible";
        if(game == -1)
        {
            var p = document.getElementById("message");
            p.innerHTML = "Game Over :(";
        }
        else if(game == 1)
        {
            var p = document.getElementById("message");
            p.innerHTML = "Congratulations :)";
        }
        game = -3;
    }
    function handleReplay(){
        var chart = document.getElementById("scatter-plot");
        chart.style.display = "none";
        var stats = document.getElementById("stats");
        stats.style.display = "none";
        var b = document.getElementById("play-again");
        b.style.visibility = 'hidden';
        var canvas = document.getElementById("canvas1");
        canvas.style.display = "block";
    }
    function collisionCheck(){
        var condition1 = (giftX - 20) >= (marioX - 50) && (giftX - 20) <= (marioX + 50);
        var condition2 = (giftX + 20) >= (marioX - 50) && (giftX + 20) <= (marioX + 50);
        //Check on the Heart
        //X-Condition
        if((condition1 || condition2) && (!giftTaken))
        {
            condition1 = (giftY + 15 >= (marioY-50) ) && (giftY + 15 <= (marioY + 50));
            condition2 = (giftY - 15 >= (marioY-50) ) && (giftY - 15 <= (marioY + 50));
            //Y-Condition
            if((condition1 || condition2) && (!giftTaken))
            {
                marioX += 100;
                giftTaken = true;
                if(marioX >= 735)
                {
                    game = 1;
                }  
            }
        }
        //Check on the Flower
        condition1 = (flowerX - 20) >= (marioX - 50) && (flowerX - 20) <= (marioX + 50);
        condition2 = (flowerX + 20) >= (marioX - 50) && (flowerX + 20) <= (marioX + 50);
        if((condition1 || condition2) && (!flowerTaken))
        {
            condition1 = ((flowerY + 20) >= (marioY-50) ) && ((flowerY + 20) <= (marioY + 50));
            condition2 = ((flowerY - 20) >= (marioY-50) ) && ((flowerY - 20) <= (marioY + 50));
            if((condition1 || condition2) && (!flowerTaken))
            {
               marioX -= 40;
               flowerTaken = true;
               if(marioX <= 0)
               {
                   game = -1;
               }
            }
        }
        //Check on the Steel--This steel is fancy and has nothing to do especially
        //with the treatment, thus we make its damage negligible
        condition1 = (obs2X - 20) >= (marioX - 50) && (obs2X - 20) <= (marioX + 50);
        condition2 = (obs2X + 20) >= (marioX - 50) && (obs2X + 20) <= (marioX + 50);
        if((condition1 || condition2) && (!steelTaken))
        {
            condition1 = ((obs2Y + 15) >= (marioY-50) ) && ((obs2Y + 15) <= (marioY + 50));
            condition2 = ((obs2Y - 15) >= (marioY-50) ) && ((obs2Y - 15) <= (marioY + 50));
            if((condition1 || condition2) && (!steelTaken) && (obs2Inc > 0))
            {
                marioX -= 10;
                steelTaken = true;
                if(marioX <= 0)
                {
                   game = -1;
                }
            }
        }

    }
    function checkHeart(){
        processing.imageMode(processing.CENTER);
        giftX -= 2;
        if(giftX <= -35)
        {
            giftX = 860;
            if(giftY == 75){
                giftY = 400;
            }else{
                giftY = 75;
            }
            giftTaken = false;
        }
        if(! giftTaken)
        {
            processing.image(gift, giftX, giftY);
        }
    }
    function drawSteel(){
        processing.imageMode(processing.CENTER);
        if(! steelTaken)
        {
            processing.image(obstacle2, obs2X, obs2Y);
        }
    }
    
    function drawMario(){
        processing.imageMode(processing.CENTER);
        processing.image(player, marioX, marioY);
    }

    function checkFlower(){
 
        processing.imageMode(processing.CENTER);
        flowerX -= 2;
        if(flowerX <= -35)
        {
            flowerX = 860;
            if(flowerY == 300)
            {
                flowerY = 100;
            }else{
                flowerY = 300;
            }
            flowerTaken = false;
        }
        if(! flowerTaken)
            processing.image(obstacle, flowerX, flowerY);
        
    }
    function doBezier()
    {
        if(obs2Inc < 1)
        {
            obs2X= Math.pow((1-obs2Inc), 3) * obs0[0] + 3*obs2Inc*Math.pow((1-obs2Inc), 2)*obs1[0] + 3*Math.pow(obs2Inc, 2)*(1-obs2Inc)*obs2[0] + Math.pow(obs2Inc, 3) * obs3[0];
            obs2Y = Math.pow((1-obs2Inc), 3) * obs0[1] + 3*obs2Inc*Math.pow((1-obs2Inc), 2)*obs1[1] + 3*Math.pow(obs2Inc, 2)*(1-obs2Inc)*obs2[1] + Math.pow(obs2Inc, 3) * obs3[1];
            obs2Inc += 0.003;
        }
        else{
            obs2Inc = 0;
            steelTaken = false;
        }
    }
    function drawAnim(){
        if(textToBeDisplayed == 'Please, Raise your hand a bit more :)'){
            raisehandframe = (raisehandframe + 1) % raisehand.length;
            processing.imageMode(processing.CENTER);
            var img = raisehand[raisehandframe];
            processing.image(img, 400, 225);

            if(raisehandframe == 23 && raisehandlastframe < 20) {
                raisehandframe = 22;
                raisehandlastframe++;
            } else {
                raisehandlastframe = 0;
            }
    }
    }
};

var canvas = document.getElementById("canvas1");
var p = new Processing(canvas, sketchProc);