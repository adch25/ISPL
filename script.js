

// function flyToProject(project) {
//     const lat = project.geometry.coordinates[1];
//     const lng = project.geometry.coordinates[0];
//     myMap.flyTo([lat, lng], 14, {
//         duration: 3
//     });
//     setTimeout(() => {
//         L.popup({closeButton: false, offset: L.point(0, -8)})
//         .setLatLng([lat, lng])
//         .setContent(makePopupContent(project))
//         .openOn(myMap);
//     }, 2000);
// }

// function generateList() {
//   const ul = document.querySelector('.list');
//   solarList.forEach((project) => {
//     const li = document.createElement('li');
//     const div = document.createElement('div');
//     const a = document.createElement('a');
//     const p = document.createElement('p');
//     a.addEventListener('click', () => {
//         flyToProject(project);
//     });
//     div.classList.add('project-item');
//     a.innerText = project.properties["Project Name"];
//     a.href = '#';
//     p.innerText = `${project.properties.State}, ${project.properties["Owner Name"]}`;

//     div.appendChild(a);
//     div.appendChild(p);
//     li.appendChild(div);
//     ul.appendChild(li);
//   });
// }
// generateList();

// function makePopupContent(project) {
//   return `
//     <div>
//         <h4>${project.properties["Project Name"]}</h4>
//         <p>Owner: ${project.properties["Owner Name"]}</p>
//         <p>AC Capacity: ${project.properties["AC Capacity(MW)"]} MW</p>
//         <p>Location: ${project.properties.State}</p>
//     </div>
//   `;
// }

// function onEachFeature(feature, layer) {
//     layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
// }

// var myIcon = L.icon({
//     iconUrl: 'icon.png', 
//     iconSize: [20, 30]
// });

// const projectsLayer = L.geoJSON(solarList, {
//     onEachFeature: onEachFeature,
//     pointToLayer: function(feature, latlng) {
//         return L.marker(latlng, { icon: myIcon });
//     }
// });
// projectsLayer.addTo(myMap);

const myMap = L.map('map').setView([22.9074872, 79.07306671], 5);
const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileLayer = L.tileLayer(tileUrl, { attribution });
tileLayer.addTo(myMap);

let filteredSolarList = solarList;

document.getElementById('state-dropdown').addEventListener('change', function() {
    const selectedState = this.value;
    if (selectedState) {
        filteredSolarList = solarList.filter(project => project.properties.State === selectedState);
    } else {
        filteredSolarList = solarList;
    }
    updateMapAndList();
});

function flyToProject(project) {
    const lat = project.geometry.coordinates[1];
    const lng = project.geometry.coordinates[0];
    myMap.flyTo([lat, lng], 14, { duration: 3 });
    setTimeout(() => {
        L.popup({ closeButton: false, offset: L.point(0, -8) })
            .setLatLng([lat, lng])
            .setContent(makePopupContent(project))
            .openOn(myMap);
    }, 2000);
}

function generateList() {
  const ul = document.querySelector('.list');
  ul.innerHTML = '';
  filteredSolarList.forEach((project) => {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const a = document.createElement('a');
    const p = document.createElement('p');
    a.addEventListener('click', () => {
        flyToProject(project);
    });
    div.classList.add('project-item');
    a.innerText = project.properties["Project Name"];
    a.href = '#';
    p.innerText = `${project.properties.State}, ${project.properties["Owner Name"]}`;

    div.appendChild(a);
    div.appendChild(p);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

function makePopupContent(project) {
  return `
    <div>
        <h4>${project.properties["Project Name"]}</h4>
        <p>Owner: ${project.properties["Owner Name"]}</p>
        <p>AC Capacity: ${project.properties["AC Capacity(MW)"]} MW</p>
        <p>Location: ${project.properties.State}</p>
    </div>
  `;
}

function updateMapAndList() {
  myMap.eachLayer(layer => {
      if (layer instanceof L.Marker) {
          myMap.removeLayer(layer);
      }
  });

  const projectsLayer = L.geoJSON(filteredSolarList, {
    onEachFeature: (feature, layer) => layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) }),
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: L.icon({ iconUrl: 'icon.png', iconSize: [20, 30] }) })
  }).addTo(myMap);
  generateList();
}
updateMapAndList();