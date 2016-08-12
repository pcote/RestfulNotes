$(function(){
    var refreshNotesView = function(){

        var successCB = function(res){
            var notes = res.notes;
            console.log(notes);
            var notesTable = $("#notesTable");
            notesTable.empty();
            var headerString = "<tr><th>&nbsp;</th><th>id</th><th>title</th><th>detail</th>";
            notesTable.append($(headerString));

            var makeButton = function(id){
                var buttonAttrs = {
                    "class": "btn btn-danger"
                };

                var clickHandler = function(evt){
                    alert("delete click for: " + id);
                };

                var buttonOb = $("<button></button>", buttonAttrs);
                buttonOb.click(clickHandler);
                buttonOb.html("delete");
                return buttonOb;
            };

            var addRec = function(rec){
                var row = $("<tr></tr>");

                var deleteCell = $("<td></td>");
                var buttonObj = makeButton(rec.id);
                deleteCell.append(buttonObj);
                row.append(deleteCell);

                var idCell = $("<td></td>").html(rec.id);
                row.append(idCell);

                var titleCell = $("<td></td>").html(rec.title);
                row.append(titleCell);

                var detailCell = $("<td></td>").html(rec.detail);
                row.append(detailCell);

                notesTable.append(row);
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