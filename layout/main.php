<h1>Selecione um livro antes de começar:</h1>

<?php
    $path = __DIR__ . '/../books/shelf.json';

    $books = json_decode(file_get_contents($path));

    echo '<form action="initbook.php" method="POST">';
    echo '<select name="livros" id="livros">';
    foreach ($books as $book) {
        echo '<option value="' . $book->id . '">' . $book->title . '</option>';
    }
    echo '</select>';
    echo '<button type="submit">OK</button>';
    echo '</form>';
?>