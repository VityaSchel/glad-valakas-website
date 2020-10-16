<?php

if($_GET['key'] != "PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR"){ die(); }
$invid = $_GET['invoiceid'];
// TODO: проверка на sql-инъекцию
$link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");
$res = mysqli_query($link, 'SELECT `ip`,`uid` FROM `orders` WHERE `invoiceid`='.$invid);
$row = mysqli_fetch_assoc($res);
$uid = $row['uid'];
$ip = $row['ip'];
mysqli_query($link, 'INSERT INTO `banned`(`uid`,`ip`) VALUES ("'.$uid.'", "'.$ip.'")');
mysqli_query($link, 'UPDATE `orders` SET `status`="userBanned" WHERE `uid`="'.$uid.'" AND `ip`="'.$ip.'"');
mysqli_close($link);

?>
