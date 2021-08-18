<?php

$EXCHANGRATE_API_KEY = "fa179507e0064ed5bdca74d070306232";
$EXCHANGRATE_API_URL = "https://openexchangerates.org/api/latest.json?";

header('Content-Type: application/json; charset=UTF-8');
$url = $EXCHANGRATE_API_URL.'app_id='.$EXCHANGRATE_API_KEY.'&symbols='.$_REQUEST['countryCode'];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    $result=curl_exec($ch);
    curl_close($ch);
    echo $result;
?>