$(document).ready(function(){

    
    players = 4;
    players_detail = [  { name: "Player_red" , token : 'red'   , tile: 0  },
                            { name: "Player_blue"  , token : 'blue'  , tile: 0 },
                            { name: "Player_green"    , token : 'green' , tile: 0 },
				{ name: "Player_yellow" , token : 'yellow', tile: 0 }]	;
    ladders = [ { start: 6, end: 59},
                { start: 11, end: 90},
                { start: 38, end: 80},
                { start: 68, end: 94} ];

    snakes = [ { start: 98, end: 28},
                { start: 81, end: 15},
                { start: 46, end: 30},
                { start: 28, end: 2}];
    var row_size =10;
    var total_tiles = row_size*row_size;
    setBoard(row_size);
    set_ladders();
    set_snakes();
    var first = 1;
    gameplay(first);
    

    
    function gameplay(first)
    {   
        turn = first-1;
        turn_token = players_detail[first-1].token;
        $("#turn").text(players_detail[turn].name+", click dice");

            $(".dice").click(function(){
                $(this).css('pointer-events','none');
                var d = dice();
                $("#dice_value").text(players_detail[turn].name+" rolled: "+d);
                $("#turn").text(players_detail[turn].name+", click dice");

                chance(d);
            });
    }

    function chance(d)
    {
        var current = players_detail[turn].tile;
        var des = current+d;
        if(des<(total_tiles+1))
        {     
            var l = $("#"+des).position().left+ (0.4*$(".box").width());
            var t = $("#"+des).position().top+ (0.1*$(".box").height());
            $("#"+turn_token+"_token").animate({'left':l,'top':t},500).promise().done(function(){
                if(des == total_tiles)
                {
                    $(".dice").hide();
                    $("#turn").text(players_detail[turn].name+" is winner");
                    $("#dice_value").text("");      
                }
                else
                {
                    check_special(d);
                } 
            });
            players_detail[turn].tile = des;        
        }
        else{
            check_special(d);
        }    
    }
    function check_special(d)
    {
        let cur = players_detail[turn].tile;
        if(d==6)
        {
            let d = dice();
            $("#dice_value").text(players_detail[turn].name+" rolled: "+d+" after 6");
            chance(d);
        }
        else if($("#"+cur).attr('lad'))
        {
            let des = $("#"+cur).attr('lad_value');
            chance(des-cur);
        }
        else if($("#"+cur).attr('sna'))
        {
            let des = $("#"+cur).attr('sna_value');
            chance(des-cur);
        }
        else{
            change_turn();
        }
        
    }
    function change_turn()
    {
        turn = (turn+1)%players;
        turn_token = players_detail[turn].token;
        $("#turn").text(players_detail[turn].name+", click dice");
        $(".dice").css('pointer-events','all');
    }
    
    function dice()
    {
        var d = 0;
        d = Math.floor((Math.random() * 6) + 1);
        $(".dice").css({'background':'url("images/'+d+'.png")','background-size':'100%'});
        return d;
    }

    function setBoard(row_size)
    {
        var flip = row_size%2 ? false:true;
        for(var i = row_size;i>=1;i--)
        {
            var temp = row_size*i;
            var row = '<div class="row" id="row'+i+'">';
            if(flip)
            {
                for(var j = 0;j<row_size;j++)
                {
                    row += '<div class="box" id="'+(temp-j)+'">'+(temp-j)+'</div>';
                }
                flip = !(flip);
            }
            else{
                for(var j = row_size-1;j>=0;j--)
                {
                    row += '<div class="box" id="'+(temp-j)+'">'+(temp-j)+'</div>';
                }
                flip = !(flip);
            } 
            row += '</div>';
            $(".game").append(row);
        }


        var game_height = $(".game").height();
        var game_width = $(".game").width();
        $(".row").css({'height':game_height/row_size});
        $(".box").css({'width':game_width/row_size});
    }

    function set_ladders()
    {
        $.each(ladders,function(obj)
        {
            //console.log(ladders[obj].start+" "+ladders[obj].end);
            let lad_start = ladders[obj].start;
            let lad_end = ladders[obj].end;
            //$("#"+lad_start).css('background','#00ff40');
            $("#"+lad_start).attr('lad',true);
            $("#"+lad_start).attr('lad_value',lad_end);
            
            var end_left = $("#"+lad_end).position().left+ (0.2*$(".box").width());
            var end_top = $("#"+lad_end).position().top+ (0.5*$(".box").height());
            var start_left = $("#"+lad_start).position().left+ (0.2*$(".box").width());
            var start_top = $("#"+lad_start).position().top+ (0.5*$(".box").height());

            var l = Math.sqrt(((end_left-start_left)*(end_left-start_left))+((end_top-start_top)*(end_top-start_top)));
            var h = start_top-end_top;
            var theta = Math.acos(h/l);
            theta = theta*(180/Math.PI);
            if((start_left-end_left) > 0){
                theta -= 2*theta;
            }
            //console.log(l+" "+h+" "+l/h);
            $(".game").append('<div class="ladder" id="lad'+lad_start+'"></div>');
            $("#lad"+lad_start).css({
                'top' : end_top,
                'left': end_left,
                'height':l,
                'transform' : 'rotate('+theta+'deg)',
                'transform-origin' : 'top center'
            });
        });
    }
    function set_snakes()
    {
        $.each(snakes,function(obj)
        {
            let sna_start = snakes[obj].start;
            let sna_end = snakes[obj].end;
            //$("#"+sna_start).css('background','#d22d2d');
            $("#"+sna_start).attr('sna',true);
            $("#"+sna_start).attr('sna_value',sna_end);

            var end_left = $("#"+sna_end).position().left+ (0.2*$(".box").width());
            var end_top = $("#"+sna_end).position().top+ (0.5*$(".box").height());
            var start_left = $("#"+sna_start).position().left+ (0.2*$(".box").width());
            var start_top = $("#"+sna_start).position().top+ (0.5*$(".box").height());

            var l = Math.sqrt(((start_left-end_left)*(start_left-end_left))+((start_top-end_top)*(start_top-end_top)));
            var h = end_top-start_top;
            var theta = Math.acos(h/l);
            theta = theta*(180/Math.PI);
            if((start_left-end_left) < 0){
                theta -= 2*theta;
            }

            $(".game").append('<div class="snake" id="sna'+sna_end+'"></div>');
            $("#sna"+sna_end).css({
                'top' : start_top,
                'left': start_left,
                'height':l,
                'transform' : 'rotate('+theta+'deg)',
                'transform-origin' : 'top center'
            });
        });
    }
});