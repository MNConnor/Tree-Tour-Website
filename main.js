// Creates an array of all the Trees with Name, Long, and Lat attributes
console.log("Importing Tree Data");
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "18.xml", false);
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;
x = xmlDoc.getElementsByTagName("ThemeEntityAbridgedData");
const Trees = []; // Array of all the trees
for (i = 0; i < x.length; i++) 
{
  TreeName = x[i].childNodes[1].childNodes[0].nodeValue; 
  try
  {
    TreeImage = x[i].childNodes[0].childNodes[0].nodeValue;
    LatLong = x[i].childNodes[3].childNodes[0].nodeValue;
    LatLong = LatLong.split("\"");
    const Tree = {Name:TreeName, Lat:LatLong[3], Long:LatLong[7], Image:TreeImage}; // Creating the Tree object
    Trees.push(Tree); // Adding the Tree object to the Trees array
  }
  catch{} // This skips trees that don't have a long/lat
}

// Creating the map
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-91.64, 44.048]),
    zoom: 17
  })
});





TreeFeatures = [];

for (i = 0; i < Trees.length; i++) // Adds all coordinates to the features array
{
var lon = parseFloat(Trees[i]['Long']);
var lat = parseFloat(Trees[i]['Lat']);

const iconFeature = new ol.Feature({
geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
name: Trees[i]['Name'],
});

const TreeColors = ['#8fbb09', '#d6e715', '#fbf601', '#fbcd26', '#fa8f04', '#f64d0d'] // Fall color hex codes
const iconStyle = new ol.style.Style({
image: new ol.style.Icon({
    anchor: [0.5, 46],
    color: TreeColors[Math.floor(Math.random()*TreeColors.length)], //picks a random tree color
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'tree.png',
    scale: 0.1,
}),
});
iconFeature.setStyle(iconStyle);
TreeFeatures.push(iconFeature)
}

const vectorSource = new ol.source.Vector({
    features: TreeFeatures,
});

const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
});
    
map.addLayer(vectorLayer); // Display the layer with all the trees


// function showPosition(position) 
// {
//   var layer = new ol.layer.Vector({
//     source: new ol.source.Vector({
//       features: [
//         new ol.Feature({
//           geometry: new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]))
//         })]
//       })
//     });
//   map.addLayer(layer);
// }

function focusTree(Tree) // Used to focus the map onto a single tree
{
  TreeFeatures = [];
  const iconFeature = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([Tree['Long'], Tree['Lat']])),
  name: "current",
  });

  const iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'tree.png',
      scale: 0.18,
  }),
  });
  iconFeature.setStyle(iconStyle);
  TreeFeatures.push(iconFeature)
  

  const vectorSource = new ol.source.Vector({
      features: TreeFeatures,
  });

  const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
  });
        
  map.addLayer(vectorLayer); // Display the layer with all the trees

    map.getView().setCenter(ol.proj.fromLonLat([Tree['Long'], Tree['Lat']]));
    map.getView().setZoom(19);
}


TreeIndex = -1;
getNextTree(); // Runs on startup to get the first tree
function getNextTree() // Gets the next tree in the array
{
  var div = document.getElementById("bottom");
  if (div.style.height == "100%")
  {
    div.style.height = "20%";
    div.style.top = "80%";
  }
//discuss in comments
//could print over prvious tree but that doesnt allow us to make it smaller
//do you think you could make this in the focus tree?
//we cant pass it to the getNextTree because focustree does call anything
//probs, anything is possiblee
  TreeIndex = TreeIndex += 1;
  console.log(TreeIndex);
  document.getElementById(
    "MainTourText").innerHTML = Trees[TreeIndex]['Name'] +
    "<br><button id = \"BackButton\" onclick=\"decreaseTreeIndex()\">Back</button>" +
    "<button id = \"HereButton\" onclick=\"displayTreeInfo()\">I'm Here</button>" + 
    "<button id = \"NextButton\" onclick=\"getNextTree()\">Next Tree</button>";
  focusTree(Trees[TreeIndex]);
}

function displayTreeInfo()
{
  console.log(TreeIndex);
  var div = document.getElementById("bottom");
  if(div) 
  {
      div.style.height = "100%";
      div.style.top = "0%";
      ImageUrl = Trees[TreeIndex]['Image'];
      console.log(ImageUrl);
      document.getElementById(
        "MainTourText").innerHTML= 
        "<p id=\"TreeNameText\">" + Trees[TreeIndex]['Name'] + "</p>" +
        "<img id=\"TreeImg\" src=\"" + ImageUrl + "\">" +
        "<p id=\"TreeInfoText\">this tree is epic.</p>" +
      "<br><button id = \"NextButton\" onclick=\"getNextTree()\">Next Tree</button>";
  }
}

// Used for the back button
function decreaseTreeIndex()
{
  if (TreeIndex <= 0)
  {
    alert("No Previous Trees");
    return
  }
  TreeIndex = TreeIndex - 2;
  getNextTree();
}

function increaseTreeIndex()
{
  TreeIndex += 1;
}
