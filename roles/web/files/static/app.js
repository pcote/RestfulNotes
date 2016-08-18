$(function(){
    var refreshNotesView = function(){

        var successCB = function(res){

            var makeDeleteButton = function(id){
                var buttonAttrs = {
                    "class": "btn btn-danger"
                };

                var clickHandler = function(evt){

                    var successfulDeletion = function(){
                        $.ajax(req);
                    };

                    var deleteReq = {
                        url: "/deletenote/" + id,
                        method: "delete",
                        success: successfulDeletion
                    };

                    $.ajax(deleteReq);
                };

                var buttonOb = $("<button></button>", buttonAttrs);
                buttonOb.click(clickHandler);
                buttonOb.html("delete");
                return buttonOb;
            };

            var makeChangeButton = function(id, title, detail){

                var changeButtonClick = function(evt){
                    $("#tfTitleChange").val(title);
                    $("#tfDetailChange").val(detail);
                    $("#tfHiddenId").val(id)
                    $("#changeModal").modal();
                };

                var buttonAttrs = {
                    "class": "btn btn-primary"
                };

                var changeButton = $("<button></button>", buttonAttrs)
                        .html("change")
                        .click(changeButtonClick);
                return changeButton;
            };

            var addRec = function(rec){
                var buttonObj = makeDeleteButton(rec.id);
                var btn = makeChangeButton(rec.id, rec.title, rec.detail);

                var templData = {
                    id: rec.id,
                    title: rec.title,
                    detail: rec.detail
                };

                var templText = $("#notesRowTempl").html();
                var templ = Handlebars.compile(templText);
                var result = templ(templData);
                var resultDomRow = $(result);
                resultDomRow.find(".deleteButtonCell").append(buttonObj);
                resultDomRow.find(".changeButtonCell").append(btn);

                // notesTable.append(row);
                notesTable.append(resultDomRow);
            };

            var notes = res.notes;
            var notesTable = $("#notesTable");
            notesTable.empty();
            var headerString = "<tr><th>&nbsp;</th><th>id</th><th>title</th><th>detail</th><th>&nbsp;</th></tr>";
            notesTable.append($(headerString));
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

    /////////////////// ADDING NEW RECORDS SECTION/////////////////////
    var addNoteClick = function(evt){
        var jsonArgs = {
            title: $("#tfTitle").val(),
            detail: $("#tfDetail").val()
        };

        headers = {
            "Content-type": "application/json"
        };

        var req = {
            url: "/addnote",
            method: "post",
            headers: headers,
            success: refreshNotesView,
            data: JSON.stringify(jsonArgs)
        };

        $.ajax(req);
    };


    $("#btnAddNote").click(addNoteClick);


    //////////////////// CHANGING EXISTING RECORDS SECTION ///////////////////
    var okChangeClick = function(evt){
        var successCB = function(){
            refreshNotesView();
            $("#changeModal").modal("hide");
        }

        var headerArgs = {
            "Content-type": "application/json"
        };

        var jsonArgs = {
            id: $("#tfHiddenId").val(),
            title: $("#tfTitleChange").val(),
            detail: $("#tfDetailChange").val()
        };

        var req = {
            url: "/changenote",
            method: "put",
            headers: headerArgs,
            data: JSON.stringify(jsonArgs),
            success: successCB
        };

        $.ajax(req);
    };

    $("#okChangeButton").click(okChangeClick);
});