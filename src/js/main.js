/**
 * Created by dbimok on 29.11.15.
 */
(function(){
    var gunman = document.querySelector('.display__gunman'),
        displayHat = document.querySelector('.display__hat'),
        mainDisplay = document.querySelector('.display'),
        startBtn = document.querySelector('.modal__btn'),
        modal = document.querySelector('.modal'),
        displayModal = document.querySelector('.display__modal'),
        displayTime = document.querySelector('.you__time'),
        displayGunmantime = document.querySelector('.gunman__time'),
        displayWin = document.querySelector('.win__number'),
        displayLives = document.querySelector('.live__number'),
        displayBonus = document.querySelector('.display__bonus'),
        displayBonusNumber = document.querySelector('.display__bonus_number'),
        displayScoreNumber = document.querySelector('.footer__score_number'),
        displayRewardNumber = document.querySelector('.reward__number'),
        displayImg = document.querySelector('.modal__img'),
        gunTime = 0,
        total = 0,
        lives = 3,
        win = 0,
        level = 1,
        difference = 0,
        totalSeconds = 0,
        timeShot = 0,
        millisec = 0,
        seconds = 0,
        Reward = 2800,
        bonusLevelReward = 1300,
        playerTimeStart,
        man,
        playerCanShot = false;

    startBtn.addEventListener('click',startNewGame,false);
    gunman.addEventListener('transitionend',startDuel, false);
    window.addEventListener('click', shot, false);


    function startNewGame(){
        console.log(level);

        sfxIntro.play();
        clearModal();
        gunman.classList.add('gunman__move');
        gunTime = gunmanTime(level);
        displayGunmantime.innerHTML = gunTime / 1000 + '';
        setTimeout(function(){
            gunman.style.visibility = 'visible';
        }, 1000);
    }

    function startDuel(){
        sfxIntro.pause();
        gunman.classList.remove('gunman__move');
        gunman.classList.add('gunman__stay');
        sfxWait.play();
        setTimeout(function(){
            gunman.classList.add('gunman__shot');
            pseudoElementVisible();
            sfxFire.play();
            playerCanShot = true;
            playerTimeStart = playerTime();
            starttimer();
        }, 2000);
    }

    function shot() {
        if (playerCanShot){
            sfxShot.play();
            timeShot = diffTime(playerTimeStart, playerEndTime());
            displayTime.innerHTML = (timeShot / 1000).toFixed(2) + '';
            countBonus(timeShot,gunTime);
            if ((timeShot < gunTime) && elementClick(document.onclick) ){
                pseudoElementHidden();
                playerShot();
                stoptimer();
                resettimer();
            } else if (timeShot >= gunTime){
                total = 0;
                pseudoElementHidden();
                gunmanShot();
                stoptimer();
                resettimer();
                gunman.removeEventListener('transitionend', startDuel);
            }
        }
    }

  function display(){
      if (millisec >= 9 ){
          millisec = 0;
          seconds += 1
      } else
          millisec += 1;
     timeShot = seconds + "." + millisec;
     displayTime.innerHTML = timeShot;
     totalSeconds = setTimeout(display,100);
     if (parseFloat(timeShot) >= gunTime/1000){
       pseudoElementHidden();
       stoptimer();
       gunmanShot();
       resettimer();
     }
  }

    function starttimer() {
      if (totalSeconds > 0) {
	       return;
       }
       display();
    }

    function stoptimer() {
        clearTimeout(totalSeconds);
        totalSeconds = 0;
    }

 //function startstoptimer() {
 //  if (totalSeconds >= gunmanTime()) {
 //     clearTimeout(totalSeconds);
 //     totalSeconds = 0;
 //  } else {
 //     display();
 //  }
 //}

    function resettimer() {
        stoptimer();
        millisec = 0;
        seconds = 0;
    }

    function elementClick(){
        var classArr = [];

            var target = event.target || event.srcElement;
            classArr = target.classList;
            if (classArr[0] == 'display__gunman'){

                return true
            } else {
                return false
            }
    }

     function pseudoElementFind(){
         var ss = document.styleSheets,
             arr = [];
         for (var i = 0; i < ss[0].cssRules.length; ++i){
             if (ss[0].cssRules[i].type == 1 && ss[0].cssRules[i].selectorText == '.display__gunman::before'){
                 arr.push(ss[0].cssRules[i])
             }

         }

         return arr
     }

     function pseudoElementVisible(){
         var elementStyle = pseudoElementFind();
         elementStyle[0].style.visibility = 'visible';
     }

     function pseudoElementHidden(){
         var elementStyle = pseudoElementFind();
         elementStyle[0].style.visibility = 'hidden';
     }


    function pseudoElementAfterFind(){
        var ss = document.styleSheets,
            arr = [];
        for (var i = 0; i < ss[0].cssRules.length; ++i){
            if (ss[0].cssRules[i].type == 1 && ss[0].cssRules[i].selectorText == '.display__gunman::after'){
                arr.push(ss[0].cssRules[i])
            }
        }

        return arr
    }

    function pseudoElementWonVisible(){
        var urlWon = '/src/img/youwon.png',
        elementStyleAfter = pseudoElementAfterFind();
        elementStyleAfter[0].style.visibility = 'visible';
        elementStyleAfter[0].style.backgroundImage =  'url(' + urlWon +')';


    }

    function pseudoElementWonHidden(){
        var elementStyle = pseudoElementAfterFind();
        elementStyle[0].style.visibility = 'hidden';
    }

    function pseudoElementLostVisible(){
        var urlLose = '/src/img/youlost.png',
        elementStyleAfter = pseudoElementAfterFind();
        elementStyleAfter[0].style.visibility = 'visible';
        elementStyleAfter[0].style.background = 'url(' + urlLose + ')';

    }

    function pseudoElementLostHidden(){
        var elementStyle = pseudoElementAfterFind();
        elementStyle[0].style.visibility = 'hidden';
    }

    function resetGunman(){
        gunman.classList.remove('gunman__move');
        gunman.classList.remove('gunman__shot');
        gunman.classList.remove('gunman__kill');
        gunman.classList.remove('gunman__stay');
        gunman.classList.remove('gunman__leave');
        gunman.classList.remove('gunman__dead');
        gunman.classList.remove('gunman__drops');
        gunman.classList.remove('gunman__move');
        gunman.classList.remove('gunman__hides_gun');
        gunman.style.visibility = 'hidden';


    }

    function countLives(){
      lives--;
      return lives;
    }

    function countWin(){
      win++;
      displayWin.innerHTML = win + '';
      return win;
    }

    function clearModal(){
        modal.style.visibility = 'hidden';
        //modal.style.transition = 'opacity 2s easy-in-out';
        //modal.style.opacity = '0';
    }



    function findKeyframesRule(){
        var ss = document.styleSheets,
            arr = [];
            for (var i = 0; i < ss[0].cssRules.length; ++i) {
                if (ss[0].cssRules[i].type == 7){
                      arr.push(ss[0].cssRules[i]);
                }

            }

        return arr;
    }


    function changeKeyframesRule(){
        //var man = 0;
        var position = -180;
        var keyframes = findKeyframesRule();
        var cssText = keyframes[0].cssRules[0].cssText;
        console.log(keyframes[0].cssRules[0].cssText);
        man = Math.round(Math.random()*(5 - 1) + 1);
        for (var i = 0; i <= keyframes.length - 1; i++){
            for(var j = 0; j <= keyframes[i].cssRules.length - 1; j++){
                if (level == 1){
                keyframes[i].cssRules[j].style.backgroundPositionY = '0px';
                keyframes[i].cssRules[j].style.backgroundPositionY = position + 'px';
                gunman.style.cssText = 'background-position-y:' + position + 'px;'
                }
                else if (level > 1 && level <= 5){
                    keyframes[i].cssRules[j].style.backgroundPositionY = '0px';
                    keyframes[i].cssRules[j].style.backgroundPositionY = position * (level - 1) + 'px';
                    gunman.style.cssText = 'background-position-y:' + position * (level - 1) + 'px;'
                } else if (level > 5){
                    console.log('man: ' + man);
                    keyframes[i].cssRules[j].style.backgroundPositionY = '0px';
                    keyframes[i].cssRules[j].style.backgroundPositionY = position * (man - 1) + 'px';
                    gunman.style.cssText = 'background-position-y:' + position * (man - 1) + 'px;'
                }
                if(keyframes[i].name == 'goal'){
                    var n = i;
                    keyframes[n].cssRules[j].style.backgroundPositionY = '0px'
                }
                if(keyframes[i].name == 'bounce'){
                    var n = i;
                    keyframes[n].cssRules[j].style.backgroundPositionY = '0px'
                }
            }
        }
        return man;
    }


    function playerTime(){
        return new Date().getTime();
    }

    function playerEndTime(){
        return new Date().getTime();
    }



    function diffTime(playerTimeStart, playerEndTime){
        var timeStat = playerTimeStart,
            endTime = playerEndTime,
            diffTime = (endTime - timeStat) / 1000;

        return diffTime * 1000
    }



    function gunmanTime(){
        var time,firstTime;
        firstTime = 1700;
        time = 300;
        if (level <= 5){
            time = firstTime - (level - 1)*time;
        } else
        if (level > 5){
            time = Math.floor((Math.random()*(400 - 350) + 350));
        }

        return time;
    }


    function playerReward(){
        var totalReward;
        if (level <= 5){
            totalReward = Reward + difference + (level - 1) * bonusLevelReward;
        } else
        if (level > 5){
            totalReward = Reward + difference + (level - 1)*Math.floor((Math.random()*(1600 - 1000) + 1000));
        }

        Reward += bonusLevelReward;
      return totalReward;
    }


    function playerShot(){
      var win = countWin();

        mainDisplay.style.animation = 'goal 0.1s infinite';
        mainDisplay.style.animationIterationCount = '3';


      gunman.classList.add('gunman__drops');
      gunman.classList.add('gunman__dead');

      displayBonusVisible();
      total += playerReward();
      displayScoreNumber.innerHTML = total + '';
      console.log('Totalscore: ' + total);
      displayWin.innerHTML = win + '';
      sfxWin.play();
      level += 1;
        hatAnimate();
          setTimeout(function(){

             pseudoElementWonVisible();
            displayBonusVisible();
          }, 1000);

          setTimeout(function(){
              displayRewardNumber.innerHTML = Reward + '';
              mainDisplay.style.animation = '';
              mainDisplay.style.animationIterationCount = '';

              hatAnimateDisable();

              pseudoElementWonHidden();
              resetCountBonus();
              resetGunman();
              changeKeyframesRule(level);
              mainDisplay.style.backgroundPositionY = '0px';
          }, 2500);

          setTimeout(function(){
              displayBonusHide();
              startNewGame();
              gunman.addEventListener('transitionend', startDuel, false);
              playerTimeStart = playerTime();
              sfxIntro.currentTime = 0;
          },3000);

        playerCanShot = false;
    }


    function gunmanShot(){
      var lives = countLives();
      if (lives != 0){

        gunman.classList.add('gunman__kill');
        gunman.classList.add('gunman__hides_gun');
        displayModal.style.display = 'block';
        displayLives.innerHTML = lives + '';
        pseudoElementLostVisible();

        setTimeout(function(){
            pseudoElementLostHidden();
            gunman.classList.add('gunman__leave');
        }, 3500);
        sfxDeath.play();
        sfxIntro.currentTime = 0;

        setTimeout(function(){
            resetGunman();
            startNewGame();
            gunman.addEventListener('transitionend', startDuel, false);
            displayModal.style.display = 'none';
        }, 7500);

        playerCanShot = false;
      } else {
        gunman.classList.add('gunman__kill');
        gunman.classList.add('gunman__hides_gun');
        displayModal.style.display = 'block';
        displayLives.innerHTML = lives + '';

        setTimeout(function(){
            gunman.classList.add('gunman__leave');
        }, 3500);

        sfxDeath.play();
        sfxIntro.currentTime = 0;

        setTimeout(function(){
            gameOver();
            resetGunman();
            gunman.addEventListener('transitionend', startDuel, false);
            displayModal.style.display = 'none';

        }, 7500);
      }
      playerCanShot = false;
    }

    function displayBonusVisible(){
      displayBonus.style.display = 'block';
    }
    function displayBonusHide(){
      displayBonus.style.display = 'none';
    }

    function countBonus(timeShot, gunmanTime){
      var timeGunman, timePlayer;
      timeGunman = gunmanTime;
      timePlayer = timeShot;
      difference = timeGunman - timePlayer;
      displayBonusNumber.innerHTML = difference + '';
      return difference;
    }

    function resetCountBonus(){
      difference = 0;
    }

    function hatAnimate(){
        //var count = man;
        console.log('HatAnimate ' + man);
        console.log('level' +level);
        var whiteHat = '/src/img/whitehat.png',
            brownHat = '/src/img/brownhat.png',
            redHat = '/src/img/redhat.png';
        displayHat.style.animation = 'bounce 2.5s';
        displayHat.style.animationIterationCount = 'infinite';
        displayHat.style.visibility = 'visible';

        if(level == 2 || man == 1){
            displayHat.style.backgroundImage = 'url('+ brownHat +')';
            //displayHat.style.visibility = 'visible';
        }
        if(level == 3 || man == 2){
            displayHat.style.visibility = 'hidden';
        }
        if(level == 4 || man == 3){
            displayHat.style.visibility = 'hidden';
        }
        if (level == 5 || man == 4){
            displayHat.style.backgroundImage = 'url('+ whiteHat +')';
            //displayHat.style.visibility = 'visible';
        }
        if (level == 6 || man == 5){
            displayHat.style.backgroundImage = 'url('+ redHat +')';
            //displayHat.style.visibility = 'visible';
        }
    }

    function hatAnimateDisable(){
        displayHat.style.visibility = 'hidden';
        displayHat.style.animation = '';
        displayHat.style.animationIterationCount = '';
    }



    function gameOver(){
        var src;
        modal.style.visibility = 'visible';
        //modal.style.transition = '2s';
        //modal.style.opacity = '0.8';
        displayImg.src = '/src/img/gameover.png';
        gunTime = 0;
        total = 0;
        lives = 3;
        win = 0;
        level = 1;
        difference = 0;
        totalSeconds = 0;
        timeShot = 0;
        millisec = 0;
        seconds = 0;
        Reward = 2800;
        bonusLevelReward = 1300;
        playerTimeStart = 0;
        playerCanShot = false;
        displayLives.innerHTML = lives + '';
        displayWin.innerHTML = win + '';
        displayRewardNumber.innerHTML = Reward + '';
        displayScoreNumber.innerHTML = '00000';
        displayTime.innerHTML = '0.0';
    }


    var sfxDeath = new Audio('src/audio/death.m4a');
    var sfxFire = new Audio('src/audio/fire.m4a');
    var sfxFault = new Audio('src/audio/foul.m4a');
    var sfxIntro = new Audio('src/audio/intro.m4a');
    var sfxShot = new Audio('src/audio/shot.m4a');
    var sfxWait = new Audio('src/audio/wait.m4a');
    var sfxWin = new Audio('src/audio/win.m4a');


})();
