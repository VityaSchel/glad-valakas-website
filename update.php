<?php

if($_GET['key'] != "PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR"){ die('{"response":"incorrect"}'); }

$page = $_GET['page'];
if($_GET['onlyQueued']){ $bOnlyQueued = " `status`='queued'"; } else {
  $bOnlyQueued = " `status`!='paymentAwaiting' AND `status`!='bannedUser'";
  if($_GET['term']){
    // TODO: проверка на sql-инъекцию
    $bOnlyQueued .= " AND `number` LIKE '%".$_GET['term']."%'";
  }
}
if(empty($page)){
  $page=0;
}
$link = mysqli_connect("localhost", "gladvalakas", "XJP3exADbC4lwbEQ", "gladvalakas");
$ofs = 20*$page;
$sql = 'SELECT * FROM `orders` WHERE'.$bOnlyQueued.' ORDER BY `timestamp` LIMIT 21 OFFSET '.$ofs;
$res = mysqli_query($link, $sql);
$rows = array();
while($row = mysqli_fetch_assoc($res)){
  array_push($rows, $row);
}
$more = 0;
if(count($rows) > 20){
  $more = 1;
  $rows = array_pop($rows);
}

$res = mysqli_query($link, 'SELECT COUNT(`number`) AS `c` FROM `orders` WHERE `status`="queued" OR `status`="ordered"');
$new = 0;
while($row = mysqli_fetch_assoc($res)){
  $new = $row['c'];
}

mysqli_close($res);
$rr = "";
for($i = 0; $i < count($rows); $i++){
  $rr .= '{
    "id": "'.$rows[$i]['invoiceid'].'",
    "number": "'.$rows[$i]['number'].'",
    "description": "'.$rows[$i]['description'].'",
    "type": '.$rows[$i]['type'].',
    "timestamp": "'.$rows[$i]['timestamp'].'",
    "banned": "'.$rows[$i]['banned'].'",
    "status": "'.$rows[$i]['status'].'"
  }';
  if($i != count($rows)-1){ $rr .= ","; }
}
print('{"response":"success","els":['.$rr.'],"new":'.$new.',"more":'.$more.'}');
?>
