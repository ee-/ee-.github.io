var AcademicMarkdown;
(function (AcademicMarkdown) {
    var Editor;
    (function (Editor) {
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
            Editor.editor.trigger("undo-btn", "undo", null);
        });
        //redo
        document.getElementById("redo-btn").addEventListener("click", () => {
            Editor.editor.trigger("redo-btn", "redo", null);
        });
        document.getElementById("amd-theme-0").addEventListener("click", () => {
            AcademicMarkdown.Utility.changeStyle(0);
        });
        document.getElementById("amd-theme-1").addEventListener("click", () => {
            AcademicMarkdown.Utility.changeStyle(1);
        });
        document.getElementById("amd-theme-2").addEventListener("click", () => {
            AcademicMarkdown.Utility.changeStyle(2);
        });
        document.getElementById("table-fit").addEventListener("click", () => {
            fitTableButton();
        });
        document.getElementById("pdf-btn").addEventListener("click", () => {
            let doc = new window.jsPDF();
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
        });
        function fitTableButton() {
            let range = Editor.editor.getSelection();
            let textSelected = Editor.editor.getModel().getValueInRange(range);
            insert(fitTable(textSelected), range);
        }
        function emphasis(identifier) {
            // this function adds/removes surrounding characters(identifiers) to the selected text
            let range = Editor.editor.getSelection();
            let startPosition = new monaco.Position(range.startLineNumber, range.startColumn);
            let endPosition = new monaco.Position(range.endLineNumber, range.endColumn);
            let textSelected = Editor.editor.getModel().getValueInRange(range);
            if (!textSelected) {
                textSelected = "insert your text here";
            }
            let textLength = textSelected.length;
            let offset = identifier.length;
            //detect if the selected range is already processed
            if (textAtPosition(startPosition, -offset) == identifier
                && textAtPosition(endPosition, offset) == identifier) {
                let newRange = modifyRange(range, -offset, offset);
                insert(textSelected, newRange);
                startPosition = Editor.editor.getModel().modifyPosition(startPosition, -offset);
            }
            else {
                insert(identifier + textSelected + identifier, range);
                startPosition = Editor.editor.getModel().modifyPosition(startPosition, offset);
            }
            //reset cursor position after the operation
            endPosition = Editor.editor.getModel().modifyPosition(startPosition, textLength);
            let selection = new monaco.Selection(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
            Editor.editor.setSelection(selection);
        }
        function textAtPosition(position, offset) {
            let offsetPosition = Editor.editor.getModel().modifyPosition(position, offset);
            let range = positionToRange(position, offsetPosition);
            return Editor.editor.getModel().getValueInRange(range);
        }
        function positionToRange(startPosition, endPosition) {
            return new monaco.Selection(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
        }
        function modifyRange(range, startOffset, endOffset) {
            let startPosition = new monaco.Position(range.startLineNumber, range.startColumn);
            let endPosition = new monaco.Position(range.endLineNumber, range.endColumn);
            startPosition = Editor.editor.getModel().modifyPosition(startPosition, startOffset);
            endPosition = Editor.editor.getModel().modifyPosition(endPosition, endOffset);
            return positionToRange(startPosition, endPosition);
        }
        function insert(text, range = Editor.editor.getSelection()) {
            let id = { major: 1, minor: 1 };
            let edit = { identifier: id, range: range, text: text, forceMoveMarkers: true };
            Editor.editor.executeEdits("insert", [edit]);
            Editor.editor.focus();
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
        function hyperlink(url, title) {
            let text = `[link text](${url})`;
            insert(text);
        }
        function image(url, title) {
            let text = `[image text](${url} ${(title) ? (`"${title}"`) : (``)})`;
            insert(text);
        }
        function validateTable(table) {
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
                        isTable = false;
                    }
                }
            }
            return isTable;
        }
        function fitTable(table) {
            if (!validateTable(table))
                return table;
            let rows = table.match(/[^\r\n]+/g);
            let rowNumber = rows.length;
            let columnNumber = rows[0].split("|").length - 2;
            let columnMaxWidth = new Array(columnNumber).fill(0);
            let cells = [];
            for (let rowID = 0; rowID < rowNumber; rowID++) {
                let row = rows[rowID];
                let columns = row.split("|").slice(1, 1 + columnNumber);
                cells[rowID] = [];
                for (let columnID = 0; columnID < columnNumber; columnID++) {
                    let cell = columns[columnID].trim();
                    cells[rowID][columnID] = cell;
                    if (cell.length > columnMaxWidth[columnID]) {
                        columnMaxWidth[columnID] = cell.length;
                    }
                }
            }
            let fittedTable = "";
            for (let rowID = 0; rowID < rowNumber; rowID++) {
                let fittedRow = "";
                for (let columnID = 0; columnID < columnNumber; columnID++) {
                    let lineFilling = (rowID == 1) ? "-" : " ";
                    let cell = cells[rowID][columnID];
                    let spaceNumber = columnMaxWidth[columnID] - cell.length;
                    fittedRow = fittedRow + "| " + cell + lineFilling.repeat(spaceNumber) + " ";
                }
                fittedTable = fittedTable + fittedRow + " |\n";
            }
            console.log(fittedTable);
            return (fittedTable);
        }
    })(Editor = AcademicMarkdown.Editor || (AcademicMarkdown.Editor = {}));
})(AcademicMarkdown || (AcademicMarkdown = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUMsRUFoT1MsZ0JBQWdCLEtBQWhCLGdCQUFnQixRQWdPekIiLCJmaWxlIjoiZWRpdG9yLXRvb2xiYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgQWNhZGVtaWNNYXJrZG93bi5FZGl0b3Ige1xyXG5cclxuICAgIC8vYm9sZFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2xkLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGVtcGhhc2lzKFwiKipcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0YWxpYy1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBlbXBoYXNpcyhcIipcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVuZGVybGluZS1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBlbXBoYXNpcyhcIl9fXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHJpa2V0aHJvdWdoLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGVtcGhhc2lzKFwifn5cIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvZGUtaW5saW5lLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGVtcGhhc2lzKFwiYFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGluay1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBoeXBlcmxpbmsoXCJ1cmxcIiwgXCJ0aXRsZVwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFibGUtYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgdGFibGUoMywgNCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB1bmRvXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVuZG8tYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgZWRpdG9yLnRyaWdnZXIoXCJ1bmRvLWJ0blwiLCBcInVuZG9cIiwgbnVsbClcclxuICAgIH0pO1xyXG5cclxuICAgIC8vcmVkb1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWRvLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGVkaXRvci50cmlnZ2VyKFwicmVkby1idG5cIiwgXCJyZWRvXCIsIG51bGwpXHJcbiAgICB9KVxyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW1kLXRoZW1lLTBcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBVdGlsaXR5LmNoYW5nZVN0eWxlKDApO1xyXG4gICAgfSlcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFtZC10aGVtZS0xXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgVXRpbGl0eS5jaGFuZ2VTdHlsZSgxKTtcclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbWQtdGhlbWUtMlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIFV0aWxpdHkuY2hhbmdlU3R5bGUoMik7XHJcbiAgICB9KVxyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFibGUtZml0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgZml0VGFibGVCdXR0b24oKTtcclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwZGYtYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGRvYyA9IG5ldyAoPGFueT53aW5kb3cpLmpzUERGKCk7XHJcbiAgICAgICAgbGV0IHNwZWNpYWxFbGVtZW50SGFuZGxlcnMgPSB7XHJcbiAgICAgICAgICAgICcjZWRpdG9yJzogZnVuY3Rpb24gKGVsZW1lbnQsIHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGRvYy5mcm9tSFRNTCgkKCcjbWFya2Rvd24tb3V0cHV0LWNvbnRhaW5lcicpLmh0bWwoKSwgMTUsIDE1LCB7XHJcbiAgICAgICAgICAgICd3aWR0aCc6IDE3MCxcclxuICAgICAgICAgICAgJ2VsZW1lbnRIYW5kbGVycyc6IHNwZWNpYWxFbGVtZW50SGFuZGxlcnNcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2Muc2F2ZSgnQS5NRC5wZGYnKTtcclxuICAgIH0pXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGZpdFRhYmxlQnV0dG9uKCkge1xyXG4gICAgICAgIGxldCByYW5nZSA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICBsZXQgdGV4dFNlbGVjdGVkID0gZWRpdG9yLmdldE1vZGVsKCkuZ2V0VmFsdWVJblJhbmdlKHJhbmdlKTtcclxuICAgICAgICBpbnNlcnQoZml0VGFibGUodGV4dFNlbGVjdGVkKSwgcmFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVtcGhhc2lzKGlkZW50aWZpZXI6IHN0cmluZykge1xyXG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gYWRkcy9yZW1vdmVzIHN1cnJvdW5kaW5nIGNoYXJhY3RlcnMoaWRlbnRpZmllcnMpIHRvIHRoZSBzZWxlY3RlZCB0ZXh0XHJcbiAgICAgICAgbGV0IHJhbmdlID0gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgIGxldCBzdGFydFBvc2l0aW9uID0gbmV3IG1vbmFjby5Qb3NpdGlvbihyYW5nZS5zdGFydExpbmVOdW1iZXIsIHJhbmdlLnN0YXJ0Q29sdW1uKTtcclxuICAgICAgICBsZXQgZW5kUG9zaXRpb24gPSBuZXcgbW9uYWNvLlBvc2l0aW9uKHJhbmdlLmVuZExpbmVOdW1iZXIsIHJhbmdlLmVuZENvbHVtbik7XHJcbiAgICAgICAgbGV0IHRleHRTZWxlY3RlZCA9IGVkaXRvci5nZXRNb2RlbCgpLmdldFZhbHVlSW5SYW5nZShyYW5nZSk7XHJcbiAgICAgICAgaWYgKCF0ZXh0U2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgdGV4dFNlbGVjdGVkID0gXCJpbnNlcnQgeW91ciB0ZXh0IGhlcmVcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGV4dExlbmd0aCA9IHRleHRTZWxlY3RlZC5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IGlkZW50aWZpZXIubGVuZ3RoO1xyXG5cclxuICAgICAgICAvL2RldGVjdCBpZiB0aGUgc2VsZWN0ZWQgcmFuZ2UgaXMgYWxyZWFkeSBwcm9jZXNzZWRcclxuICAgICAgICBpZiAodGV4dEF0UG9zaXRpb24oc3RhcnRQb3NpdGlvbiwgLW9mZnNldCkgPT0gaWRlbnRpZmllclxyXG4gICAgICAgICAgICAmJiB0ZXh0QXRQb3NpdGlvbihlbmRQb3NpdGlvbiwgb2Zmc2V0KSA9PSBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdSYW5nZSA9IG1vZGlmeVJhbmdlKHJhbmdlLCAtb2Zmc2V0LCBvZmZzZXQpO1xyXG4gICAgICAgICAgICBpbnNlcnQodGV4dFNlbGVjdGVkLCBuZXdSYW5nZSk7XHJcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gPSBlZGl0b3IuZ2V0TW9kZWwoKS5tb2RpZnlQb3NpdGlvbihzdGFydFBvc2l0aW9uLCAtb2Zmc2V0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbnNlcnQoaWRlbnRpZmllciArIHRleHRTZWxlY3RlZCArIGlkZW50aWZpZXIsIHJhbmdlKTtcclxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGVkaXRvci5nZXRNb2RlbCgpLm1vZGlmeVBvc2l0aW9uKHN0YXJ0UG9zaXRpb24sIG9mZnNldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3Jlc2V0IGN1cnNvciBwb3NpdGlvbiBhZnRlciB0aGUgb3BlcmF0aW9uXHJcbiAgICAgICAgZW5kUG9zaXRpb24gPSBlZGl0b3IuZ2V0TW9kZWwoKS5tb2RpZnlQb3NpdGlvbihzdGFydFBvc2l0aW9uLCB0ZXh0TGVuZ3RoKTtcclxuICAgICAgICBsZXQgc2VsZWN0aW9uID0gbmV3IG1vbmFjby5TZWxlY3Rpb24oXHJcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24ubGluZU51bWJlcixcclxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbi5jb2x1bW4sXHJcbiAgICAgICAgICAgIGVuZFBvc2l0aW9uLmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgIGVuZFBvc2l0aW9uLmNvbHVtblxyXG4gICAgICAgICk7XHJcbiAgICAgICAgZWRpdG9yLnNldFNlbGVjdGlvbihzZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRleHRBdFBvc2l0aW9uKHBvc2l0aW9uOiBtb25hY28uSVBvc2l0aW9uLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBvZmZzZXRQb3NpdGlvbiA9IGVkaXRvci5nZXRNb2RlbCgpLm1vZGlmeVBvc2l0aW9uKHBvc2l0aW9uLCBvZmZzZXQpO1xyXG4gICAgICAgIGxldCByYW5nZSA9IHBvc2l0aW9uVG9SYW5nZShwb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO1xyXG4gICAgICAgIHJldHVybiBlZGl0b3IuZ2V0TW9kZWwoKS5nZXRWYWx1ZUluUmFuZ2UocmFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBvc2l0aW9uVG9SYW5nZShcclxuICAgICAgICBzdGFydFBvc2l0aW9uOiBtb25hY28uSVBvc2l0aW9uLFxyXG4gICAgICAgIGVuZFBvc2l0aW9uOiBtb25hY28uSVBvc2l0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb25hY28uU2VsZWN0aW9uKFxyXG4gICAgICAgICAgICBzdGFydFBvc2l0aW9uLmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24uY29sdW1uLFxyXG4gICAgICAgICAgICBlbmRQb3NpdGlvbi5saW5lTnVtYmVyLFxyXG4gICAgICAgICAgICBlbmRQb3NpdGlvbi5jb2x1bW5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1vZGlmeVJhbmdlKHJhbmdlOiBtb25hY28uSVJhbmdlLCBzdGFydE9mZnNldDogbnVtYmVyLCBlbmRPZmZzZXQ6IG51bWJlcik6IG1vbmFjby5TZWxlY3Rpb24ge1xyXG4gICAgICAgIGxldCBzdGFydFBvc2l0aW9uID0gbmV3IG1vbmFjby5Qb3NpdGlvbihyYW5nZS5zdGFydExpbmVOdW1iZXIsIHJhbmdlLnN0YXJ0Q29sdW1uKTtcclxuICAgICAgICBsZXQgZW5kUG9zaXRpb24gPSBuZXcgbW9uYWNvLlBvc2l0aW9uKHJhbmdlLmVuZExpbmVOdW1iZXIsIHJhbmdlLmVuZENvbHVtbik7XHJcbiAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGVkaXRvci5nZXRNb2RlbCgpLm1vZGlmeVBvc2l0aW9uKHN0YXJ0UG9zaXRpb24sIHN0YXJ0T2Zmc2V0KTtcclxuICAgICAgICBlbmRQb3NpdGlvbiA9IGVkaXRvci5nZXRNb2RlbCgpLm1vZGlmeVBvc2l0aW9uKGVuZFBvc2l0aW9uLCBlbmRPZmZzZXQpO1xyXG4gICAgICAgIHJldHVybiBwb3NpdGlvblRvUmFuZ2Uoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaW5zZXJ0KFxyXG4gICAgICAgIHRleHQ6IHN0cmluZyxcclxuICAgICAgICByYW5nZTogbW9uYWNvLlNlbGVjdGlvbiA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKSkge1xyXG4gICAgICAgIGxldCBpZCA9IHsgbWFqb3I6IDEsIG1pbm9yOiAxIH07XHJcbiAgICAgICAgbGV0IGVkaXQgPSB7IGlkZW50aWZpZXI6IGlkLCByYW5nZTogcmFuZ2UsIHRleHQ6IHRleHQsIGZvcmNlTW92ZU1hcmtlcnM6IHRydWUgfTtcclxuICAgICAgICBlZGl0b3IuZXhlY3V0ZUVkaXRzKFwiaW5zZXJ0XCIsIFtlZGl0XSk7XHJcbiAgICAgICAgZWRpdG9yLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGFibGUocm93LCBjb2x1bW4pIHtcclxuICAgICAgICBsZXQgdGFibGUgPSBcIlwiO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHJvdzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IGNvbHVtbjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uSUQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgaik7IC8vIG5lZWQgdG8gZml4IFxyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0lEID0gaTtcclxuICAgICAgICAgICAgICAgIHRhYmxlID0gdGFibGUgKyBjb2x1bW5JRCArIHJvd0lEICsgXCJcXHRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YWJsZSA9IHRhYmxlICsgXCJcXG5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW5zZXJ0KHRhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoeXBlcmxpbmsodXJsOiBzdHJpbmcsIHRpdGxlPzogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHRleHQgPSBgW2xpbmsgdGV4dF0oJHt1cmx9KWA7XHJcbiAgICAgICAgaW5zZXJ0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGltYWdlKHVybDogc3RyaW5nLCB0aXRsZT86IHN0cmluZykge1xyXG4gICAgICAgIGxldCB0ZXh0ID0gYFtpbWFnZSB0ZXh0XSgke3VybH0gJHsodGl0bGUpID8gKGBcIiR7dGl0bGV9XCJgKSA6IChgYCl9KWA7XHJcbiAgICAgICAgaW5zZXJ0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlVGFibGUodGFibGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBpc1RhYmxlID0gdHJ1ZTtcclxuICAgICAgICBsZXQgcm93cyA9IHRhYmxlLm1hdGNoKC9bXlxcclxcbl0rL2cpO1xyXG4gICAgICAgIGlmICghcm93cyB8fCByb3dzLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgaXNUYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJvd051bWJlciA9IHJvd3MubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3dJRCA9IDA7IHJvd0lEIDwgcm93TnVtYmVyOyByb3dJRCsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gcm93c1tyb3dJRF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJvdy5tYXRjaCgvXlxcfChbXlxcfF0rXFx8KSsvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVGFibGUgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaXNUYWJsZVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpdFRhYmxlKHRhYmxlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXZhbGlkYXRlVGFibGUodGFibGUpKSByZXR1cm4gdGFibGU7XHJcblxyXG4gICAgICAgIGxldCByb3dzID0gdGFibGUubWF0Y2goL1teXFxyXFxuXSsvZyk7XHJcbiAgICAgICAgbGV0IHJvd051bWJlciA9IHJvd3MubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjb2x1bW5OdW1iZXIgPSByb3dzWzBdLnNwbGl0KFwifFwiKS5sZW5ndGggLSAyO1xyXG4gICAgICAgIGxldCBjb2x1bW5NYXhXaWR0aDogbnVtYmVyW10gPSBuZXcgQXJyYXkoY29sdW1uTnVtYmVyKS5maWxsKDApO1xyXG4gICAgICAgIGxldCBjZWxsczogc3RyaW5nW11bXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCByb3dJRCA9IDA7IHJvd0lEIDwgcm93TnVtYmVyOyByb3dJRCsrKSB7XHJcbiAgICAgICAgICAgIGxldCByb3cgPSByb3dzW3Jvd0lEXTtcclxuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSByb3cuc3BsaXQoXCJ8XCIpLnNsaWNlKDEsIDEgKyBjb2x1bW5OdW1iZXIpO1xyXG4gICAgICAgICAgICBjZWxsc1tyb3dJRF0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sdW1uSUQgPSAwOyBjb2x1bW5JRCA8IGNvbHVtbk51bWJlcjsgY29sdW1uSUQrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSBjb2x1bW5zW2NvbHVtbklEXS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBjZWxsc1tyb3dJRF1bY29sdW1uSURdID0gY2VsbDtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsLmxlbmd0aCA+IGNvbHVtbk1heFdpZHRoW2NvbHVtbklEXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbk1heFdpZHRoW2NvbHVtbklEXSA9IGNlbGwubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBmaXR0ZWRUYWJsZSA9IFwiXCJcclxuICAgICAgICBmb3IgKGxldCByb3dJRCA9IDA7IHJvd0lEIDwgcm93TnVtYmVyOyByb3dJRCsrKSB7XHJcbiAgICAgICAgICAgIGxldCBmaXR0ZWRSb3cgPSBcIlwiXHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbHVtbklEID0gMDsgY29sdW1uSUQgPCBjb2x1bW5OdW1iZXI7IGNvbHVtbklEKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBsaW5lRmlsbGluZyA9IChyb3dJRCA9PSAxKSA/IFwiLVwiIDogXCIgXCJcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gY2VsbHNbcm93SURdW2NvbHVtbklEXTtcclxuICAgICAgICAgICAgICAgIGxldCBzcGFjZU51bWJlciA9IGNvbHVtbk1heFdpZHRoW2NvbHVtbklEXSAtIGNlbGwubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZml0dGVkUm93ID0gZml0dGVkUm93ICsgXCJ8IFwiICsgY2VsbCArIGxpbmVGaWxsaW5nLnJlcGVhdChzcGFjZU51bWJlcikgKyBcIiBcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpdHRlZFRhYmxlID0gZml0dGVkVGFibGUgKyBmaXR0ZWRSb3cgKyBcIiB8XFxuXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coZml0dGVkVGFibGUpO1xyXG4gICAgICAgIHJldHVybiAoZml0dGVkVGFibGUpO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==