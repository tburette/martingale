function rouletteColor(bet, color){
    //no need for color!
    if(Math.random() * 37 < 18)//=P(18/37)
	return bet * 2;
    else
	return 0;
}

function martingale(initialMoney, goalMoney){
    var BLACK = 0;
    var WHITE = 1;

    var money = initialMoney;    
    var bet = 1;
    var color = BLACK;


    while(money < goalMoney && money >= bet){
	money -= bet;
	var result = rouletteColor(bet, BLACK);
	money += result;
	
	if(result == 0){//lost
	    bet *= 2;
	}else{//won
	    color = 1 - color;
	    bet = 1;
	}
    }
    return money;
}

function attemptsAffordable(money){
    //doesn't work (floating point imprecision)
    //return Math.floor(Math.log2(money+1))

    var attempts = 0;
    //x attempts cost 2^x - 1
    while(Math.pow(2, attempts)-1 <= money) attempts++;
    return attempts - 1;
}

/*
Accuracy limited by the use of javascript numbers which are double floating numbers

could reduce amount of computation by grouping
eg.: initial 100, goal 150.
between 100->126 can do 6 attempts, do a single:ProbabilityLosing7TimesInARow^27
instead of multiplying for each value between 100 and 126
between 127-> 150 can do 7 attempts, do: ProbabilityLosing8TimesInARow^23
*/
function oddsSuccess(initialMoney, gained){
    var goalMoney = initialMoney + gained;

    var oddsWinning = 1;

    /* 
     Martingale works through a series of round where we double the bet until a win.
     Net gain each round = 1 unit. eg. lose 3 times then win: -1 -2 -4 + 8 = 1.
     Each round we win 1 unit unless we had a losing streak bigger than our bankroll
     each iteration of the loop below = 1 martingale round
    */
    for(var money = initialMoney;money < goalMoney;money++){
	var oddsLosingThisRound = Math.pow(19/37, attemptsAffordable(money));
	//oddsWinning = oddsWinning - (oddsWinning * oddsLosingThisRound);
	oddsWinning = oddsWinning * (1 - oddsLosingThisRound);
    }
    return oddsWinning;
}


function oddsSuccessExperimental(initialMoney, gained){
    var attempts = 50000;
    var martingales = _.range(attempts).map(function(){
	return martingale(initialMoney, initialMoney + gained);
    });
    return martingales.filter(function(r){return r >= initialMoney+gained;}).length / attempts;
}

function averageReturn(initialMoney, gained){
    var attempts = 100000;
    var martingales = _.range(attempts).map(function(){
	return martingale(initialMoney, initialMoney + gained);
    });
    return martingales.reduce(function(x, y){return x+y;}) / attempts;
}


