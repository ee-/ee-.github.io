// the text editor ID = "monaco-editor-container"
/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
/// <reference path="./typings/flowchart.js.d.ts" />
namespace AcademicMarkdown.Editor {
    export let editor: monaco.editor.IStandaloneCodeEditor;

    requirejs.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });

    requirejs(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
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

        editor.getModel().updateOptions({ insertSpaces: false, tabSize: 4 })
        editor.onDidChangeModelContent((event) => {
            _.debounce(compile, 500)();
        })

    });

    export function compile() {
        let timer = new Date().getTime();
        let markdownOutputContainer: HTMLElement = document.getElementById("markdown-output-container");
        let compiledAMD = (<any>window).compileAMD(getEditorContent()) as string;
        markdownOutputContainer.innerHTML = compiledAMD;

        //render-flowcharts
        (<any>window).getFlowCharts();
        //re-render maths
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, markdownOutputContainer]);

        //re-render code syntax highlighting
        $('code').each(function (index, element) { hljs.highlightBlock(element) });

        console.log("Compile time:", new Date().getTime()-timer);
    }

    export function renderFlowchart(source: string, targetId: string) {
        let canvas = document.getElementById(targetId) as HTMLDivElement
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
    (<any>window).renderFlowchart = renderFlowchart

    export function getEditorContent() {
        return editor.getValue();
    }

    export function setEditorContent(string) {
        editor.setValue(string);
    }

    export function lockEditor() {
        editor.updateOptions({ "readOnly": true })
    }
    export function unlockEditor() {
        editor.updateOptions({ "readOnly": false })
    }
}