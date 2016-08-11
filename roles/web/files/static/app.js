$(function(){
    var refreshNotesView = function(){

        var successCB = function(res){
            var notes = res.notes;
            console.log(notes);
            var notesTable = $("#notesTable");
            notesTable.empty();
            var headerString = "<tr><th>id</th><th>title</th><th>detail</th>";
            notesTable.append($(headerString));

            var addRec = function(rec){
                var cells = "<td>" + rec.id + "</td>";
                cells = cells + "<td>" + rec.title + "</td>";
                cells = cells + "<td>" + rec.detail + "</td>";

                var row = "<tr>" + cells + "</tr>";
                var rowObject = $(row);
                notesTable.append(rowObject);
            };

            notes.forEach(addRec);
        };

        var req = {
            url: "/notes",
            method: "get",
            success: successCB
        };

        $.ajax(req);
    };

    refreshNotesView();
});