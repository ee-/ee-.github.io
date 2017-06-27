namespace AcademicMarkdown.Editor {

    //bold
    document.getElementById("bold-btn").addEventListener("click", () => {
        emphasis("**");
    });

    document.getElementById("italic-btn").addEventListener("click", () => {
        emphasis("*");
    });

    document.getElementById("underline-btn").addEventListener("click", () => {
        emphasis("__");
    });

    document.getElementById("strikethrough-btn").addEventListener("click", () => {
        emphasis("~~");
    });

    document.getElementById("code-inline-btn").addEventListener("click", () => {
        emphasis("`");
    });

    document.getElementById("link-btn").addEventListener("click", () => {
        hyperlink("url", "title");
    });

    document.getElementById("table-btn").addEventListener("click", () => {
        table(3, 4);
    });

    // undo
    document.getElementById("undo-btn").addEventListener("click", () => {
        editor.trigger("undo-btn", "undo", null)
    });

    //redo
    document.getElementById("redo-btn").addEventListener("click", () => {
        editor.trigger("redo-btn", "redo", null)
    })

    document.getElementById("amd-theme-0").addEventListener("click", () => {
        Utility.changeStyle(0);
    })

    document.getElementById("amd-theme-1").addEventListener("click", () => {
        Utility.changeStyle(1);
    })

    document.getElementById("amd-theme-2").addEventListener("click", () => {
        Utility.changeStyle(2);
    })

    document.getElementById("table-fit").addEventListener("click", () => {
        fitTableButton();
    })

    document.getElementById("pdf-btn").addEventListener("click", () => {
        let doc = new (<any>window).jsPDF();
        let specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };

        doc.fromHTML($('#markdown-output-container').html(), 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        doc.save('A.MD.pdf');
    })


    function fitTableButton() {
        let range = editor.getSelection();
        let textSelected = editor.getModel().getValueInRange(range);
        insert(fitTable(textSelected), range);
    }

    function emphasis(identifier: string) {
        // this function adds/removes surrounding characters(identifiers) to the selected text
        let range = editor.getSelection();
        let startPosition = new monaco.Position(range.startLineNumber, range.startColumn);
        let endPosition = new monaco.Position(range.endLineNumber, range.endColumn);
        let textSelected = editor.getModel().getValueInRange(range);
        if (!textSelected) {
            textSelected = "insert your text here"
        }
        let textLength = textSelected.length;
        let offset = identifier.length;

        //detect if the selected range is already processed
        if (textAtPosition(startPosition, -offset) == identifier
            && textAtPosition(endPosition, offset) == identifier) {
            let newRange = modifyRange(range, -offset, offset);
            insert(textSelected, newRange);
            startPosition = editor.getModel().modifyPosition(startPosition, -offset);
        } else {
            insert(identifier + textSelected + identifier, range);
            startPosition = editor.getModel().modifyPosition(startPosition, offset);
        }

        //reset cursor position after the operation
        endPosition = editor.getModel().modifyPosition(startPosition, textLength);
        let selection = new monaco.Selection(
            startPosition.lineNumber,
            startPosition.column,
            endPosition.lineNumber,
            endPosition.column
        );
        editor.setSelection(selection);
    }

    function textAtPosition(position: monaco.IPosition, offset: number) {
        let offsetPosition = editor.getModel().modifyPosition(position, offset);
        let range = positionToRange(position, offsetPosition);
        return editor.getModel().getValueInRange(range);
    }

    function positionToRange(
        startPosition: monaco.IPosition,
        endPosition: monaco.IPosition) {
        return new monaco.Selection(
            startPosition.lineNumber,
            startPosition.column,
            endPosition.lineNumber,
            endPosition.column
        );
    }

    function modifyRange(range: monaco.IRange, startOffset: number, endOffset: number): monaco.Selection {
        let startPosition = new monaco.Position(range.startLineNumber, range.startColumn);
        let endPosition = new monaco.Position(range.endLineNumber, range.endColumn);
        startPosition = editor.getModel().modifyPosition(startPosition, startOffset);
        endPosition = editor.getModel().modifyPosition(endPosition, endOffset);
        return positionToRange(startPosition, endPosition);
    }
    function insert(
        text: string,
        range: monaco.Selection = editor.getSelection()) {
        let id = { major: 1, minor: 1 };
        let edit = { identifier: id, range: range, text: text, forceMoveMarkers: true };
        editor.executeEdits("insert", [edit]);
        editor.focus();
    }

    function table(row, column) {
        let table = "";
        for (let i = 1; i <= row; i++) {
            for (let j = 1; j <= column; j++) {
                let columnID = String.fromCharCode(64 + j); // need to fix 
                let rowID = i;
                table = table + columnID + rowID + "\t";
            }
            table = table + "\n";
        }
        insert(table);
    }

    function hyperlink(url: string, title?: string) {
        let text = `[link text](${url})`;
        insert(text);
    }

    function image(url: string, title?: string) {
        let text = `[image text](${url} ${(title) ? (`"${title}"`) : (``)})`;
        insert(text);
    }

    function validateTable(table: string): boolean {
        let isTable = true;
        let rows = table.match(/[^\r\n]+/g);
        if (!rows || rows.length < 2) {
            isTable = false;
        }
        else {
            let rowNumber = rows.length;
            for (let rowID = 0; rowID < rowNumber; rowID++) {
                let row = rows[rowID];
                if (!row.match(/^\|([^\|]+\|)+/)) {
                    isTable = false
                }
            }
        }

        return isTable
    }

    function fitTable(table: string) {
        if (!validateTable(table)) return table;

        let rows = table.match(/[^\r\n]+/g);
        let rowNumber = rows.length;
        let columnNumber = rows[0].split("|").length - 2;
        let columnMaxWidth: number[] = new Array(columnNumber).fill(0);
        let cells: string[][] = [];

        for (let rowID = 0; rowID < rowNumber; rowID++) {
            let row = rows[rowID];
            let columns = row.split("|").slice(1, 1 + columnNumber);
            cells[rowID] = [];
            for (let columnID = 0; columnID < columnNumber; columnID++) {
                let cell = columns[columnID].trim();
                cells[rowID][columnID] = cell;
                if (cell.length > columnMaxWidth[columnID]) {
                    columnMaxWidth[columnID] = cell.length
                }
            }
        }

        let fittedTable = ""
        for (let rowID = 0; rowID < rowNumber; rowID++) {
            let fittedRow = ""
            for (let columnID = 0; columnID < columnNumber; columnID++) {
                let lineFilling = (rowID == 1) ? "-" : " "
                let cell = cells[rowID][columnID];
                let spaceNumber = columnMaxWidth[columnID] - cell.length;
                fittedRow = fittedRow + "| " + cell + lineFilling.repeat(spaceNumber) + " "
            }
            fittedTable = fittedTable + fittedRow + " |\n"
        }
        console.log(fittedTable);
        return (fittedTable);
    }
}