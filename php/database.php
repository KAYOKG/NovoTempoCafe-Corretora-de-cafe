<!DOCTYPE html>
<html lang="pt-BR">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Tempo Café | Contatos</title>
    <link rel="icon" href="../images/icons/iconeLogo.svg">
    <link rel="stylesheet" href="../css/database.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  </head>

  <body>
    <?php include 'header.php'; ?>
    <?php
    require_once "conexao.php";
    $pdo = mysqlConnect();

    $nome = isset($_POST['validationCustom01']) ? $_POST['validationCustom01'] : '';
    $telefone = isset($_POST['validationCustom02']) ? $_POST['validationCustom02'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $telOuEmail = isset($_POST['radio-stacked']) ? $_POST['radio-stacked'] : '';

    $nome = htmlspecialchars($nome, ENT_QUOTES, 'UTF-8');
    $telefone = htmlspecialchars($telefone, ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');

    $sqlInsertUser = "INSERT INTO contatinhos (nome, telefone, email, telOuEmail) VALUES (:nome, :telefone, :email, :telOuEmail)";
    $stmtInsertUser = $pdo->prepare($sqlInsertUser);
    $stmtInsertUser->bindParam(":nome", $nome);
    $stmtInsertUser->bindParam(":telefone", $telefone);
    $stmtInsertUser->bindParam(":email", $email);
    $stmtInsertUser->bindParam(":telOuEmail", $telOuEmail);

    $stmtInsertUser->execute();

    $sqlSelectAll = "SELECT * FROM contatinhos";
    $stmtSelectAll = $pdo->prepare($sqlSelectAll);
    $stmtSelectAll->execute();
    ?>
    <main>
      <div class="container my-2">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-custom overflow-hidden text-center bg-body-tertiary border rounded-3">
            <li class="breadcrumb-item">
              <a class="link-body-emphasis fw-semibold text-decoration-none" href="../index.html">
                <svg class="bi" width="16" height="16">
                  <use xlink:href="#house-door-fill"></use>
                </svg>
                Início
              </a>
            </li>
            <li class="breadcrumb-item">
              <a class="link-body-emphasis fw-semibold text-decoration-none" href="../html/contato.html">Contato</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              Contatos
            </li>
          </ol>
        </nav>
      </div>
      <div class="container">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Telefone</th>
              <th scope="col">Email</th>
              <th scope="col">Preferência para contato</th>
            </tr>
          </thead>
          <tbody>
            <?php while ($row = $stmtSelectAll->fetch(PDO::FETCH_ASSOC)) { ?>
              <tr>
                <td>
                  <?php echo $row['nome']; ?>
                </td>
                <td>
                  <?php echo $row['telefone']; ?>
                </td>
                <td>
                  <?php echo $row['email']; ?>
                </td>
                <td>
                  <?php echo $row['telOuEmail']; ?>
                </td>
              </tr>
            <?php } ?>
          </tbody>
        </table>
      </div>
    </main>
    <?php include 'footer.php'; ?>
  </body>

</html>