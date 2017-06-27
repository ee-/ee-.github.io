// the text editor ID = "monaco-editor-container"

requirejs.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });
requirejs(['vs/editor/editor.main'], function () {
    let editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
        language: 'markdown',
        automaticLayout: true,
        scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,
            verticalScrollbarSize: 17,
        }
    });


    editor.onDidChangeModelContent((event) => {
        console.log(event);
        //rerender maths
        let markdownOutputContainer = document.getElementById("markdown-output-container");
        markdownOutputContainer.innerHTML = getEditorContent();
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, markdownOutputContainer]);

        //rerender code syntax highlighting

        $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
    })

    function getEditorContent() {
        return editor.getValue();
    }

    function setEditorContent(string) {
        editor.setValue(string);
    }

    function lockEditor() {
        editor.updateOptions({ "readOnly": true })
    }
    function unlockEditor() {
        editor.updateOptions({ "readOnly": false })
    }

    //set global for calling from fsharp
    window.editor = editor
    window.setEditorContent = setEditorContent;
    window.getEditorContent = getEditorContent;
    window.lockEditor = lockEditor;
    window.unlockEditor = unlockEditor;
});