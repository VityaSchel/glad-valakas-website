<?php

include "./nanoid/Client.php";
include "./nanoid/Core.php";

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

$number = $_POST['number'];
$type = $_POST['type'];
$info = $_POST['info'];

$re = '/^\+{0,1}(\d{1,3})\ {0,1}\({0,1}(\d{3})\){0,1}\ {0,1}(\d{3}\-(\d{2}\-\d{2}|\d{2}\d{2})|\d{3}\ (\d{2}\ \d{2}|\d{2}\d{2})|\d{7})$/m';
preg_match_all($re, $number, $matches, PREG_SET_ORDER, 0);
if(count($matches) == 0){ die('{"response":"incorrect arguments"}'); }
$m3 = str_replace(" ", "", $matches[0][3]);
$m3 = str_replace("-", "", $m3);
$n = "+".$matches[0][1]." (".$matches[0][2].") ".$m3;

$re = '/^\d{1}$/m';
preg_match_all($re, $type, $matches, PREG_SET_ORDER, 0);
if(count($matches) == 0){ die('{"response":"incorrect arguments"}'); }
switch(strval($type)){
  case "1":
    $sum = 350;
    break;

  case "2":
    $sum = 1000;
    break;

  case "3":
    $sum = 1500;
    break;
}

$re = '/^.{0,255}$/m';
preg_match_all($re, $info, $matches, PREG_SET_ORDER, 0);
if(count($matches) == 0){ die('{"response":"incorrect arguments"}'); }
$info = str_replace("+8","+7",$info);
$info = str_replace("'","&#39;",$info);
$info = str_replace('"',"&#34;",$info);

// TODO: заменить regex выражением и функцией preg_replace
$info = str_replace('нигер',"асу",$info);
$info = str_replace('нигир',"асу",$info);
$info = str_replace('нигга',"асу",$info);
$info = str_replace('нига',"асу",$info);
$info = str_replace('nigger',"асу",$info);
$info = str_replace('niger',"асу",$info);
$info = str_replace('nigga',"асу",$info);
$info = str_replace('niga',"асу",$info);
$info = str_replace('чеченцы',"асу",$info);
$info = str_replace('чеченец',"асу",$info);
$info = str_replace('чеченца',"асу",$info);
$info = str_replace('чеченцов',"асу",$info);
$info = str_replace('чеченцу',"асу",$info);


$ip = $_SERVER['REMOTE_ADDR'];
$re = '/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/m';
preg_match_all($re, $ip, $matches, PREG_SET_ORDER, 0);
if(count($matches) == 0){ die('{"response":"incorrect arguments"}'); }
$uid = $_COOKIE['_user_id'];
$re = '/^.{36}$/m';
preg_match_all($re, $uid, $matches, PREG_SET_ORDER, 0);
if(count($matches) == 0){ die('{"response":"incorrect arguments"}'); }

$link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");

if (!$link) {
  http_response_code(500);
  die();
}

$res = mysqli_query($link, 'SELECT `uid` FROM `banned` WHERE `ip`="'.$ip.'"');
if(mysqli_num_rows($res) > 0){
  $rows = array();
  while($row = mysqli_fetch_assoc($res)){
    array_push($rows, $row['uid']);
  }
  if(array_search($uid, $rows) === false){
    mysqli_query($link, 'INSERT INTO `banned`(`ip`, `uid`) VALUES ("'.$ip.'","'.$uid.'")');
  }
  die('{"response":"ban"}');
}
$res = mysqli_query($link, 'SELECT `ip` FROM `banned` WHERE `uid`="'.$uid.'"');
if(mysqli_num_rows($res) > 0){
  $rows = array();
  while($row = mysqli_fetch_assoc($res)){
    array_push($rows, $row['id']);
  }
  if(array_search($uid, $rows) === false){
    mysqli_query($link, 'INSERT INTO `banned`(`ip`, `uid`) VALUES ("'.$ip.'","'.$uid.'")');
  }
  die('{"response":"ban"}');
}
if($_GET['ignoreOld'] != "1"){
  $res = mysqli_query($link, 'SELECT `type` FROM `orders` WHERE `number`="'.$n.'" LIMIT 20');
  if(mysqli_num_rows($res) > 0){
    die('{"response":"duplicate"}');
  }
}

//все проверки прошли, запускаем процесс оплаты

$client = new Client();
$invoiceid = $client->generateId($size = 19);
$robokassaid = $client->generateId($size = 9);

$res = mysqli_query($link, 'SELECT `timestamp` FROM `bannedNumbers` WHERE `number`="'.$n.'"');
if(mysqli_num_rows($res) > 0){
  $ban = 1;
} else {
  $ban = 0;
}

mysqli_query($link, 'INSERT INTO `orders`(`invoiceid`, `ROBOKASSAID`, `number`, `banned`, `description`, `type`, `timestamp`, `uid`, `ip`, `status`) VALUES ('.$invoiceid.', '.$robokassaid.', "'.$n.'", '.$ban.', "'.$info.'", '.$type.', '.time().', "'.$uid.'", "'.$ip.'", "paymentAwaiting")');

if(mysqli_affected_rows($link) <= 0){
  http_response_code(500);
  die('{"response":"500"}');
} else {
  $hash = hash("sha512", "roflcallsfromvalery:".$sum.":".$robokassaid.":{пароль робокассы}");
  print('{"response":"success","invoiceID":"'.$robokassaid.'","hash":"'.$hash.'"}');
}

mysqli_close($link);

?>
