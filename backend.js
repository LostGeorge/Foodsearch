// Filename: backend/backend.jsw (web modules need to have a .jsw extension)

//Use the following code in one of your site's front-end files

import { getJSON, fetch } from 'wix-fetch';
import wixData from 'wix-data';

const apiKey = "AIzaSyCY2qQrQGtHoB2sfHIDfvRVqi-Wdcan3iY";
const mapQuestKey = "qKV6EZXdpNRj3S9JgK0Rpr37nzqtWKqI";

export async function getCoords(location) {
	let coordinateQuery = await getJSON("http://open.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + location);
	var latitude = (coordinateQuery.results[0].locations[0].displayLatLng.lat);
	var longitude = (coordinateQuery.results[0].locations[0].displayLatLng.lng);
	return [latitude, longitude];
}

export async function retrieve(cuisine, location, distance, minPrice, maxPrice, lat, lng) {

	let searchQuery = cuisine + "+food+near+" + location;
	if (minPrice === 0 && maxPrice === 4) {
		return getJSON("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + searchQuery + "&location=" + lat + "," + lng + "&radius=" + distance + "&key=" + apiKey)
			.then(json => json)
			.catch(err => console.log(err))
	}
	return getJSON("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + searchQuery + "&location=" + lat + "," + lng + "&radius=" + distance + "&minprice=" + minPrice + "&maxprice=" + maxPrice + "&key=" + apiKey)
		.then(json => json)
		.catch(err => console.log(err))

}

export async function getPhoto(photoRef) {
    return fetch("https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=" + photoRef + "&key="+apiKey);
}

export function calcDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 === lat2) && (lon1 === lon2)) {
		return 0;
	}
	var radlat1 = Math.PI * lat1 / 180;
	var radlat2 = Math.PI * lat2 / 180;
	var theta = lon1 - lon2;
	var radtheta = Math.PI * theta / 180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit === "K") { dist = dist * 1.609344 }
	if (unit === "N") { dist = dist * 0.8684 }
	return dist;
}

export function deleteAll($w) {
	wixData.query("Results")
		.limit(1000)
		.find()
		.then((result) => {
			for (var i = 0; i < result.items.length; i++) {
				if (result.items[i] === null) continue;
				wixData.remove("Results", result.items[i]._id);
			}
		})
}