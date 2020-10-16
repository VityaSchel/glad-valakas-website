<?php

$invid = $_GET['invid'];
if($_GET['key'] == "PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR"){
  $link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");

  mysqli_query($link, 'UPDATE `orders` SET `status`="queued" WHERE `invoiceid`='.$invid);
  // TODO: проверка на sql-инъекцию

  mysqli_close($link);
}

?>
