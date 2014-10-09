//Odds losing

function percentageToString(number){
    return (number*100).toFixed(3);
}

function oddsLosingUpdate(){
    function oddsLosingPercent(times){
    	return Math.pow((19/37), times)
    }
    
    function oddsLosingChance(times){
	return Math.round(1/oddsLosingPercent(times));
    }
    var number = parseInt($('#oddsLosingXTimes').val(), 10);
    if(isNaN(number) || number < 0){
	$('#oddsLosingPercent').text("");
    	$('#oddsLosingChance').text("");
    }else{
    	$('#oddsLosingPercent').text(percentageToString(oddsLosingPercent(number)));
//    	$('#oddsLosingChance').text(oddsLosingChance(number));
    }
}

$('#oddsLosingXTimes').on('input', oddsLosingUpdate);

oddsLosingUpdate();



//Average return

function averageReturn(initialMoney, gained){
    var attempts = 10000000;
    var martingales = range(attempts).map(function(){
	return martingale(initialMoney, initialMoney + gained);
    });
    return martingales.reduce(function(x, y){return x+y;}) / attempts;
}

function averageReturnUpdate(){
    var starting = parseInt($('#averageStarting').val(), 10);
    var gain = parseInt($('#averageGain').val(), 10);

    if(isNaN(starting) || starting < 0 || isNaN(gain) || gain < 0){
	$('#averageResult').text("");
    }else{
	$('#averageResult').text(averageReturn(starting, gain));
    }
}

$('#averageStarting').on('input', averageReturnUpdate);
$('#averageGain').on('input', averageReturnUpdate);
//averageReturnUpdate();
