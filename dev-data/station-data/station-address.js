
var addressToAddressObject = function (address) {
    var split = address.split(",");
    split[2] = split[2].trim();
    split[2] = split[2].split("");
    return {address: split[0], city: split[1], state: split[2][0], zip: split[2][1]};
};
var addressObjectToString = function(addressObj){
    return addressObj.address + ", " + addressObj.city + ", " + addressObj.state + " " + addressObj.zip
};
var addresses = {
    "1": {
        "address": "2230 Pasadena Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90031
    },
    "2": {
        "address": "1962 East Cesar E Chavez Avenue",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90033
    },
    "3": {
        "address": "108 N Fremont Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90012
    },
    "4": {
        "address": "450 E Temple St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90012
    },
    "5": {
        "address": "8900 Emerson Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90045
    },
    "6": {
        "address": "326 N Virgil Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90004
    },
    "7": {
        "address": "14630 Plummer St",
        "city": "Panorama City",
        "state": "CA",
        "zip": 91402
    },
    "8": {
        "address": "11351 Tampa Ave",
        "city": "Porter Ranch",
        "state": "CA",
        "zip": 91326
    },
    "9": {
        "address": "430 E 7th St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90014
    },
    "10": {
        "address": "1335 S Olive St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90015
    },
    "11": {
        "address": "1819 W 7th St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90057
    },
    "12": {
        "address": "5921 N Figueroa St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90042
    },
    "13": {
        "address": "2401 W Pico Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90006
    },
    "14": {
        "address": "3401 S Central Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90011
    },
    "15": {
        "address": "915 W Jefferson Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90007
    },
    "16": {
        "address": "2011 N Eastern Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90032
    },
    "17": {
        "address": "1601 S Santa Fe Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90021
    },
    "18": {
        "address": "12050 Balboa Blvd",
        "city": "Granada Hills",
        "state": "CA",
        "zip": 91344
    },
    "19": {
        "address": "12229 Sunset Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90049
    },
    "20": {
        "address": "2144 Sunset Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90026
    },
    "21": {
        "address": "1192 E 51st St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90011
    },
    "23": {
        "address": "17281 Sunset Blvd",
        "city": "Pacific Palisades",
        "state": "CA",
        "zip": 90272
    },
    "24": {
        "address": "9411 Wentworth St",
        "city": "Sunland-Tujunga",
        "state": "CA",
        "zip": 91040
    },
    "25": {
        "address": "2927 Whittier Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90023
    },
    "26": {
        "address": "2009 S Western Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90018
    },
    "27": {
        "address": "1327 Cole Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90028
    },
    "28": {
        "address": "11641 Corbin Ave",
        "city": "Porter Ranch",
        "state": "CA",
        "zip": 91326
    },
    "29": {
        "address": "4029 Wilshire Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90010
    },
    "33": {
        "address": "6406 S Main St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90003
    },
    "34": {
        "address": "3661 7th Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90018
    },
    "35": {
        "address": "1601 Hillhurst Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90027
    },
    "36": {
        "address": "1005 N Gaffey St",
        "city": "San Pedro",
        "state": "CA",
        "zip": 90731
    },
    "37": {
        "address": "1090 Veteran Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90024
    },
    "38": {
        "address": "124 E I St",
        "city": "Wilmington",
        "state": "CA",
        "zip": 90744
    },
    "39": {
        "address": "14415 Sylvan St",
        "city": "Van Nuys",
        "state": "CA",
        "zip": 91401
    },
    "40": {
        "address": "330 Ferry St",
        "city": "San Pedro",
        "state": "CA",
        "zip": 90731
    },
    "41": {
        "address": "1439 N Gardner St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90046
    },
    "42": {
        "address": "2021 Colorado Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90041
    },
    "43": {
        "address": "3690 Motor Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90034
    },
    "44": {
        "address": "1410 Cypress Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90065
    },
    "46": {
        "address": "4370 S Hoover St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90037
    },
    "47": {
        "address": "4575 Huntington Dr S",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90032
    },
    "48": {
        "address": "1601 S Grand Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90015
    },
    "49": {
        "address": "194 Berth",
        "city": "Wilmington",
        "state": "CA",
        "zip": 90744
    },
    "50": {
        "address": "3036 Fletcher Dr",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90065
    },
    "51": {
        "address": "10435 Sepulveda Blvd",
        "city": "Mission Hills",
        "state": "CA",
        "zip": 91345
    },
    "52": {
        "address": "4957 Melrose Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90029
    },
    "55": {
        "address": "4455 York Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90041
    },
    "56": {
        "address": "2759 Rowena Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90039
    },
    "57": {
        "address": "7800 S Vermont Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90044
    },
    "58": {
        "address": "1556 S Robertson Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90035
    },
    "59": {
        "address": "11505 W Olympic Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90064
    },
    "60": {
        "address": "5320 Tujunga Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 91601
    },
    "61": {
        "address": "5821 W 3rd St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90036
    },
    "62": {
        "address": "11970 Venice Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90066
    },
    "63": {
        "address": "1930 Shell Ave",
        "city": "Venice",
        "state": "CA",
        "zip": 90291
    },
    "64": {
        "address": "10811 S Main St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90061
    },
    "65": {
        "address": "1801 E Century Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90002
    },
    "66": {
        "address": "1909 W Slauson Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90047
    },
    "67": {
        "address": "5451 Playa Vista Dr",
        "city": "Playa Vista",
        "state": "CA",
        "zip": 90094
    },
    "68": {
        "address": "5023 Washington Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90016
    },
    "69": {
        "address": "15045 Sunset Blvd",
        "city": "Pacific Palisades",
        "state": "CA",
        "zip": 90272
    },
    "70": {
        "address": "9861 Reseda Blvd",
        "city": "Northridge",
        "state": "CA",
        "zip": 91324
    },
    "71": {
        "address": "107 S Beverly Glen Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90024
    },
    "72": {
        "address": "6811 De Soto Ave",
        "city": "Canoga Park",
        "state": "CA",
        "zip": 91303
    },
    "73": {
        "address": "7419 Reseda Blvd",
        "city": "Reseda",
        "state": "CA",
        "zip": 91335
    },
    "74": {
        "address": "7777 Foothill Blvd",
        "city": "Tujunga",
        "state": "CA",
        "zip": 91042
    },
    "75": {
        "address": "15345 San Fernando Mission Blvd",
        "city": "Mission Hills",
        "state": "CA",
        "zip": 91345
    },
    "76": {
        "address": "3111 N Cahuenga Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90068
    },
    "77": {
        "address": "9224 Sunland Blvd",
        "city": "Sun Valley",
        "state": "CA",
        "zip": 91352
    },
    "78": {
        "address": "4041 Whitsett Ave",
        "city": "Studio City",
        "state": "CA",
        "zip": 91604
    },
    "79": {
        "address": "18030 S Vermont Ave",
        "city": "Gardena",
        "state": "CA",
        "zip": 90248
    },
    "80": {
        "address": "7250 World Way",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90045
    },
    "81": {
        "address": "14355 Arminta St",
        "city": "Van Nuys",
        "state": "CA",
        "zip": 91402
    },
    "82": {
        "address": "5769 Hollywood Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90028
    },
    "83": {
        "address": "4960 Balboa Blvd",
        "city": "Encino",
        "state": "CA",
        "zip": 91316
    },
    "84": {
        "address": "21050 Burbank Blvd",
        "city": "Woodland Hills",
        "state": "CA",
        "zip": 91367
    },
    "85": {
        "address": "1331 W 253rd St",
        "city": "Harbor City",
        "state": "CA",
        "zip": 90710
    },
    "86": {
        "address": "4305 Vineland Ave",
        "city": "Studio City",
        "state": "CA",
        "zip": 91602
    },
    "87": {
        "address": "10124 Balboa Blvd",
        "city": "Granada Hills",
        "state": "CA",
        "zip": 91344
    },
    "88": {
        "address": "5101 N Sepulveda Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90049
    },
    "89": {
        "address": "7063 Laurel Canyon Blvd",
        "city": "North Hollywood",
        "state": "CA",
        "zip": 91605
    },
    "90": {
        "address": "7921 Woodley Ave",
        "city": "Van Nuys",
        "state": "CA",
        "zip": 91406
    },
    "91": {
        "address": "14430 Polk St",
        "city": "Sylmar",
        "state": "CA",
        "zip": 91342
    },
    "92": {
        "address": "10556 W Pico Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90064
    },
    "93": {
        "address": "19059 Ventura Blvd",
        "city": "Tarzana",
        "state": "CA",
        "zip": 91356
    },
    "94": {
        "address": "4470 Coliseum St",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90016
    },
    "95": {
        "address": "10010 International Rd",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90045
    },
    "96": {
        "address": "21800 Marilla St",
        "city": "Chatsworth",
        "state": "CA",
        "zip": 91311
    },
    "97": {
        "address": "8021 Mulholland Dr",
        "city": "Studio City",
        "state": "CA",
        "zip": 91604
    },
    "98": {
        "address": "13035 Van Nuys Blvd",
        "city": "Pacoima",
        "state": "CA",
        "zip": 91331
    },
    "99": {
        "address": "14145 Mulholland Dr",
        "city": "Sherman Oaks",
        "state": "CA",
        "zip": 91423
    },
    "100": {
        "address": "6751 Louise Ave",
        "city": "Van Nuys",
        "state": "CA",
        "zip": 91406
    },
    "101": {
        "address": "1414 W 25th St",
        "city": "San Pedro",
        "state": "CA",
        "zip": 90732
    },
    "102": {
        "address": "13200 Burbank Blvd",
        "city": "Sherman Oaks",
        "state": "CA",
        "zip": 91401
    },
    "103": {
        "address": "18143 Parthenia St",
        "city": "Northridge",
        "state": "CA",
        "zip": 91325
    },
    "104": {
        "address": "8349 Winnetka Ave",
        "city": "Winnetka",
        "state": "CA",
        "zip": 91306
    },
    "105": {
        "address": "6345 Fallbrook Ave",
        "city": "Woodland Hills",
        "state": "CA",
        "zip": 91367
    },
    "106": {
        "address": "23004 Roscoe Blvd",
        "city": "West Hills",
        "state": "CA",
        "zip": 91304
    },
    "107": {
        "address": "20225 Devonshire St",
        "city": "Chatsworth",
        "state": "CA",
        "zip": 91311
    },
    "108": {
        "address": "12520 Mulholland Dr",
        "city": "Beverly Hills",
        "state": "CA",
        "zip": 90210
    },
    "109": {
        "address": "16500 Mulholland Dr",
        "city": "Los Angeles",
        "state": "CA",
        "zip": 90049
    },
    "110": {
        "address": "44 Berth",
        "city": "Wilmington",
        "state": "CA",
        "zip": 90744
    },
    "111": {
        "address": "260 Berth",
        "city": "Wilmington",
        "state": "CA",
        "zip": 90744
    },
    "112": {
        "address": "86 Berth",
        "city": "Wilmington",
        "state": "CA",
        "zip": 90744
    },
    "114": {
        "address": "16617 Arminta St",
        "city": "Van Nuys",
        "state": "CA",
        "zip": 91406
    }
};
module.exports = {
    // addressToAddressObject:addressToAddressObject,
    addressObjectToString: addressObjectToString,
    addressLookupByStationId: addresses
}

