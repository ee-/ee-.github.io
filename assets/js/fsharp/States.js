define(["exports", "fable-core/umd/Map", "fable-core/umd/List", "fable-core/umd/GenericComparer"], function (exports, _Map, _List, _GenericComparer) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.headings = exports.flowcharts = exports.footnotes = exports.links = undefined;
    exports.setLinks = setLinks;
    exports.setFootnotes = setFootnotes;
    exports.setFlowCharts = setFlowCharts;
    exports.initState = initState;
    exports.addHeading = addHeading;

    var _List2 = _interopRequireDefault(_List);

    var _GenericComparer2 = _interopRequireDefault(_GenericComparer);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    let links = exports.links = (0, _Map.create)(new _List2.default(), new _GenericComparer2.default((x, y) => x < y ? -1 : x > y ? 1 : 0));
    let footnotes = exports.footnotes = (0, _Map.create)(new _List2.default(), new _GenericComparer2.default((x, y) => x < y ? -1 : x > y ? 1 : 0));
    let flowcharts = exports.flowcharts = (0, _Map.create)(new _List2.default(), new _GenericComparer2.default((x, y) => x < y ? -1 : x > y ? 1 : 0));
    let headings = exports.headings = new _List2.default();

    function setLinks(newLinks) {
        exports.links = links = newLinks;
    }

    function setFootnotes(newFootnotes) {
        exports.footnotes = footnotes = newFootnotes;
    }

    function setFlowCharts(newFlowCharts) {
        exports.flowcharts = flowcharts = newFlowCharts;
    }

    function initState() {
        exports.links = links = (0, _Map.create)(new _List2.default(), new _GenericComparer2.default((x, y) => x < y ? -1 : x > y ? 1 : 0));
        exports.footnotes = footnotes = (0, _Map.create)(new _List2.default(), new _GenericComparer2.default((x, y) => x < y ? -1 : x > y ? 1 : 0));
        exports.headings = headings = new _List2.default();
        exports.flowcharts = flowcharts = (0, _Map.create)(new _List2.default(), new _GenericComparer2.default((x, y) => x < y ? -1 : x > y ? 1 : 0));
    }

    function addHeading(newHeading) {
        if (newHeading.Case === "Heading") {
            exports.headings = headings = new _List2.default([newHeading.Fields[0], newHeading.Fields[1], newHeading.Fields[2]], headings);
        }
    }
});
//# sourceMappingURL=States.js.map