<?php
	require_once(__DIR__ . '/./vendor/autoload.php');
	require(__DIR__ . '/layout/header.php'); 

  session_start();

  if(isset($_SESSION) && 
     isset($_SESSION['xml_book']))
  {
    echo '<b>Livro na memória: '.$_SESSION['xml_book'].'</b><br>';
    $path = './layout/book.php?xml_book='.$_SESSION["xml_book"].'&current_page='.$_SESSION['current_page'];
    //header("Location: ".$path);
    //exit();    
    echo '<a href="'.$path.'">Clique aqui para retomar de onde parou</a>';
  }
  else
  {
    echo '<b>Livro na memória: VAZIO</b>';

    require(__DIR__ . '/layout/main.php');
  }

 
  require(__DIR__ . '/layout/footer.php'); 
?>