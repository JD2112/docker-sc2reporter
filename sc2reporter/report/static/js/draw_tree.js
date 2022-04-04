function drawTree(data){    
    const reloadButton = document.getElementById('reloadButton')
    const labelButton = document.getElementById('labelButton');
    const nodeColourButton = document.getElementById('colourNodes');
    const nodeColourDropdown = document.getElementById('metaCategories');
    const searchNodeInput = document.getElementById('searchNodeInput');
    const submitNodeButton = document.getElementById('submitNodeButton');
    const clearButton = document.getElementById('clearButton');
    const downloadButton = document.getElementById('downloadButton');
    const logButton = document.getElementById('logButton');
    const collapseButton = document.getElementById('collapseButton');
    const helpButton = document.getElementById('helpButton');
    // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

    // Initiate the tree and attach it to the 'tree-holder' div
    var tree = new D3MSTree("tree-holder", data);
    var showLabels = false;
    var loggedLinks = false;
    var linkLengths = 500;
    tree.centerGraph();


    helpButton.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    // Actions associated to the buttons
    // Shows/hides node and link labels
    labelButton.addEventListener('click', () => {
      showLabels = !showLabels;
      tree.showNodeLabels(showLabels);
      tree.showLinkLabels(showLabels);
    })

    // Colors nodes based on selected meta data category
    nodeColourButton.addEventListener('click', () => {
      var metaCat = nodeColourDropdown.options[nodeColourDropdown.selectedIndex].value;
      tree.changeCategory(metaCat);
    })

    // Highlights node in form
    document.querySelector('form.pure-form').addEventListener('submit', function(e) {
      //prevent the normal submission of the form
      e.preventDefault();
      console.log(searchNodeInput.value.split(" "));
      tree.highlightIDs(searchNodeInput.value.split(" "), 'lightblue');
    });

    function clearStyling(){
      tree.highlightIDs([], 'lightblue');
      tree.changeCategory();
    }
    // Clears all styling
    clearButton.addEventListener('click', () => {
      clearStyling();
    })

    downloadButton.addEventListener('click', () => {
      tree.downloadSVG();
    })

    logButton.addEventListener('click', () => {
      loggedLinks = !loggedLinks;
      if (loggedLinks) {
        tree.setLinkLength(Math.log(linkLengths));
      } else {
        tree.setLinkLength(linkLengths)
      }
    })

    reloadButton.addEventListener('click', () => {
      window.location.reload();
    })
    
    collapseButton.addEventListener('click', () => {


      selectedNodes = tree.getSelectedNodeIDs();
      allNodeIds = tree.getAllIDs();
      allNodes = document.getElementsByClassName('node mst-element fixed');
      allLinks = document.getElementsByClassName('link mst-element');
      // combine selectedNodes into pairs of two as a string which can be used to compare links
      var pairs = [];
        for (var i = 0; i < selectedNodes.length; i++) {
          for (var j = i + 1; j < selectedNodes.length; j++) {
            pairs.push([selectedNodes[i], selectedNodes[j]].join('-'));
            pairs.push([selectedNodes[j], selectedNodes[i]].join('-'));
          }
        }
      // runs code if array selectedNodes is not empty
      if (selectedNodes.length > 0) {
        nodes = []
        // Get all nodes as html elements
        d3.selectAll('g')[0].forEach(element => {
          if (element.className.animVal === 'node mst-element fixed' && !selectedNodes.includes(element.id)) {
              nodes.push(element)
          }
        })
        // Remove all nodes
        nodes.forEach(ele => {
          ele.remove()
      })
        // loops through the nodes and sets the opacity to  if they are not selected
        d3.selectAll('g')[0].forEach(element => {
          if (element.className.animVal != 'link mst-element'){
            if ((!selectedNodes.includes(element.id) && element.id != 'vis')) {
              element.remove()
            }
          } else if (!(element.className.animVal === 'link mst-element' && pairs.includes(element.id))){
            element.remove()
          }
        });
      }

      
      tree.clearSelection()
      tree.centerGraph()
    })}