<?php

// этот скрипт вызывается робокассой после платежа
$sum = $_POST['OutSum'];
$invid = $_POST['InvId'];
$sum = $sum-$_POST['Fee'];
$hash = strtoupper(hash("sha512", $sum.":".$invid.":{пароль робокассы}"));
if($sum != "350" && $sum != "1000" && $sum != "1500"){ die(); }
if($_POST['SignatureValue'] == $hash){
  $link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");

  if (!$link) {
    http_response_code(500);
    die();
  }

  mysqli_query($link, 'UPDATE `orders` SET `status`="ordered",`ROBOKASSAID`=0 WHERE `ROBOKASSAID`='.$invid);

  mysqli_close($link);
}
?>
