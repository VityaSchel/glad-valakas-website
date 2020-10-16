<?php
if($_GET['key'] != "PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR"){ die(); }
$number = base64_decode($_GET['number']);
// TODO: проверка на sql-инъекцию
$re = '/^\+{0,1}(\d{1,3})\ {0,1}\({0,1}(\d{3})\){0,1}\ {0,1}(\d{3}\-(\d{2}\-\d{2}|\d{2}\d{2})|\d{3}\ (\d{2}\ \d{2}|\d{2}\d{2})|\d{7})$/m';
preg_match_all($re, $number, $matches, PREG_SET_ORDER, 0);
$m3 = str_replace(" ", "", $matches[0][3]);
$m3 = str_replace("-", "", $m3);
$n = "+".$matches[0][1]." (".$matches[0][2].") ".$m3;
if(count($matches) == 0){ die('{"response":"incorrect arguments"}'); }

$link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");
mysqli_query($link, 'UPDATE `orders` SET `banned`=1,`status`="done" WHERE `number`="'.$n.'"');
mysqli_query($link, 'INSERT INTO `bannedNumbers`(`number`,`timestamp`) VALUES("'.$n.'", '.time().')');
mysqli_close($link);

?>
