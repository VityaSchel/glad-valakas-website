<?php
$number = base64_decode($_GET['number']);
$re = '/^\+{0,1}(\d{1,3})\ {0,1}\({0,1}(\d{3})\){0,1}\ {0,1}(\d{3}\-(\d{2}\-\d{2}|\d{2}\d{2})|\d{3}\ (\d{2}\ \d{2}|\d{2}\d{2})|\d{7})$/m';
preg_match_all($re, $number, $matches, PREG_SET_ORDER, 0);
$m3 = str_replace(" ", "", $matches[0][3]);
$m3 = str_replace("-", "", $m3);
$n = "+".$matches[0][1]." (".$matches[0][2].") ".$m3;
if(count($matches) == 0){ die('{"response":"incorrect arguments"}'); }

$link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");

$res = mysqli_query($link, 'SELECT * FROM `orders` WHERE `number`="'.$n.'" ORDER BY `timestamp` LIMIT 20');
while($row = mysqli_fetch_assoc($res)){
  switch($row['status']){
    case "paymentAwaiting":
      $status = "Создан, ожидает оплаты";
      break;

    case "ordered":
      $status = "Оплачен, в очереди";
      break;

    case "queued":
      $status = "Ожидает звонок";
      break;

    case "done":
      $status = "Отмечен как выполненное";
      break;
  }
  $t = date("d.m.Y H:i:s", $row['timestamp']);
  print("Заказ звонка на номер ".$row['number']." от ".$t." Статус: ".$status."<br>");
}

mysqli_close($link);
?>
