$(function(){

    var createElement = function(elemName){
        return document.createElement(elemName);
    };

    var makeRecRow = function(id, title, detail){
        var row = createElement("tr");

        var deleteButtonCell = createElement("td");
        deleteButtonCell.className = "deleteButtonCell";
        row.appendChild(deleteButtonCell);

        var idCell = createElement("td");
        idCell.innerHTML = id;
        row.appendChild(idCell);

        var titleCell = createElement("td");
        titleCell.innerHTML = title;
        row.appendChild(titleCell);

        var detailCell = createElement("td");
        detailCell.innerHTML = detail;
        row.appendChild(detailCell);

        var changeButtonCell = createElement("td");
        changeButtonCell.className = "changeButtonCell";
        row.appendChild(changeButtonCell);

        return row;
    };

    var refreshNotesView = function(){

        var successCB = function(res){

            var makeDeleteButton = function(id){
                var buttonAttrs = {
                    "class": "btn btn-danger"
                };

                var clickHandler = function(evt){

                    var deleteReq = {
                        url: "/deletenote/" + id,
                        method: "delete"
                    };

                    var promise = $.ajax(deleteReq);
                    promise.then(refreshNotesView);
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
                var deleteButton = makeDeleteButton(rec.id);
                var changeButton = makeChangeButton(rec.id, rec.title, rec.detail);

                var rowData = {
                    id: rec.id,
                    title: rec.title,
                    detail: rec.detail
                };

                var renderedRowDom = makeRecRow(rec.id, rec.title, rec.detail);
                renderedRowDom = $(renderedRowDom);

                renderedRowDom.find(".deleteButtonCell").append(deleteButton);
                renderedRowDom.find(".changeButtonCell").append(changeButton);

                // notesTable.append(row);
                notesTable.append(renderedRowDom);
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
            method: "get"
        };

        var promise = $.ajax(req);
        promise.then(successCB);
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
            data: JSON.stringify(jsonArgs)
        };

        var promise = $.ajax(req);
        promise.then(refreshNotesView);
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
            data: JSON.stringify(jsonArgs)
        };

        var promise = $.ajax(req);
        promise.then(successCB);
    };

    $("#okChangeButton").click(okChangeClick);
});

