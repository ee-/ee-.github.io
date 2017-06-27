//bold
document.getElementById('bold-btn').addEventListener("click", () => {
    editor.getSelection();
});

// undo
document.getElementById('undo-btn').addEventListener("click", () => {
    editor.getModel().undo();
});

//redo
document.getElementById('redo-btn').addEventListener("click", () => {
    editor.getModel().redo();
})


function table(row, column) {
    let table = "";
    for (i = 1; i <= row; i++) {
        for (j = 1; j<= column; j++){
            let columnID = String.fromCharCode(64+j); // need to fix 
            let rowID = i;
            table = table + columnID + rowID + "\t";
        }
        table = table + "\n";
    }
    return table;
}

function hyperlink()