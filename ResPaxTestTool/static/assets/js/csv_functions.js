/**
 * Created by Shaquille on 1/08/2016.
 */
function addCSVButton(element, CSVContent, filename) {
    var encodedUri = encodeURI(CSVContent);
    var button = document.createElement("button");
    var button_value = document.createTextNode("Download CSV");

    button.appendChild(button_value);
    button.setAttribute("onclick", "downloadCSV('"+encodedUri+"','"+filename+"');");
    button.setAttribute("download", filename + ".csv");
    button.setAttribute("style", "float:right; color:#0089BB");


    element.appendChild(button);
}

function downloadCSV(encodedUri, filename){
    var CSVLink = document.createElement("a");
    CSVLink.setAttribute("href", encodedUri);
    CSVLink.setAttribute("download", filename + ".csv");
    CSVLink.click();
}