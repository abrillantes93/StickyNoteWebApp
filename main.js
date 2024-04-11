$(document).ready(function(){
    var id = 1;
    var currentElement = "";
    //add new note
    $("#btnNew").click(function(){
        //create sticky note - div element, class sticky, id sticky + increment id, text area - jquery draggable
        var newNote = $("<div class='sticky yellow' id='sticky" + id + "'><textarea>Add Your Note</textarea><span class ='ui-icon ui-icon-close'></span></div>").resizable().draggable({stack:".sticky"});
        currentElement = "sticky" + id;
        id++;
        // append to container
        $("#container").append(newNote);
        var left = $(this).position().left;
        var top = $(this).position().top + 50;
        $(".sticky").each(function(){
            $(this).css({left:left + "px", top:top + "px", position:"absolute"});
            left += 235;

        })



    });
    //Event delgation 
    $("#container").on("click", ".sticky", function(){    //parent -> child (sticky) - change currentElement to selected sticky
        currentElement = $(this).attr("id")
    });
    $("#container").on("click", "textarea", function(){    //click textarea -> move sticky to top of container

        var maximum = getMax(".sticky");        //pass .sticky items into function

        $(this).parent().css("z-index", (maximum+1))         //set z-index maximum + 1

    });
    $("#container").on("click", "span.ui-icon-close", function(){    //click textarea -> move sticky to top of container
        $(this).parent().remove(); //select parent element -> remove

    });
    $(".box").click(function(){     //change class to color of box selected

        if (currentElement !="")
        {
            var color = $(this).attr("class").split(" ")[0]; // get color from selected box(class: color box -> color only[first item, remove space])

            $("#" + currentElement).removeClass();//remove exsiting class - allows to change color 
            
            $("#" + currentElement).addClass("sticky " + color); // add sticky + color class
        }
    });

    function getMax(items){ //loop thru stickys, get max z-index value
        var max = -Infinity;
        $(items).each(function(){
                var z =  $(this).css("z-index");
                if (z == "auto")
                {
                    z = 1;
                }
                max = Math.max(max,z);
        return max;
         });
    }    
});
