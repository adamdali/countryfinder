<?php

$OPENCAGE_API_KEY = "c8f446f08a964347ac10e4f97ee5392e";
$OPENCAGE_API_URL = "https://api.opencagedata.com/geocode/v1/geojson";

header('Content-Type: application/json; charset=UTF-8');
$url = $OPENCAGE_API_URL."?q=".$_REQUEST['lat']."+".$_REQUEST['lng']."&key=".$OPENCAGE_API_KEY;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    $result=curl_exec($ch);
    curl_close($ch);
    echo $result;
?>