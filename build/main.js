'use strict';var $=function(a){return 1<document.querySelectorAll(a).length?document.querySelectorAll(a):document.querySelector(a)};Element.prototype.on=Element.prototype.addEventListener,$('#slike').style.marginLeft=0;var slike=[],pomak=200,ucitajSlika=1200<window.innerWidth?30:600<window.innerWidth?20:10,brojacSlika=0,ucitaneSlike=!1,stilMape=[{featureType:'landscape.man_made',elementType:'geometry',stylers:[{color:'#f7f1df'}]},{featureType:'landscape.natural',elementType:'geometry',stylers:[{color:'#d0e3b4'}]},{featureType:'landscape.natural.terrain',elementType:'geometry',stylers:[{visibility:'off'}]},{featureType:'poi',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'poi.business',elementType:'all',stylers:[{visibility:'off'}]},{featureType:'poi.medical',elementType:'geometry',stylers:[{color:'#fbd3da'}]},{featureType:'poi.park',elementType:'geometry',stylers:[{color:'#bde6ab'}]},{featureType:'road',elementType:'geometry.stroke',stylers:[{visibility:'off'}]},{featureType:'road',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'road.highway',elementType:'geometry.fill',stylers:[{color:'#ffe15f'}]},{featureType:'road.highway',elementType:'geometry.stroke',stylers:[{color:'#efd151'}]},{featureType:'road.arterial',elementType:'geometry.fill',stylers:[{color:'#ffffff'}]},{featureType:'road.local',elementType:'geometry.fill',stylers:[{color:'black'}]},{featureType:'transit.station.airport',elementType:'geometry.fill',stylers:[{color:'#cfb2db'}]},{featureType:'water',elementType:'geometry',stylers:[{color:'#a2daf2'}]}];function praviMapu(){return new google.maps.Map(document.getElementById('map-canvas'),{center:{lat:44.341667,lng:17.269444},zoom:8,zoomControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},streetViewControl:!1,styles:stilMape})}function praviProzor(a,b){var c='\n    <h3>'+a.mesto+'</h3>\n    </p>'+(a.naziv||'')+'</p>\n    <a href="'+b+'">Find place</a>\n  ';return a.info&&(c+='<a href="'+a.info+'" target="_blank">Read more</a>'),new google.maps.InfoWindow({content:c})}function praviMarker(a,b,c){return new google.maps.Marker({map:a,infoWindow:b,position:new google.maps.LatLng(c.koordinate.lat,c.koordinate.lng),title:c.naziv||c.mesto,icon:'obelisk.png'})}function initialize(a){var b=praviMapu();a.map(function(c){function d(){h.open(b,i),!c.slika||h.ubacenaSlika||(h.setContent(h.getContent()+('<p><img src="'+c.slika+'"></p>')),h.ubacenaSlika=!0)}var e='https://www.google.com/maps/place/?q=place_id:'+c.place_id,f='https://www.google.com/maps/place/'+c.koordinate.lat+','+c.koordinate.lng,g=c.place_id?e:f,h=praviProzor(c,g),i=praviMarker(b,h,c);if(i.addListener('click',d),i.addListener('dblclick',function(){return window.open(g,'_self')}),!!c.slika){var j=document.createElement('img');j.addEventListener('click',d),slike.push(j),$('#slike').appendChild(j),j.izvor=c.slika,brojacSlika>ucitajSlika||(j.src=c.slika,brojacSlika++)}})}fetch('spomenici.json').then(function(a){return a.json()}).then(function(a){return initialize(a)}),$('#strelica-leva').on('click',function(){0<parseInt($('#slike').style.marginLeft)+pomak||($('#slike').style.marginLeft=parseInt($('#slike').style.marginLeft)+pomak+'px')}),$('#strelica-desna').on('click',function(){ucitaneSlike||slike.map(function(a){return a.src=a.izvor}),$('#slike').style.marginLeft=parseInt($('#slike').style.marginLeft)-pomak+'px',ucitaneSlike=!0});