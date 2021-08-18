<?php

ini_set('memory_limit', '-1');

    $executionStartTime = microtime(true) / 1000;
    
    $result = file_get_contents('countries_geo.json');
    $country = trim($_REQUEST["country"]);

    $border = json_decode($result,true);
    $countryInfo = json_decode($result,true);

    $output = [];
    $output["data"] = [];

    foreach($countryInfo["features"] as $obj) {
        if(strtolower($obj['properties']['ADMIN']) == strtolower($country)){
            $output['data']['countryInfo'] = $obj;
            break;
        }
    }
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>