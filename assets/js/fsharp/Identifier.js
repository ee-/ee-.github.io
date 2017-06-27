define(["exports", "./Utility", "fable-core/umd/RegExp", "./Types", "fable-core/umd/Seq", "fable-core/umd/List", "fable-core/umd/String"], function (exports, _Utility, _RegExp, _Types, _Seq, _List, _String) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.$7C$IsPipeTableRow$7C$_$7C$ = exports.$7C$IsLazyQuote$7C$_$7C$ = exports.$7C$IsExcelTableRow$7C$_$7C$ = exports.$7C$IsCollapesEnd$7C$_$7C$ = exports.$7C$IsCollapesStart$7C$_$7C$ = exports.$7C$IsCodeBlockEnd$7C$_$7C$ = exports.$7C$IsFlowChartStart$7C$_$7C$ = exports.$7C$IsCodeBlockStart$7C$_$7C$ = exports.$7C$IsBlockQuoteLine$7C$_$7C$ = exports.$7C$IsBlockQuoteStart$7C$_$7C$ = exports.$7C$IsFootnote$7C$_$7C$ = exports.$7C$IsLinkRef$7C$_$7C$ = exports.$7C$IsTableOfContent$7C$_$7C$ = exports.$7C$IsAltHeading$7C$_$7C$ = exports.$7C$IsHeadingLevelTwo$7C$_$7C$ = exports.$7C$IsHeadingLevelOne$7C$_$7C$ = exports.$7C$IsHeading$7C$_$7C$ = exports.$7C$IsHorizontalRuleLine$7C$_$7C$ = exports.$7C$IsBlankLine$7C$_$7C$ = undefined;

    function _IsBlankLine___(_arg1) {
        return _arg1 === "" ? true : null;
    }

    exports.$7C$IsBlankLine$7C$_$7C$ = _IsBlankLine___;

    function _IsHorizontalRuleLine___(line) {
        const pattern = "^ {0,3}((\\* ?){3,}|(- ?){3,}|(_ ?){3,})$";

        if ((0, _Utility.matchRegex)(pattern, line)) {
            return {};
        }
    }

    exports.$7C$IsHorizontalRuleLine$7C$_$7C$ = _IsHorizontalRuleLine___;

    function _IsHeading___(line) {
        const pattern = "^ {0,3}(#+)([^#]+)#*";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            const heading = new _Types.Paragraph("Heading", [m[2], m[1].length, (0, _Utility.uuid)()]);
            return heading;
        }
    }

    exports.$7C$IsHeading$7C$_$7C$ = _IsHeading___;

    function _IsHeadingLevelOne___(line) {
        const pattern = "^ {0,3}=+$";

        if ((0, _Utility.matchRegex)(pattern, line)) {
            return {};
        }
    }

    exports.$7C$IsHeadingLevelOne$7C$_$7C$ = _IsHeadingLevelOne___;

    function _IsHeadingLevelTwo___(line) {
        const pattern = "^ {0,3}-+$";

        if ((0, _Utility.matchRegex)(pattern, line)) {
            return {};
        }
    }

    exports.$7C$IsHeadingLevelTwo$7C$_$7C$ = _IsHeadingLevelTwo___;

    function _IsAltHeading___(line) {
        const pattern = "^ {0,3}(%+)([^%]+)";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            const heading = new _Types.Paragraph("Heading", [m[2], m[1].length, (0, _Utility.uuid)()]);
            return heading;
        }
    }

    exports.$7C$IsAltHeading$7C$_$7C$ = _IsAltHeading___;

    function _IsTableOfContent___(line) {
        const pattern = "^ {0,3}\\[contents\\]";
        const m = (0, _RegExp.match)(line, pattern, 1);

        if (m != null) {
            return {};
        }
    }

    exports.$7C$IsTableOfContent$7C$_$7C$ = _IsTableOfContent___;

    function _IsLinkRef___(line) {
        const pattern = "^ {0,3}\\[([^\\^].*)\\] *: *([^ \"]+) *(?:\"([^\"]+)\")?";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            const link = new _Types.Paragraph("Link", [m[1], m[2], m[3]]);
            return link;
        }
    }

    exports.$7C$IsLinkRef$7C$_$7C$ = _IsLinkRef___;

    function _IsFootnote___(line) {
        const pattern = "^ {0,3}\\[\\^(.+)\\] *: *(.+)";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            const footNote = new _Types.Paragraph("Footnote", [m[1], m[2]]);
            return footNote;
        }
    }

    exports.$7C$IsFootnote$7C$_$7C$ = _IsFootnote___;

    function _IsBlockQuoteStart___(line) {
        const pattern = "^ {0,3}>(.*)";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            return m[1];
        }
    }

    exports.$7C$IsBlockQuoteStart$7C$_$7C$ = _IsBlockQuoteStart___;

    function _IsBlockQuoteLine___(line) {
        const pattern = "^ {0,3}>(.*)|\n";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            return m[1];
        }
    }

    exports.$7C$IsBlockQuoteLine$7C$_$7C$ = _IsBlockQuoteLine___;

    function _IsCodeBlockStart___(line) {
        const pattern = "^ {0,3}`{3}([\\w\\+-]*)? *$";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            const language = m[1] != null ? m[1] : "";
            return language;
        }
    }

    exports.$7C$IsCodeBlockStart$7C$_$7C$ = _IsCodeBlockStart___;

    function _IsFlowChartStart___(line) {
        const pattern = "^ {0,3}`{3} *{flowchart}";

        if ((0, _Utility.matchRegex)(pattern, line)) {
            return {};
        }
    }

    exports.$7C$IsFlowChartStart$7C$_$7C$ = _IsFlowChartStart___;

    function _IsCodeBlockEnd___(line) {
        const pattern = "^ {0,3}`{3}";

        if ((0, _Utility.matchRegex)(pattern, line)) {
            return {};
        }
    }

    exports.$7C$IsCodeBlockEnd$7C$_$7C$ = _IsCodeBlockEnd___;

    function _IsCollapesStart___(line) {
        const pattern = "^ {0,3}@@*([^@]*)?$";
        return (0, _Utility.firstRegexGroup)(pattern, line);
    }

    exports.$7C$IsCollapesStart$7C$_$7C$ = _IsCollapesStart___;

    function _IsCollapesEnd___(line) {
        const pattern = "^ {0,3}@@$";

        if ((0, _Utility.matchRegex)(pattern, line)) {
            return {};
        }
    }

    exports.$7C$IsCollapesEnd$7C$_$7C$ = _IsCollapesEnd___;

    function _IsExcelTableRow___(line) {
        const pattern = "^(.+\t)+.*\t?";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            const rowString = m[0];
            const cells = (0, _Seq.toList)(rowString.split("\t"));
            return cells;
        }
    }

    exports.$7C$IsExcelTableRow$7C$_$7C$ = _IsExcelTableRow___;

    function _IsLazyQuote___(line) {
        const pattern = "^ {0,3}> *(.*)";
        return (0, _Utility.firstRegexGroup)(pattern, line);
    }

    exports.$7C$IsLazyQuote$7C$_$7C$ = _IsLazyQuote___;

    function _IsPipeTableRow___(line) {
        const pattern = "^\\|([^\\|]+\\|)+";
        const m = (0, _RegExp.match)(line, pattern);

        if (m != null) {
            const rowString = m[0];
            const cells = (0, _List.map)(x => (0, _String.trim)(x, "both"), (0, _Seq.toList)(rowString.split("|")));
            let cells_1 = (0, _List.slice)(1, cells.length - 2, cells);
            return cells_1;
        }
    }

    exports.$7C$IsPipeTableRow$7C$_$7C$ = _IsPipeTableRow___;
});
//# sourceMappingURL=Identifier.js.map