$(document).ready(function(){

    var currentElement = "";
    
    getNotes();
    // saveNotes();
    //add new note
    $("#btnNew").click(function(){
        //create sticky note - div element, class sticky, id sticky + increment id, text area - jquery draggable
        var id = Math.floor(Math.random() * 100000);
        var newNote = $("<div class='sticky yellow' id='sticky" + id + "'><textarea>Add Your Note</textarea><span class ='ui-icon ui-icon-close'></span></div>").resizable().draggable({stack:".sticky"});
        currentElement = "sticky" + id;
        id++;
        // append to container
        $("#container").append(newNote);
        //set positioning 
        var left = $(this).position().left;
        var top = $(this).position().top + 50;
        $(".sticky").each(function(){
            $(this).css({left:left + "px", top:top + "px", position:"absolute"});
            left += 235;

        });
        saveNotes();
    });

    //Event delgation 
    $("#container").on("click", ".sticky", function(){    //parent -> child (sticky) - change currentElement to selected sticky
        currentElement = $(this).attr("id")

    });
    $("#container").on("click", "textarea", function(){    //click textarea -> move sticky to top of container

        var maximum = getMax(".sticky");        //pass .sticky items into function

        $(this).parent().css("z-index", (maximum+1))         //set z-index maximum + 1
        saveNotes();
    });

    $("#container").on("input", "textarea", function(){         
        saveNotes();
    });
    
    $("#container").on("click", "span.ui-icon-close", function(){    //click textarea -> move sticky to top of container
        $(this).parent().remove(); //select parent element -> remove
        // localStorage.removeItem(currentElement);
        saveNotes();

    });
    $(".box").click(function(){     //change class to color of box selected

        if (currentElement !="")
        {
            var color = $(this).attr("class").split(" ")[0]; // get color from selected box(class: color box -> color only[first item, remove space])

            $("#" + currentElement).removeClass();//remove exsiting class - allows to change color 
            
            $("#" + currentElement).addClass("sticky " + color); // add sticky + color class
            saveNotes();
        }
    });


//Helper Functions
    function getMax(items){ //loop thru stickys, get max z-index value
        var max = -Infinity;
        $(items).each(function(){
                var z =  $(this).css("z-index");
                if (isNaN(z))
                {//if index is not set, set z to 1
                    z = 1;
                }
                max = Math.max(max,z);
         });
         return max;

    }
    //Local storage - save notes
    //get notes
    function getNotes() {
        var stickyNotesData = localStorage.getItem("stickyNotes");
        if (stickyNotesData) { //if stickyNotesData is set
            $("#container").html(stickyNotesData); //pass data thru container
            
            $(".sticky").each(function() { //each index -> set sticky element with  
                var noteId = $(this).attr("id");
                var noteText = localStorage.getItem(noteId);
                $(this).find("textarea").val(noteText);
            });
            // Initialize draggable/resizbale functionality for loaded sticky notes
            $(".sticky").resizable().draggable({stack:".sticky"});
      }
    }
    //save notes to local storage 
    function saveNotes() {
        var stickyNotesData = $("#container").html();
        localStorage.setItem("stickyNotes", stickyNotesData)
        $(".sticky textarea").each(function() { //each sticky textarea-> save id and text
            var noteId = $(this).parent().attr("id");
            var noteText = $(this).val();
            localStorage.setItem(noteId, noteText);
        });
    }
});
