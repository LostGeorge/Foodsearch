import {getJSON} from 'wix-fetch';
import {wixData} from 'wix-data';

var apiKey = "";

function getSearch($w) {
    $w.onReady( () => {
        $w("#search").onReady( () => {
            let result = $w("#search").getCurrentItem();
            let cuisine = result.Cuisine;
            let address = result.Location;
            let searchQuery = cuisine + " food near " + address;
            
            getJSON("https://maps.googleapis.com/maps/api/place/textsearch/json?" + searchQuery + "&" + apiKey)
        } );
      
      } );
      
}