<?php
  
  session_start();

  $id_opcao = null;
  for($i = 1; $i <= 10; $i++) 
  {
    if(isset($_POST["botao_opcao_".$i]))
    {
      $id_opcao = $_POST["botao_opcao_".$i];
      break;
    }
  }

  if (isset($id_opcao))
  {
    $path = "book.php?xml_book=".$_SESSION["xml_book"]."&current_page=".$id_opcao;
    header("Location: ".$path);
    exit();
  }

if(isset($_GET['xml_book']))
  $path_xml = __DIR__ . '/./../books/'. $_GET['xml_book']; //'exemplo1.xml';
else
{
  //require(__DIR__ . '/layout/main.php');
  die;
}

if(isset($_GET['current_page']))
  $current_page = (int) $_GET['current_page'];
else
  $current_page = 0;

$_SESSION["xml_book"] = $_GET['xml_book'];
$_SESSION["current_page"] = $current_page;

$xml = simplexml_load_file($path_xml);

echo '<div id="personagem">';
echo '</div>';

echo '<div id="indicadores">';
echo "HP: " . $xml->characteristics->hp['current'] . '/' . $xml->characteristics->hp['max'] . '<br>';
echo "HT: " . $xml->characteristics->ht['current'] . '/' . $xml->characteristics->ht['max'] . '<br>';
echo '</div>';

$page = $xml->page[$current_page];

echo '<div id="numero_secao">';
echo '<h2><p align="center" style="width: 400px; margin-inline: auto;">' . $page["id"] . '</p></h2>';
echo '</div>';

echo '<div id="texto_secao">';
echo '<p align="center" style="width: 400px; margin-inline: auto;">' . $page->text . '</p>';
echo '</div>';

echo '<br>';
echo '<div id="botoes">';
echo '<p align="center" style="width: 400px; margin-inline: auto;">';

echo '<form action="book.php" method="POST">';
$id_botao = 1;
foreach ($page->option as $option) {
  echo '<button type="submit" name="botao_opcao_'.$id_botao.'" value="'.$option['id'].'">' . $option . '</button>';
  $id_botao++;
}
echo '</form>';

echo '</p></div>';


?>

<!--
/*
$chosen_option = readline('Escolha uma opção: ');
$next_page_id = (int) $page->option[$chosen_option - 1]['id'];
$page = $xml->page[$next_page_id - 1];
*/
-->

<!--

/* Por exemplo, quando o jogador escolhe uma opção que resulta em um confronto com um inimigo, 
   você pode subtrair uma certa quantidade de HP do personagem: */

if ($chosen_option == 1) {
  // O jogador escolheu "Ir para a esquerda" e encontra um inimigo.
  $enemy_damage = rand(1, 6); // Valor aleatório de 1 a 6.
  $xml->characteristics->hp['current'] -= $enemy_damage;
  echo "Você sofreu $enemy_damage pontos de dano.\n";
}

/* Da mesma forma, quando o jogador escolhe uma opção que envolve correr ou subir, 
   você pode subtrair uma certa quantidade de HT do personagem: */

if ($chosen_option == 3) {
  // O jogador escolheu "Correr" e perde HT.
  $ht_loss = rand(1, 6); // Valor aleatório de 1 a 6.
  $xml->characteristics->ht['current'] -= $ht_loss;
  echo "Você perdeu $ht_loss pontos de HT.\n";
}

/* Adicione verificações para garantir que as características de HP e HT do jogador 
   não excedam seus valores máximos ou caiam abaixo de zero: */

if ($xml->characteristics->hp['current'] < 0) {
  $xml->characteristics->hp['current'] = 0;
  echo "Você morreu.\n";
  // Encerra o jogo ou oferece uma opção para reiniciar.
}

if ($xml->characteristics->hp['current'] > $xml->characteristics->hp['max']) {
  $xml->characteristics->hp['current'] = $xml->characteristics->hp['max'];
}

if ($xml->characteristics->ht['current'] < 0) {
  $xml->characteristics->ht['current'] = 0;
}

if ($xml->characteristics->ht['current'] > $xml->characteristics->ht['max']) {
  $xml->characteristics->ht['current'] = $xml->characteristics->ht['max'];
}

-->