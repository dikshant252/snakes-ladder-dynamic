$(document).ready(function(){

    players = 3;
    players_detail = [  { name: "Dikshant" , token : 'red'   , tile: 0  },
                            { name: "Drishti"  , token : 'blue'  , tile: 0 },
                            { name: "Vaishali" , token : 'yellow', tile: 0 },
                            { name: "Vinod"    , token : 'green' , tile: 0 }]	;
    var row_size = 10;
    var total_tiles = row_size*row_size;
    setBoard(row_size);
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

                var current = players_detail[turn].tile;
                var des = current+d;
                chance(des);
            });
    }

    function chance(des)
    {
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
                    turn = (turn+1)%players;
                    turn_token = players_detail[turn].token;
                    $("#turn").text(players_detail[turn].name+", click dice");
                    $(".dice").css('pointer-events','all');
                }
            });
            players_detail[turn].tile = des;        
        }
        else{
            turn = (turn+1)%players;
            turn_token = players_detail[turn].token;
            $("#turn").text(players_detail[turn].name+", click dice");
            $(".dice").css('pointer-events','all');
        }     
    }

    
    function dice()
    {
        var d = 0;
        //var d1=0
        //var d2=0;
        // for(var i = 0;i<=360;i=i+10)
        // {
        //     $(".dice").animate({ now: i},
        //     {
        //         duration: 1,
        //         step: function(now) {
        //             $(this).css({ transform: 'rotate(' + now + 'deg)' });
        //                     $("#turn").text(now);
        //                     d1 = Math.floor((Math.random() * 6) + 1);
        //                     d2 = Math.floor((Math.random() * 6) + 1);
        //                     $("#dice1").css({'background':'url("images/'+d1+'.png")','background-size':'100%'});
        //                     $("#dice2").css({'background':'url("images/'+d2+'.png")','background-size':'100%'});
        //             },
        //     });
        // }
            //$(".dice").addClass('roll');
            d = Math.floor((Math.random() * 6) + 1);
            //d2 = Math.floor((Math.random() * 6) + 1);
            $(".dice").css({'background':'url("images/'+d+'.png")','background-size':'100%'});
            //$("#dice2").css({'background':'url("images/'+d2+'.png")','background-size':'100%'});
            //$(".dice").removeClass('roll');
        //d = d1+d2;
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
});