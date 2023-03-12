<?php

    if (isset($_POST["livros"]))
    {
        $_SESSION['xml_book'] = $_POST["livros"] . '.xml';
        $_SESSION['current_page'] = 0;
    }

    echo "Carregando o livro...";

    echo '<a href="./layout/book.php?xml_book='.$_SESSION['xml_book'].'&current_page='.$_SESSION['current_page'].'">';
    echo 'Clique aqui para prosseguir</a>';
    //header('Location: index.php');
    //exit();
?>