<?php

ini_set('memory_limit', '-1');

    $executionStartTime = microtime(true) / 1000;
    
    $result = file_get_contents('countries_geo.json');

    $border = json_decode($result,true);
    $countryInfo = json_decode($result,true);

    $output = [];

    foreach($countryInfo["features"] as $obj) {
        // echo $obj['properties']['ADMIN'];
        // (strtolower($obj['properties']['ADMIN']) == strtolower($country))
        array_push($output, (object)[
            'country' => $obj['properties']['ADMIN'],
            'code' => $obj['properties']['ISO_A3'],
        ]);
    }
    
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);

?>