
//search for element only after all DOMs are loaded
window.addEventListener('DOMContentLoaded', (event) => {
    // on load set textarea height
    setResultTextareaHeight();

    const paramInputs = document.querySelectorAll('.inputField');

    // assign listner to every input field
    paramInputs.forEach(el => el.addEventListener('input', event => {
        callParse();
    }));
});

function callParse () {
    const iterations = document.getElementById('parametersInput').getElementsByTagName('input').length / 4;
    // sessionStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
    const htmlToParse = document.getElementById('htmlResultTextArea').value; // sessionStorage.getItem(fetchedPage);

    // textToParse, number of total iterations (rows with input), current iteration
    parse(htmlToParse, iterations, 0);
}

function parse (htmlToParse, totalIterations, currentIteration) {
    // No iterations left -> return
    if (totalIterations == 0) return;

    // Inputs name: element, id, classes, text
    const inputs = document.getElementById('parametersInput').getElementsByTagName('input');

    // if a new row with parametrs (except first one) is empty don't apply empty string on the result parse
    if (inputs[ 0 + (currentIteration * 4) ].value == "" &&
        inputs[ 1 + (currentIteration * 4) ].value == "" &&
        inputs[ 2 + (currentIteration * 4) ].value == "" &&
        inputs[ 3 + (currentIteration * 4) ].value == "")
        parse(htmlToParse, --totalIterations, ++currentIteration);

    // Convert plain fetched text into html object
    // https://tomassetti.me/parsing-html/#browser
    parser = new DOMParser();
    fetchDoc = parser.parseFromString(htmlToParse, "text/html");

    // if input field with ID is filled no other inputs are checked
    // input with name ID (input array 1 + k* iteration)
    if (inputs[ 1 + (currentIteration * 4) ].value != "") {
        const resultID = fetchDoc.getElementById(inputs[ 1 + (currentIteration * 4) ].value);
        if (resultID != "" && resultID != null) {
            document.getElementById("paramResultTextArea").innerHTML = resultID.outerHTML;
            return;
        }
    }

    let resultTag = [];
    // input with name tag (input array 0 + k* iteration)
    if (inputs[ 0 + (currentIteration * 4) ].value != "")
        resultTag = fetchDoc.getElementsByTagName(inputs[ 0 + (currentIteration * 4) ].value);

    let resultClasses = [];
    // input with name classes (input array 2 + k* iteration)
    if (inputs[ 2 + (currentIteration * 4) ].value != "")
        resultClasses = fetchDoc.getElementsByClassName(inputs[ 2 + (currentIteration * 4) ].value);

    let elementAndClasses = resultArrayInnerJoin(resultTag, resultClasses);

    // input with name text (input array 3 + k* iteration)
    if (inputs[ 3 + (currentIteration * 4) ].value != "") {
        // by default matching text will be searched in array created from class/element input
        let resultText = [];
        let arrayForSearch = elementAndClasses;

        //if both previous arrays are empty takes from whole fetched page for search
        if (elementAndClasses.length == 0)
            // select all tag elements from given URL to search in
            arrayForSearch = fetchDoc.getElementsByTagName("*");

        // check if any el contains given text
        for (item of arrayForSearch) {
            if (item.outerHTML.includes(inputs[ 3 + (currentIteration * 4) ].value) &&
                item.tagName != "HTML" &&
                item.tagName != "HEAD" &&
                item.tagName != "BODY")
                resultText.push(item);
        }
        elementAndClasses = resultText;
    }

    // print result into result textbox
    const elResult = document.getElementById("paramResultTextArea");
    // in order to print into the textarea, it's innerHTML has to be set to ""
    elResult.value = "";
    var stringForAnotherIterations = "";
    let i = 0;
    for (item of elementAndClasses) {
        elResult.value += `\n\n======================= Result #${ i++ + 1 } =======================\n\n`;

        elResult.value += item.innerHTML;
        stringForAnotherIterations += item.innerHTML;
    }
    // each iterations if every line of input fields
    parse(stringForAnotherIterations, --totalIterations, ++currentIteration);
}

function resultArrayInnerJoin (arr, arr2) {
    if (arr.length == 0)
        return arr2;
    else if (arr2.length == 0)
        return arr;

    var innerJoin = [];

    for (item of arr) {
        for (innerItem of arr2) {
            if (item == innerItem)
                innerJoin.push(item);//console.log( item )
        }
    }
    return innerJoin;
}