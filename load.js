// For full API documentation, including code examples, visit http://wix.to/94BuAAs

import { retrieve, deleteAll, getCoords, getPhoto, calcDistance } from 'backend/backend.jsw';
import wixLocation from 'wix-location';
import wixData from 'wix-data';

$w.onReady(async () => {

	$w("#dataset1").onReady(async () => {
		await deleteAll($w);

		var searchResult = await $w("#dataset1").getCurrentItem();
		var cuisine = searchResult.title;
		var location = searchResult.location;
		var distance = searchResult.distance;
		var minPrice = searchResult.priceRange;
		var maxPrice = searchResult.maxPrice;

		var coordinates = await getCoords(location);
		var userLat = coordinates[0];
		var userLng = coordinates[1];

		var loc = await retrieve(cuisine, location, distance, minPrice, maxPrice, coordinates[0], coordinates[1]);
		console.log(loc);

		for (var i = 0; i < 20 && i < loc.results.length; i++) {
			var placeLat = loc.results[i].geometry.location.lat;
			var placeLng = loc.results[i].geometry.location.lng;
			var dist = await calcDistance(userLat, userLng, placeLat, placeLng, "K");
			dist = Math.round(dist * 10) / 10;
			var photo = ""
			var photoRef = ""
			if (loc.results[i].photos) {
				photoRef = loc.results[i].photos[0].photo_reference;
				photo = await getPhoto(photoRef);
			}

			let toInsert = {
				"title": loc.results[i].name,
				"address": loc.results[i].formatted_address,
				"price": loc.results[i].price_level,
				"rating": loc.results[i].rating,
				"distance": dist,
				"photoReference": photoRef,
				"photo": photo
			}

			await wixData.insert("Results", toInsert)
				.then((results) => {
					let item = results;
				})
				.catch((err) => {
					let errorMsg = err;
				})
		}

		setTimeout(() => {
			wixLocation.to("/search-results");
		}, 1000);
		console.log("test");

	});
});