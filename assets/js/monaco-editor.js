// the text editor ID = "monaco-editor-container"
/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
/// <reference path="./typings/flowchart.js.d.ts" />
var AcademicMarkdown;
(function (AcademicMarkdown) {
    var Editor;
    (function (Editor) {
        requirejs.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });
        requirejs(['vs/editor/editor.main'], function () {
            Editor.editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
                language: 'markdown',
                automaticLayout: true,
                scrollbar: {
                    // Subtle shadows to the left & top. Defaults to true.
                    useShadows: false,
                    verticalScrollbarSize: 17,
                },
                wordBasedSuggestions: false,
                tabCompletion: false
            });
            Editor.editor.getModel().updateOptions({ insertSpaces: false, tabSize: 4 });
            Editor.editor.onDidChangeModelContent((event) => {
                _.debounce(compile, 500)();
            });
        });
        function compile() {
            let timer = new Date().getTime();
            let markdownOutputContainer = document.getElementById("markdown-output-container");
            let compiledAMD = window.compileAMD(getEditorContent());
            markdownOutputContainer.innerHTML = compiledAMD;
            //render-flowcharts
            window.getFlowCharts();
            //re-render maths
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, markdownOutputContainer]);
            //re-render code syntax highlighting
            $('code').each(function (index, element) { hljs.highlightBlock(element); });
            console.log("Compile time:", new Date().getTime() - timer);
        }
        Editor.compile = compile;
        function renderFlowchart(source, targetId) {
            let canvas = document.getElementById(targetId);
            canvas.innerHTML = "";
            try {
                let diagram = flowchart.parse(source);
                console.log("Flowchart Parse Successful");
                diagram.drawSVG(targetId);
            }
            catch (error) {
                canvas.innerHTML = "Invalid Flowchart Definition";
                console.warn("Invalid Flowchart:");
                console.warn(source);
            }
        }
        Editor.renderFlowchart = renderFlowchart;
        window.renderFlowchart = renderFlowchart;
        function getEditorContent() {
            return Editor.editor.getValue();
        }
        Editor.getEditorContent = getEditorContent;
        function setEditorContent(string) {
            Editor.editor.setValue(string);
        }
        Editor.setEditorContent = setEditorContent;
        function lockEditor() {
            Editor.editor.updateOptions({ "readOnly": true });
        }
        Editor.lockEditor = lockEditor;
        function unlockEditor() {
            Editor.editor.updateOptions({ "readOnly": false });
        }
        Editor.unlockEditor = unlockEditor;
    })(Editor = AcademicMarkdown.Editor || (AcademicMarkdown.Editor = {}));
})(AcademicMarkdown || (AcademicMarkdown = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFHLDhCQUE4QixDQUFDO2dCQUNsRCxPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNMLENBQUM7UUFiZSxzQkFBZSxrQkFhOUIsQ0FBQTtRQUNLLE1BQU8sQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFBO1FBRS9DO1lBQ0ksTUFBTSxDQUFDLE9BQUEsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLENBQUM7UUFGZSx1QkFBZ0IsbUJBRS9CLENBQUE7UUFFRCwwQkFBaUMsTUFBTTtZQUNuQyxPQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUZlLHVCQUFnQixtQkFFL0IsQ0FBQTtRQUVEO1lBQ0ksT0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFDOUMsQ0FBQztRQUZlLGlCQUFVLGFBRXpCLENBQUE7UUFDRDtZQUNJLE9BQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQy9DLENBQUM7UUFGZSxtQkFBWSxlQUUzQixDQUFBO0lBQ0wsQ0FBQyxFQXhFMEIsTUFBTSxHQUFOLHVCQUFNLEtBQU4sdUJBQU0sUUF3RWhDO0FBQUQsQ0FBQyxFQXhFUyxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBd0V6QiIsImZpbGUiOiJtb25hY28tZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdGhlIHRleHQgZWRpdG9yIElEID0gXCJtb25hY28tZWRpdG9yLWNvbnRhaW5lclwiXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9tb25hY28uZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5cGluZ3MvZmxvd2NoYXJ0LmpzLmQudHNcIiAvPlxyXG5uYW1lc3BhY2UgQWNhZGVtaWNNYXJrZG93bi5FZGl0b3Ige1xyXG4gICAgZXhwb3J0IGxldCBlZGl0b3I6IG1vbmFjby5lZGl0b3IuSVN0YW5kYWxvbmVDb2RlRWRpdG9yO1xyXG5cclxuICAgIHJlcXVpcmVqcy5jb25maWcoeyBwYXRoczogeyAndnMnOiAnLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9taW4vdnMnIH0gfSk7XHJcblxyXG4gICAgcmVxdWlyZWpzKFsndnMvZWRpdG9yL2VkaXRvci5tYWluJ10sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBlZGl0b3IgPSBtb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9uYWNvLWVkaXRvci1jb250YWluZXInKSwge1xyXG4gICAgICAgICAgICBsYW5ndWFnZTogJ21hcmtkb3duJyxcclxuICAgICAgICAgICAgYXV0b21hdGljTGF5b3V0OiB0cnVlLFxyXG4gICAgICAgICAgICBzY3JvbGxiYXI6IHtcclxuICAgICAgICAgICAgICAgIC8vIFN1YnRsZSBzaGFkb3dzIHRvIHRoZSBsZWZ0ICYgdG9wLiBEZWZhdWx0cyB0byB0cnVlLlxyXG4gICAgICAgICAgICAgICAgdXNlU2hhZG93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbFNjcm9sbGJhclNpemU6IDE3LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB3b3JkQmFzZWRTdWdnZXN0aW9uczogZmFsc2UsXHJcbiAgICAgICAgICAgIHRhYkNvbXBsZXRpb246IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVkaXRvci5nZXRNb2RlbCgpLnVwZGF0ZU9wdGlvbnMoeyBpbnNlcnRTcGFjZXM6IGZhbHNlLCB0YWJTaXplOiA0IH0pXHJcbiAgICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlTW9kZWxDb250ZW50KChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBfLmRlYm91bmNlKGNvbXBpbGUsIDUwMCkoKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjb21waWxlKCkge1xyXG4gICAgICAgIGxldCB0aW1lciA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIGxldCBtYXJrZG93bk91dHB1dENvbnRhaW5lcjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcmtkb3duLW91dHB1dC1jb250YWluZXJcIik7XHJcbiAgICAgICAgbGV0IGNvbXBpbGVkQU1EID0gKDxhbnk+d2luZG93KS5jb21waWxlQU1EKGdldEVkaXRvckNvbnRlbnQoKSkgYXMgc3RyaW5nO1xyXG4gICAgICAgIG1hcmtkb3duT3V0cHV0Q29udGFpbmVyLmlubmVySFRNTCA9IGNvbXBpbGVkQU1EO1xyXG5cclxuICAgICAgICAvL3JlbmRlci1mbG93Y2hhcnRzXHJcbiAgICAgICAgKDxhbnk+d2luZG93KS5nZXRGbG93Q2hhcnRzKCk7XHJcbiAgICAgICAgLy9yZS1yZW5kZXIgbWF0aHNcclxuICAgICAgICBNYXRoSmF4Lkh1Yi5RdWV1ZShbXCJUeXBlc2V0XCIsIE1hdGhKYXguSHViLCBtYXJrZG93bk91dHB1dENvbnRhaW5lcl0pO1xyXG5cclxuICAgICAgICAvL3JlLXJlbmRlciBjb2RlIHN5bnRheCBoaWdobGlnaHRpbmdcclxuICAgICAgICAkKCdjb2RlJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHsgaGxqcy5oaWdobGlnaHRCbG9jayhlbGVtZW50KSB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb21waWxlIHRpbWU6XCIsIG5ldyBEYXRlKCkuZ2V0VGltZSgpLXRpbWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVuZGVyRmxvd2NoYXJ0KHNvdXJjZTogc3RyaW5nLCB0YXJnZXRJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldElkKSBhcyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgIGNhbnZhcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBkaWFncmFtID0gZmxvd2NoYXJ0LnBhcnNlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmxvd2NoYXJ0IFBhcnNlIFN1Y2Nlc3NmdWxcIik7XHJcbiAgICAgICAgICAgIGRpYWdyYW0uZHJhd1NWRyh0YXJnZXRJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYW52YXMuaW5uZXJIVE1MID0gXCJJbnZhbGlkIEZsb3djaGFydCBEZWZpbml0aW9uXCI7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgRmxvd2NoYXJ0OlwiKTtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKHNvdXJjZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgKDxhbnk+d2luZG93KS5yZW5kZXJGbG93Y2hhcnQgPSByZW5kZXJGbG93Y2hhcnRcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yQ29udGVudCgpIHtcclxuICAgICAgICByZXR1cm4gZWRpdG9yLmdldFZhbHVlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHNldEVkaXRvckNvbnRlbnQoc3RyaW5nKSB7XHJcbiAgICAgICAgZWRpdG9yLnNldFZhbHVlKHN0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGxvY2tFZGl0b3IoKSB7XHJcbiAgICAgICAgZWRpdG9yLnVwZGF0ZU9wdGlvbnMoeyBcInJlYWRPbmx5XCI6IHRydWUgfSlcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB1bmxvY2tFZGl0b3IoKSB7XHJcbiAgICAgICAgZWRpdG9yLnVwZGF0ZU9wdGlvbnMoeyBcInJlYWRPbmx5XCI6IGZhbHNlIH0pXHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9
