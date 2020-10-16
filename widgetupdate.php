<?php

if($_GET['key'] != "PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR"){ die('{"response":"incorrect"}'); }

$link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");
$res = mysqli_query($link, 'SELECT `description`,`invoiceid` FROM `orders` WHERE `status`="ordered" ORDER BY `timestamp` DESC LIMIT 1');
if(mysqli_num_rows($res) > 0){
  while($row = mysqli_fetch_assoc($res)){
    $desc = $row['description'];
    $invoice = $row['invoiceid'];
    if(strlen($desc) == 0){ $desc = "Новый заказ рофл-звонка."; }
    print('{"response":"success","text":"'.$desc.'"}');
  }
  mysqli_query($link, 'UPDATE `orders` SET `status`="queued" WHERE `invoiceid`='.$invoice);
} else {
  print('{"response":"fail"}');
}
mysqli_close($link);

?>
