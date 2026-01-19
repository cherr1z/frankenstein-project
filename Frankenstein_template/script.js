// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
console.log("tei element:", tei);
console.log("tei.innerHTML:", tei ? tei.innerHTML : "element not found");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = "../xml/" + tei_xml.concat(extension);
console.log("Looking for XML file at:", folio_xml);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl"
function documentLoader() {
    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("../Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = '';
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
}
  
// function to transform the metadata encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl"
function statsLoader() {
    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("../Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = '';
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
}

// Initial document load
documentLoader();
statsLoader();
// Event listener for hand selection dropdown
function selectHand(event) {
  var visible_mary = document.getElementsByClassName('MWS');
  var visible_percy = document.getElementsByClassName('PBS');
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);
  
  if (event.target.value == 'both') {
    MaryArray.forEach(element => {
      element.style.backgroundColor = 'transparent';
    });
    PercyArray.forEach(element => {
      element.style.backgroundColor = 'transparent';
    });
    
  } else if (event.target.value == 'Mary') {
    MaryArray.forEach(element => {
      element.style.backgroundColor = 'rgba(236, 143, 157, 0.7)';
    });
    PercyArray.forEach(element => {
      element.style.backgroundColor = 'transparent';
    });
    
  } else {
    MaryArray.forEach(element => {
      element.style.backgroundColor = 'transparent';
    });
    PercyArray.forEach(element => {
      element.style.backgroundColor = 'rgba(173, 216, 230, 0.7)';
    });
  }
}

// Toggle deletions on/off
function toggleDeletions() {
  var deletions = document.querySelectorAll('del');
  deletions.forEach(element => {
    if (element.style.display === 'none') {
      element.style.display = 'inline';
    } else {
      element.style.display = 'none';
    }
  });
}

// Toggle between diplomatic view and reading text view
let isReadingView = false;

function toggleReadingView() {
  var deletions = document.querySelectorAll('del');
  var supraAdds = document.querySelectorAll('.supraAdd');
  var infraAdds = document.querySelectorAll('.infraAdd');
  var inlineAdds = document.querySelectorAll('.inlineAdd');
  
  if (!isReadingView) {
    // Switch to reading view
    deletions.forEach(element => {
      element.style.display = 'none';
    });
    supraAdds.forEach(element => {
      element.style.verticalAlign = 'baseline';
      element.style.fontSize = 'inherit';
      element.style.backgroundColor = 'transparent';
    });
    infraAdds.forEach(element => {
      element.style.verticalAlign = 'baseline';
      element.style.fontSize = 'inherit';
      element.style.backgroundColor = 'transparent';
    });
    inlineAdds.forEach(element => {
      element.style.backgroundColor = 'transparent';
    });
    isReadingView = true;
  } else {
    // Switch back to diplomatic view
    deletions.forEach(element => {
      element.style.display = 'inline';
    });
    supraAdds.forEach(element => {
      element.style.verticalAlign = 'super';
      element.style.fontSize = 'smaller';
      element.style.backgroundColor = '';
    });
    infraAdds.forEach(element => {
      element.style.verticalAlign = 'sub';
      element.style.fontSize = 'smaller';
      element.style.backgroundColor = '';
    });
    inlineAdds.forEach(element => {
      element.style.backgroundColor = '';
    });
    isReadingView = false;
  }
}