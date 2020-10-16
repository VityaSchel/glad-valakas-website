<?php

$key = explode("?key=",$_SERVER['REQUEST_URI']);
if(count($key) == 2){$key = $key[1];} else { die(); }
if($key != "PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR"){ die(); }
print('<!DOCTYPE html>
<html lang="ru" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Виджет</title>
    <link rel="stylesheet" href="/stylesheets/widget.css?v='.time().'">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div class="d" align="center" id="alert">
      <img src="/img/widget.gif" width="250" />
      <div class="heading">Рофл звоночек</div>
      <p class="text-donate" id="txt">Текст рофлового звоночка</p>
    </div>
    <audio id="audioPlayer"></audio>
    <button id="btn">ЗАГРУЗКА</button>
    <script src="/js/widget.js?v='.time().'"></script>
    <script src="/js/base64.js?v='.time().'"></script>
  </body>
</html>');
// .../widget.html?key=PnbDyHVuICcVeGh30uFKrWEK7zOIF2W7rqoPYcjoFADFi2sqKarvxIjnVp3hHfAWTYpBMBqfHoFfWXOurMiTre0xVc0JrE87ieDR&cacheclear={unix_timestamp или что-либо еще}

?>
