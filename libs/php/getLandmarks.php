<?php

$_REQUEST['lat'] = '35.6895';
$_REQUEST['lng'] = '139.69171';
// $minLat = $_GET['lat'] - 10;
// $minLng = $_GET['lng'] - 10;

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$_GET['minLng'].'&lon_max='.$_GET['maxLng'].'&lat_min='.$_GET['minLat'].'&lat_max='.$_GET['maxLat'].'&apikey=5ae2e3f221c38a28845f05b67ae72f59146dd44fa9879f276057d87a&format=json',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'Accept: */*',
    'Accept-Encoding: gzip, deflate, br',
    'Accept-Language: en-US,en;q=0.9',
    'Connection: keep-alive',
    'Host: api.opentripmap.com',
    'Origin: https://opentripmap.io',
    'Referer: https://opentripmap.io/',
    'sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    'sec-ch-ua-mobile: ?0',
    'Sec-Fetch-Dest: empty',
    'Sec-Fetch-Mode: cors',
    'Sec-Fetch-Site: cross-site',
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  ),
));

$response = curl_exec($curl);

curl_close($curl);

// $someObject = json_decode($response);
// print_r(count($someObject));
echo $response; // Access Object data

?>