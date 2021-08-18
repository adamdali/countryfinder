<?php

header('Content-Type: application/json; charset=UTF-8');
$url='https://restcountries.eu/rest/v2/alpha/'.$_REQUEST['code'];
$ch = curl_init();
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL,$url);
  $result=curl_exec($ch);
  curl_close($ch);
  echo $result;

?>