// Tuition values (2014-2015) from Wolfram Alpha
var schools = [
    { name: 'Brown', cost: 46408 },
    { name: 'Columbia', cost: 48646 },
    { name: 'Cornell', cost: 47050 },
    { name: 'Dartmouth', cost: 46764 },
    { name: 'Harvard', cost: 40418 },
    { name: 'UPenn', cost: 42176 },
    { name: 'Princeton', cost: 41820 },
    { name: 'Yale', cost: 45800 }
];

// TODO add military hardware costs
var hardware = {
    'moab': 170000
};

function walk(rootNode) {
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            null,
            false
        ),
        node;
    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
    textNode.nodeValue = replaceText(textNode.nodeValue);
}

function translate(h) {

    // Lookup military hardware cost
    var mhc = hardware[h];

    // Select random school
    var uni = schools[Math.floor(Math.random() * schools.length)];

    // Calculate tuition equivalent
    var years = Math.round(mhc * 100 / uni.cost) / 100;

    // Return string
    return years + " years of tuition at " + uni.name;

}

function replaceText(v) {

    v = v.replace(/\b[Mm]other of [Aa]ll [Bb]ombs?\b/g, translate("moab"));

    // TODO add military hardware here

    return v;
}
// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;
    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}
// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
        observerConfig = {
            characterData: true,
            childList: true,
            subtree: true
        },
        bodyObserver, titleObserver;
    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);
    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);
    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
