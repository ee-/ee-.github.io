define(["exports", "./States", "fable-core/umd/Seq", "./Utility", "fable-core/umd/RegExp", "fable-core/umd/Map", "fable-core/umd/List", "./Identifier"], function (exports, _States, _Seq, _Utility, _RegExp, _Map, _List, _Identifier) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.makeHeading = makeHeading;
    exports.makeTableOfContent = makeTableOfContent;
    exports.encode = encode;
    exports.makeEscape = makeEscape;
    exports.makeBold = makeBold;
    exports.makeItalic = makeItalic;
    exports.makeUnderline = makeUnderline;
    exports.makeStrike = makeStrike;
    exports.makeSuperscript = makeSuperscript;
    exports.makeSubscript = makeSubscript;
    exports.makeInlineCode = makeInlineCode;
    exports.makeIcon = makeIcon;
    exports.makeLink = makeLink;
    exports.makeImage = makeImage;
    exports.makeLinkRef = makeLinkRef;
    exports.makeFootnoteRef = makeFootnoteRef;
    exports.makeImageRef = makeImageRef;
    exports.makeEmphasis = makeEmphasis;
    exports.makeBlockQuote = makeBlockQuote;
    exports.makeCell = makeCell;
    exports.makeRow = makeRow;
    exports.makeTable = makeTable;
    exports.preProcess = preProcess;
    exports.makeFootnote = makeFootnote;
    exports.getFlowCharts = getFlowCharts;

    var _List2 = _interopRequireDefault(_List);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function makeHeading(heading) {
        const html = heading.Case === "Heading" ? (() => {
            const correctLevel = heading.Fields[1] > 6 ? 6 : heading.Fields[1];
            return "<h" + String(correctLevel) + " id='" + heading.Fields[2] + "'>" + heading.Fields[0] + "</h" + String(correctLevel) + ">";
        })() : "";
        return html;
    }

    function makeTableOfContent() {
        let html = "";
        let index = 0;

        while (index < _States.headings.length) {
            const eachHeading = (0, _Seq.item)(_States.headings.length - index - 1, _States.headings);
            {
                const link = "<a href='#" + eachHeading[2] + "'>" + eachHeading[0] + "</a>";
                html = html + link + "<br>";
            }
            index = index + 1;
        }

        return html;
    }

    function encode(text) {
        return (0, _Utility.htmlEncode)(text);
    }

    function makeEscape(text) {
        const pattern = "\\\\(.)";
        return (0, _RegExp.replace)(text, pattern, "$1");
    }

    function makeBold(text) {
        const pattern = "\\*\\*(.*?)\\*\\*";
        return (0, _RegExp.replace)(text, pattern, "<b>$1</b>");
    }

    function makeItalic(text) {
        const pattern = "\\*(.*?)\\*";
        return (0, _RegExp.replace)(text, pattern, "<i>$1</i>");
    }

    function makeUnderline(text) {
        const pattern = "__(.*?)__";
        return (0, _RegExp.replace)(text, pattern, "<u>$1</u>");
    }

    function makeStrike(text) {
        const pattern = "~~(.*?)~~";
        return (0, _RegExp.replace)(text, pattern, "<s>$1</s>");
    }

    function makeSuperscript(text) {
        const pattern = "\\^\\((.*?)\\)";
        return (0, _RegExp.replace)(text, pattern, "<sup>$1</sup>");
    }

    function makeSubscript(text) {
        const pattern = "_\\((.*?)\\)";
        return (0, _RegExp.replace)(text, pattern, "<sub>$1</sub>");
    }

    function makeInlineCode(text) {
        const pattern = "`(.*?)`";
        return (0, _RegExp.replace)(text, pattern, "<code>$1</code>");
    }

    function makeIcon(text) {
        const pattern = "\\[(fa-[\\w-]+)\\]";
        return (0, _RegExp.replace)(text, pattern, "<i class='fa $1'></i>");
    }

    function makeLink(text) {
        const pattern = "\\[(.+?)\\]\\(([^ ]+?)\\)";
        return (0, _RegExp.replace)(text, pattern, "<a target='_blank' href='$2'>$1</a>");
    }

    function makeImage(text) {
        const pattern = "!\\[(.+?)\\]\\((.+?)\\)";
        return (0, _RegExp.replace)(text, pattern, "<img src='$2' title='$1'></img>");
    }

    function makeLinkRef(text) {
        const pattern = "\\[(.+?)\\]\\[(.+?)\\]";

        const replace = inputString => {
            const m = (0, _RegExp.match)(inputString, pattern);

            if (m != null) {
                const urltext = m[1];
                const urlKey = m[2];

                let url = (arg => defaultValue => arg != null ? arg : defaultValue)((0, _Map.tryFind)(urlKey, _States.links))("");

                if (url === "") {
                    url = "#";
                }

                const occurancePattern = "\\[(" + urltext + ")\\]\\[(" + urlKey + ")\\]";
                const outputString = (0, _RegExp.replace)(inputString, occurancePattern, "<a target='_blank' href='" + url + "'>$1</a>");
                return replace(outputString);
            } else {
                return inputString;
            }
        };

        return replace(text);
    }

    function makeFootnoteRef(text) {
        const pattern = "\\[\\^(.+?)\\]";

        const replace = inputString => {
            const m = (0, _RegExp.match)(inputString, pattern);

            if (m != null) {
                const footnoteKey = m[1];

                const footnote = (arg => defaultValue => arg != null ? arg : defaultValue)((0, _Map.tryFind)(footnoteKey, _States.footnotes))(["", ""]);

                const footnoteIdentifier = footnote[0];
                const occurancePattern = "\\[\\^(" + footnoteKey + ")\\]";
                const outputString = (0, _RegExp.replace)(inputString, occurancePattern, "<sup><a href='#footnote-" + footnoteIdentifier + "' id='" + footnoteIdentifier + "'>" + footnoteKey + "</a></sup>");
                return replace(outputString);
            } else {
                return inputString;
            }
        };

        return replace(text);
    }

    function makeImageRef(text) {
        const pattern = "!\\[(.+?)\\]\\[([^ ]+?)\\]";

        const replace = inputString => {
            const m = (0, _RegExp.match)(inputString, pattern);

            if (m != null) {
                const urltext = m[1];
                const urlKey = m[2];

                if (_States.links.has(urlKey)) {
                    const url = (arg => defaultValue => arg != null ? arg : defaultValue)((0, _Map.tryFind)(urlKey, _States.links))("");

                    const occurancePattern = "\\[(" + urltext + ")\\]\\[(" + urlKey + ")\\]";
                    const outputString = (0, _RegExp.replace)(text, occurancePattern, "<img src='" + url + "' title='$1'></img>");
                    return replace(outputString);
                } else {
                    return inputString;
                }
            } else {
                return inputString;
            }
        };

        return replace(text);
    }

    function makeEmphasis(text) {
        return makeFootnoteRef(makeLinkRef(makeImageRef(makeLink(makeImage(makeIcon(makeSubscript(makeSuperscript(makeStrike(makeUnderline(makeItalic(makeBold(makeInlineCode(text)))))))))))));
    }

    function makeBlockQuote(quote) {
        return "<blockquote>" + quote + "</blockquote>";
    }

    function makeCell(cell) {
        return "<td>" + makeEmphasis(cell) + "</td>";
    }

    function makeRow(row) {
        let html = "";

        for (let eachCell of row) {
            html = html + makeCell(eachCell);
        }

        return "<tr>" + html + "</tr>";
    }

    function makeTable(table) {
        let html = "";

        for (let eachRow of table) {
            html = html + makeRow(eachRow);
        }

        return "<table class='table table-striped table-hover table-bordered'>" + html + "</table>";
    }

    function preProcess(stringList) {
        const stringList_1 = (0, _List.append)(stringList, (0, _List.ofArray)([""]));
        let outputList = new _List2.default();
        let rowIndex = 0;

        while (rowIndex <= stringList_1.length - 2) {
            const thisRow = (0, _Seq.item)(rowIndex, stringList_1);
            const nextRow = (0, _Seq.item)(rowIndex + 1, stringList_1);
            {
                const activePatternResult166 = (0, _Identifier.$7C$IsHeadingLevelOne$7C$_$7C$)(nextRow);

                if (activePatternResult166 != null) {
                    const activePatternResult161 = (0, _Identifier.$7C$IsHeading$7C$_$7C$)(thisRow);

                    if (activePatternResult161 != null) {
                        outputList = new _List2.default(thisRow, outputList);
                    } else {
                        const activePatternResult160 = (0, _Identifier.$7C$IsAltHeading$7C$_$7C$)(thisRow);

                        if (activePatternResult160 != null) {
                            outputList = new _List2.default(thisRow, outputList);
                        } else {
                            const activePatternResult159 = (0, _Identifier.$7C$IsBlankLine$7C$_$7C$)(thisRow);

                            if (activePatternResult159 != null) {
                                outputList = new _List2.default(thisRow, outputList);
                            } else {
                                outputList = new _List2.default("#" + thisRow, outputList);
                                rowIndex = rowIndex + 1;
                            }
                        }
                    }
                } else {
                    const activePatternResult165 = (0, _Identifier.$7C$IsHeadingLevelTwo$7C$_$7C$)(nextRow);

                    if (activePatternResult165 != null) {
                        const activePatternResult164 = (0, _Identifier.$7C$IsHeading$7C$_$7C$)(thisRow);

                        if (activePatternResult164 != null) {
                            outputList = new _List2.default(thisRow, outputList);
                        } else {
                            const activePatternResult163 = (0, _Identifier.$7C$IsAltHeading$7C$_$7C$)(thisRow);

                            if (activePatternResult163 != null) {
                                outputList = new _List2.default(thisRow, outputList);
                            } else {
                                const activePatternResult162 = (0, _Identifier.$7C$IsBlankLine$7C$_$7C$)(thisRow);

                                if (activePatternResult162 != null) {
                                    outputList = new _List2.default(thisRow, outputList);
                                } else {
                                    outputList = new _List2.default("##" + thisRow, outputList);
                                    rowIndex = rowIndex + 1;
                                }
                            }
                        }
                    } else {
                        outputList = new _List2.default(thisRow, outputList);
                    }
                }
            }
            rowIndex = rowIndex + 1;
        }

        return (0, _List.reverse)(outputList);
    }

    function makeFootnote() {
        let outputHtml = "";
        let index = 1;

        for (let eachFootnote of _States.footnotes) {
            const html = eachFootnote[1][1] + " <a href='#" + eachFootnote[1][0] + "' id='footnote-" + eachFootnote[1][0] + "'><i class='fa fa-level-up'></i></a>";
            outputHtml = outputHtml + "<li>" + html + "</li>";
        }

        return "<hr><ol>" + makeEmphasis(outputHtml) + "</ol>";
    }

    function getFlowCharts() {
        for (let eachFlowChart of _States.flowcharts) {
            const flowchartCode = eachFlowChart[1];
            const flowchartId = eachFlowChart[0];
            window.renderFlowchart(flowchartCode, flowchartId);
        }
    }

    window.getFlowCharts = () => {
        getFlowCharts();
    };
});
//# sourceMappingURL=Compiler.js.map