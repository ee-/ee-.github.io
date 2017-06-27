declare namespace flowchart{
    export interface diagram{
        drawSVG(id: string):string
    }
    export function parse(text: string): diagram
}