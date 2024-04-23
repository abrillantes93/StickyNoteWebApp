$(document).ready(function(){

    var currentElement = "";

    getNotes();
    //Event delgation 
    $("#btnNew").click(function(){     //add new note
        var id = Math.floor(Math.random() * 100000); //random id
        //create sticky note - div element, class sticky, id sticky + increment id, text area - jquery draggable
        var newNote = $("<div class='sticky yellow' id='sticky" + id + 
            "'><button class= 'ui class ui-icon-close'>X</button><textarea>Add your text</textarea></div>").resizable().draggable({
                stack: ".sticky",
                stop: function(event, ui) {
                    saveNotes(); // save the notes after dragging
                }
            });

        // Append new note to container
        $("#container").append(newNote);

        var left = 0;
        var top = 0;
        $(".sticky").each(function() {
            var notePosition = $(this).position();
            left = Math.max(left, notePosition.left + $(this).outerWidth() + 20); // Add 20 for spacing
            top = Math.max(top, notePosition.top); // Add 20 for spacing
        });

        // Apply position to the new note
        newNote.css({left: left, top: top, position: "absolute"});

       
        saveNotes();
    });
  
    
    $("#container").on("click", ".sticky", function(){    //parent -> child (sticky) - change currentElement to selected sticky
        currentElement = $(this).attr("id")

    });
    $("#container").on("click", "textarea", function(){    //click textarea -> move sticky to top of container

        var maximum = getMax(".sticky");        //pass .sticky items into function

        $(this).parent().css("z-index", (maximum+1))         //set z-index maximum + 1
        saveNotes();
    });

    $("#container").on("input", "textarea", function(){   //on text change - save note 
        saveNotes();
    });
    
    $("#container").on("click", "button.ui-icon-close", function(){    //click ui-icon -> delete
        $(this).parent().remove(); //select parent element -> remove
        localStorage.removeItem(currentElement);
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
    
    $("#trashCan").droppable({
        accept: ".sticky", 
        tolerance: "touch", 
        drop: function(event, ui) {
            ui.draggable.remove(); // remove the dragged sticky note from the DOM
            saveNotes();
        }
    });


//Helper Functions
    function getMax(items){ //loop thru stickys, get max z-index value
        var max = -Infinity; //intialize max to smallest possible
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
            
            $(".sticky").each(function() { //for each sticky -> get Id -> load text
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
        var stickyNotesData = $("#container").html(); //save html data of container
        localStorage.setItem("stickyNotes", stickyNotesData) //save 
        $(".sticky textarea").each(function() { //each sticky textarea-> save id and text
            var noteId = $(this).parent().attr("id");
            var noteText = $(this).val();
            var notePosition  = $(this).parent().attr("style")
            localStorage.setItem(noteId, noteText, notePosition);
        });
    }
});
