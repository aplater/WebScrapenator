// tab with HTML code
const tabHTML = "htmlResult";
// its text area
const tabHTMLTextArea = "htmlResultTextArea";

// result based on users' parameters
const tabResult = "paramResult";
// its text area
const tabResultTextArea = "paramResultTextArea";

var activeTab = tabHTMLTextArea;

function tabsButtons (el) {
    if (el.id == tabHTML) {
        document.getElementById(tabResultTextArea).style.display = "none";
        document.getElementById(tabHTMLTextArea).style.display = "initial";
        activeTab = tabHTMLTextArea;
    }
    else {
        document.getElementById(tabResultTextArea).style.display = "initial";
        document.getElementById(tabHTMLTextArea).style.display = "none";
        activeTab = tabResultTextArea;
    }
    setResultTextareaHeight();
}

function setResultTextareaHeight () {
    // total height of the page
    const documentHeight = document.body.clientHeight;

    // header height
    // we have only 1 header on the page
    const listOfHeaders = document.getElementsByTagName('header');
    const headerHeight = listOfHeaders[ 0 ].clientHeight;

    // footer height
    // we have only 1 footer on the page
    const listOfFooters = document.getElementsByTagName('footer');
    const footerHeight = listOfFooters[ 0 ].clientHeight;

    // calculate how tall the content should be
    const contentHeight = documentHeight - headerHeight - footerHeight;

    // calculate result textarea height
    const searchHeight = document.getElementById('search').clientHeight;
    const parametersHeight = document.getElementById('parameters').clientHeight;

    const listOfTabs = document.getElementsByClassName('tabs');
    const tabsHeight = listOfTabs[ 0 ].clientHeight;

    const pageMargins = 14;

    const resultTextareaHeight = contentHeight - searchHeight - parametersHeight - tabsHeight - pageMargins;

    // set textarea height
    document.getElementById(activeTab).style.height = `${ resultTextareaHeight }px`;

    document.getElementsByTagName('aside')[ 0 ].style.height = `${ contentHeight }px`;
}