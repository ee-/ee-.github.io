define(["exports", "fable-core/umd/RegExp", "fable-core/umd/Seq"], function (exports, _RegExp, _Seq) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.matchRegex = matchRegex;
    exports.firstRegexGroup = firstRegexGroup;
    exports.splitByLine = splitByLine;
    exports.uuid = uuid;
    exports.htmlEncode = htmlEncode;

    function matchRegex(pattern, input) {
        const m = (0, _RegExp.match)(input, pattern);

        if (m != null) {
            return true;
        } else {
            return false;
        }
    }

    function firstRegexGroup(pattern, input) {
        const m = (0, _RegExp.match)(input, pattern);

        if (m != null) {
            return m[1];
        }
    }

    function splitByLine(text) {
        const filtered = (0, _RegExp.replace)(text, "\r\n", "\n");
        const removedExtraLines = (0, _RegExp.replace)(filtered, "[\n\r]{3,}", "\n\n");
        return (0, _Seq.toList)(removedExtraLines.split("\n"));
    }

    function uuid() {
        return window.uuid();
    }

    function htmlEncode(html) {
        return window.htmlEncode(html);
    }
});
//# sourceMappingURL=Utility.js.map