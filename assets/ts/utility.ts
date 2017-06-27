namespace AcademicMarkdown.Utility {
    export function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    (<any>window).uuid = uuid;


    export function changeStyle(id: number = 0) {
        let styleSheet: string[] = [
            "readable",
            "lumen",
            "paper",
            "flatly",
        ]
        let linkElement = document.getElementById('bootstrap-theme') as HTMLLinkElement;
        linkElement.href = "./assets/css/" + styleSheet[id] + "/bootstrap.min.css";
    }

    export function htmlEncode(str) {
        return str.replace(/[&<>"']/g, function ($0) {
            return "&" + { "&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "#39" }[$0] + ";";
        });
    }
    (<any>window).htmlEncode = htmlEncode;
}