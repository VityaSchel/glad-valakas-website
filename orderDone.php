<?php

$invid = $_GET['invid'];
$state = $_GET['state'];
if($_GET['key'] == "PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR"){
  $link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");
  if($state == "ready"){
    $s = "done";
  } else {
    $s = "queued";
  }
  // TODO: проверка на sql-инъекцию
  mysqli_query($link, 'UPDATE `orders` SET `status`="'.$s.'" WHERE `invoiceid`='.$invid);
  mysqli_close($link);
}

?>
