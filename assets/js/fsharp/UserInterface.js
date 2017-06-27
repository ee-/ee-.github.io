define(["exports", "./Compiler", "./Utility", "fable-core/umd/List", "./States", "fable-core/umd/Seq", "./Identifier", "fable-core/umd/Map", "fable-core/umd/String"], function (exports, _Compiler, _Utility, _List, _States, _Seq, _Identifier, _Map, _String) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.compileAMD = compileAMD;

    var _List2 = _interopRequireDefault(_List);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function compileAMD(inputString) {
        const inputLines = (0, _Compiler.preProcess)((0, _Utility.splitByLine)(inputString));
        let outputLines = new _List2.default();
        (0, _States.initState)();
        const maxLineIndex = inputLines.length - 1;
        let lineIndex = 0;
        lineIndex = 0;

        while (lineIndex <= maxLineIndex) {
            const eachLine = (0, _Seq.item)(lineIndex, inputLines);
            {
                const activePatternResult181 = (0, _Identifier.$7C$IsLinkRef$7C$_$7C$)(eachLine);

                if (activePatternResult181 != null) {
                    const link = activePatternResult181;

                    if (link.Case === "Link") {
                        (0, _States.setLinks)((0, _Map.add)(link.Fields[0], link.Fields[1], _States.links));
                    }
                } else {
                    const activePatternResult180 = (0, _Identifier.$7C$IsFootnote$7C$_$7C$)(eachLine);

                    if (activePatternResult180 != null) {
                        const footnote = activePatternResult180;

                        if (footnote.Case === "Footnote") {
                            (0, _States.setFootnotes)((0, _Map.add)(footnote.Fields[0], [(0, _Utility.uuid)(), footnote.Fields[1]], _States.footnotes));
                        }
                    }
                }
            }
            lineIndex = lineIndex + 1;
        }

        lineIndex = 0;

        while (lineIndex <= maxLineIndex) {
            const eachLine = (0, _Seq.item)(lineIndex, inputLines);

            const output = line => {
                outputLines = new _List2.default(line, outputLines);
            };

            {
                const activePatternResult209 = (0, _Identifier.$7C$IsLinkRef$7C$_$7C$)(eachLine);

                if (activePatternResult209 != null) {
                    const link = activePatternResult209;
                } else {
                    const activePatternResult208 = (0, _Identifier.$7C$IsFootnote$7C$_$7C$)(eachLine);

                    if (activePatternResult208 != null) {
                        const footnote = activePatternResult208;
                    } else {
                        const activePatternResult207 = (0, _Identifier.$7C$IsHorizontalRuleLine$7C$_$7C$)(eachLine);

                        if (activePatternResult207 != null) {
                            output("<hr>");
                        } else {
                            const activePatternResult206 = (0, _Identifier.$7C$IsHeading$7C$_$7C$)(eachLine);

                            if (activePatternResult206 != null) {
                                const heading = activePatternResult206;
                                output((0, _Compiler.makeEmphasis)((0, _Compiler.makeHeading)(heading)));
                                (0, _States.addHeading)(heading);
                            } else {
                                const activePatternResult205 = (0, _Identifier.$7C$IsAltHeading$7C$_$7C$)(eachLine);

                                if (activePatternResult205 != null) {
                                    const heading = activePatternResult205;
                                    output((0, _Compiler.makeEmphasis)((0, _Compiler.makeHeading)(heading)));
                                } else {
                                    const activePatternResult204 = (0, _Identifier.$7C$IsLazyQuote$7C$_$7C$)(eachLine);

                                    if (activePatternResult204 != null) {
                                        const quote = activePatternResult204;
                                        output((0, _Compiler.makeEmphasis)((0, _Compiler.makeBlockQuote)(quote)));
                                    } else {
                                        const activePatternResult203 = (0, _Identifier.$7C$IsCodeBlockStart$7C$_$7C$)(eachLine);

                                        if (activePatternResult203 != null) {
                                            const language = activePatternResult203;

                                            if (language === "") {
                                                output("<pre><code>");
                                            } else {
                                                output("<pre><code class='" + language + "'> ");
                                            }

                                            let codeLineIndex = lineIndex + 1;
                                            let foundCodeBlockEnd = false;

                                            while (codeLineIndex <= maxLineIndex ? foundCodeBlockEnd === false : false) {
                                                const inputLine = (0, _Seq.item)(codeLineIndex, inputLines);
                                                const activePatternResult185 = (0, _Identifier.$7C$IsCodeBlockEnd$7C$_$7C$)(inputLine);

                                                if (activePatternResult185 != null) {
                                                    output("</code></pre>");
                                                    lineIndex = codeLineIndex;
                                                    foundCodeBlockEnd = true;
                                                } else {
                                                    output((0, _Utility.htmlEncode)(inputLine) + "\n");
                                                    codeLineIndex = codeLineIndex + 1;
                                                    lineIndex = codeLineIndex;
                                                }
                                            }
                                        } else {
                                            const activePatternResult202 = (0, _Identifier.$7C$IsFlowChartStart$7C$_$7C$)(eachLine);

                                            if (activePatternResult202 != null) {
                                                const flowChartId = (0, _Utility.uuid)();
                                                let flowChartCode = "";
                                                let codeLineIndex = lineIndex + 1;
                                                let foundCodeBlockEnd = false;

                                                while (codeLineIndex <= maxLineIndex ? foundCodeBlockEnd === false : false) {
                                                    const inputLine = (0, _Seq.item)(codeLineIndex, inputLines);
                                                    const activePatternResult188 = (0, _Identifier.$7C$IsCodeBlockEnd$7C$_$7C$)(inputLine);

                                                    if (activePatternResult188 != null) {
                                                        lineIndex = codeLineIndex;
                                                        foundCodeBlockEnd = true;
                                                    } else {
                                                        flowChartCode = flowChartCode + inputLine + "\n";
                                                        codeLineIndex = codeLineIndex + 1;
                                                        lineIndex = codeLineIndex;
                                                    }
                                                }

                                                (0, _States.setFlowCharts)((0, _Map.add)(flowChartId, flowChartCode, _States.flowcharts));
                                                output("<div id='" + flowChartId + "'>" + flowChartCode + "</div>");
                                            } else {
                                                const activePatternResult201 = (0, _Identifier.$7C$IsCollapesStart$7C$_$7C$)(eachLine);

                                                if (activePatternResult201 != null) {
                                                    const text = activePatternResult201;
                                                    const id = (0, _Utility.uuid)();
                                                    const button = text.length > 0 ? text : "Reveal";
                                                    output("<button data-toggle='collapse' data-target='#" + id + "' class='btn btn-primary btn-xs'>" + button + "</button><br><div id='" + id + "' class='collapse'>");
                                                } else {
                                                    const activePatternResult200 = (0, _Identifier.$7C$IsCollapesEnd$7C$_$7C$)(eachLine);

                                                    if (activePatternResult200 != null) {
                                                        output("</div>");
                                                    } else {
                                                        const activePatternResult199 = (0, _Identifier.$7C$IsExcelTableRow$7C$_$7C$)(eachLine);

                                                        if (activePatternResult199 != null) {
                                                            const row = activePatternResult199;
                                                            let table = (0, _List.ofArray)([row]);
                                                            let tableLineIndex = lineIndex + 1;
                                                            let foundTableEnd = false;

                                                            while (tableLineIndex <= maxLineIndex ? foundTableEnd === false : false) {
                                                                const inputLine = (0, _Seq.item)(tableLineIndex, inputLines);
                                                                const activePatternResult191 = (0, _Identifier.$7C$IsExcelTableRow$7C$_$7C$)(inputLine);

                                                                if (activePatternResult191 != null) {
                                                                    const cells = activePatternResult191;
                                                                    table = new _List2.default(cells, table);
                                                                    tableLineIndex = tableLineIndex + 1;
                                                                    lineIndex = tableLineIndex;
                                                                } else {
                                                                    foundTableEnd = true;
                                                                    lineIndex = tableLineIndex;
                                                                }
                                                            }

                                                            table = (0, _List.reverse)(table);
                                                            output((0, _Compiler.makeTable)(table));
                                                        } else {
                                                            const activePatternResult198 = (0, _Identifier.$7C$IsPipeTableRow$7C$_$7C$)(eachLine);

                                                            if (activePatternResult198 != null) {
                                                                const row = activePatternResult198;
                                                                let table = (0, _List.ofArray)([row]);
                                                                let tableLineIndex = lineIndex + 2;
                                                                let foundTableEnd = false;

                                                                while (tableLineIndex <= maxLineIndex ? foundTableEnd === false : false) {
                                                                    const inputLine = (0, _Seq.item)(tableLineIndex, inputLines);
                                                                    const activePatternResult194 = (0, _Identifier.$7C$IsPipeTableRow$7C$_$7C$)(inputLine);

                                                                    if (activePatternResult194 != null) {
                                                                        const cells = activePatternResult194;
                                                                        table = new _List2.default(cells, table);
                                                                        tableLineIndex = tableLineIndex + 1;
                                                                        lineIndex = tableLineIndex;
                                                                    } else {
                                                                        foundTableEnd = true;
                                                                        lineIndex = tableLineIndex;
                                                                    }
                                                                }

                                                                table = (0, _List.reverse)(table);
                                                                output((0, _Compiler.makeTable)(table));
                                                            } else {
                                                                const activePatternResult197 = (0, _Identifier.$7C$IsBlankLine$7C$_$7C$)(eachLine);

                                                                if (activePatternResult197 != null) {
                                                                    output("<br>");
                                                                } else {
                                                                    output((0, _Compiler.makeEmphasis)(eachLine + "<br>"));
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            lineIndex = lineIndex + 1;
        }

        lineIndex = 0;
        const outputLinesArray = Array.from(outputLines);

        while (lineIndex <= maxLineIndex) {
            const eachLine = outputLinesArray[lineIndex];
            {
                const activePatternResult212 = (0, _Identifier.$7C$IsTableOfContent$7C$_$7C$)(eachLine);

                if (activePatternResult212 != null) {
                    outputLinesArray[lineIndex] = (0, _Compiler.makeEmphasis)((0, _Compiler.makeTableOfContent)() + "<br>");
                }
            }
            lineIndex = lineIndex + 1;
        }

        outputLines = (0, _Seq.toList)(outputLinesArray);
        outputLines = new _List2.default((0, _Compiler.makeFootnote)(), outputLines);
        return (0, _String.join)("", (0, _List.reverse)(outputLines));
    }

    window.compileAMD = inputString => compileAMD(inputString);
});
//# sourceMappingURL=UserInterface.js.map