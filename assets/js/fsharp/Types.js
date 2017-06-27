define(["exports", "fable-core/umd/Symbol", "fable-core/umd/Util", "fable-core/umd/List"], function (exports, _Symbol2, _Util, _List) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Paragraph = exports.ListKind = undefined;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    var _List2 = _interopRequireDefault(_List);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    class ListKind {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "AcademicMarkdown.Types.ListKind",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Ordered: [],
                    Task: [],
                    Unordered: []
                }
            };
        }

        Equals(other) {
            return (0, _Util.equalsUnions)(this, other);
        }

        CompareTo(other) {
            return (0, _Util.compareUnions)(this, other);
        }

    }

    exports.ListKind = ListKind;
    (0, _Symbol2.setType)("AcademicMarkdown.Types.ListKind", ListKind);

    class Paragraph {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "AcademicMarkdown.Types.Paragraph",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Blockquote: ["string"],
                    Codeblock: ["string", "string"],
                    Footnote: ["string", "string"],
                    Heading: ["string", "number", "string"],
                    Link: ["string", "string", "string"],
                    Literal: ["string"],
                    OrderedList: [(0, _Util.makeGeneric)(_List2.default, {
                        T: Paragraph
                    }), ListKind]
                }
            };
        }

        Equals(other) {
            return (0, _Util.equalsUnions)(this, other);
        }

        CompareTo(other) {
            return (0, _Util.compareUnions)(this, other);
        }

    }

    exports.Paragraph = Paragraph;
    (0, _Symbol2.setType)("AcademicMarkdown.Types.Paragraph", Paragraph);
});
//# sourceMappingURL=Types.js.map