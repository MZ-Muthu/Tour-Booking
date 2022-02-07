

export const displayMap = locations => {

mapboxgl.accessToken = 'pk.eyJ1IjoiaWZhc2RqZm9pZHNqZm9qIiwiYSI6ImNreXBidHJibjA4aGwyd283eDZtZnhnMDgifQ.0FFIxIXCZIdnzptlYH5uMg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ifasdjfoidsjfoj/ckypduix81phh14q5pq8dt8xm',
   scrollZoom:false
});

let bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);
    new mapboxgl.Popup({
        offset: 30
    }).setLngLat(loc.coordinates).setHTML(`Day ${loc.day} : ${loc.description}`).addTo(map);
    bounds.extend(loc.coordinates);

});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom:200,
        right: 100,
        left:100
    }
});
}
