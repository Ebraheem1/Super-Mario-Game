export var marioY;
export var setMarioY;
export var flowerX = window.innerWidth + 60;
//export var flowerY = Math.floor(Math.random() * (400 - 200)) + 200;
export var flowerY = 0.67 * window.innerHeight;
export var textToBeDisplayed;
export var setCheatingText;
export var game;
export var setStatistics;

function sketchProc(processing)
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    //Images
    var bg = 0;
    var obstacle = 0;
    var gift = 0;
    var player = 0;
    var obstacle2 = 0;
    //Bezier Curve for the obstacle
    var obs0 = [width, 0.23 * height];
    var obs1 = [0.07 * width, 0.67 * height];
    var obs2 = [0.83 * width, 1.06 * height];
    var obs3 = [-0.04 * width, 0.18 * height];
    var obs2Inc = 0;
    //Coordinates Values
    var obs2X = width + 40;
    var obs2Y = 0.23 * height;
    var giftX = width + 60;
    var giftY = 0.167 * height;
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
        // processing.size(800, 450);
        processing.size(width, height);
        processing.frameRate(30);
        importImgs();
        var chart = document.getElementById("scatter-plot");
        chart.style.display = "none";
        var stat = document.getElementById("stats");
        stat.style.display = "none";
        var b = document.getElementById("play-again");
        b.style.visibility = 'hidden';
        b.addEventListener("click", buttonClicked, false);
        marioX = 0.15 * width;
        marioY = height - 100;
    };
    function buttonClicked(){
        obs2Inc = 0;
        obs2X = width + 40;
        obs2Y = 0.23 * height;
        giftX = width + 60;
        game = 0;
        giftTaken = false;
        steelTaken = false;
        flowerTaken = false;
        marioX = 0.15 * width;
        marioY = height - 100;
        flowerX = width + 60;
        maxAngleDownward = 0;
        maxAngleUpward = 0;
        maxTransitionTime = 0;
        if(flowerY == 0.67 * height)
        {
            flowerY = 0.22 * height;
            giftY = 0.89 * height;
        }
        else{
            flowerY = 0.67 * height;
            giftY = 0.167 * height;
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
        if((value > 64) && (value < height - 100))
        {
            marioY = value;
        }
    }

    processing.draw = function(){
        if(game == 0){
            processing.imageMode(processing.CORNER);
            processing.image(bg,0,0, width, height);

            if(textToBeDisplayed != 'NA')
            {
                var color = processing.color(0, 0, 0);
                var fontSize = 25;
                processing.fill(color);
                processing.textSize(fontSize);
                processing.text(textToBeDisplayed, 0.025 * width, 0.178 * height);
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
                marioX += 200;
                giftTaken = true;
                if(marioX >= width - 50)
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
               marioX -= 80;
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
                marioX -= 20;
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
        if(giftX <= -0.044 * width)
        {
            giftX = width + 60;
            if(giftY == 0.167 * height){
                giftY = 0.89 * height;
            }else{
                giftY = 0.167 * height;
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
        if(flowerX <= -0.044*width)
        {
            flowerX = width + 60;
            if(flowerY == 0.67*height)
            {
                flowerY = 0.22*height;
            }else{
                flowerY = 0.67*height;
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
            processing.image(img, 0.5*width, 0.5*height);

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
