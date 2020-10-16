<?php

if($_GET['key'] != "PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR"){ die('{"response":"incorrect"}'); } else {
  file_put_contents("active", "1");
}

?>
