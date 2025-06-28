<?php
// Включение отображения всех ошибок для удобства отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$apiUrl = 'http://localhost:8080/api/'; // Базовый URL вашего API
$response = '';
$statusCode = '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$endpoint = $_GET['endpoint'] ?? 'users';
$requestData = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $method = isset($_POST['method']) ? $_POST['method'] : 'GET';
    $endpoint = isset($_POST['endpoint']) ? $_POST['endpoint'] : 'users';
    $id = isset($_POST['id']) ? $_POST['id'] : '';

    $fullUrl = $apiUrl . $endpoint;
    if (!empty($id)) {
        $fullUrl .= '/' . $id;
    }

    $jsonData = isset($_POST['body']) ? $_POST['body'] : '';
    $jsonData = trim($jsonData);

    if (empty($jsonData)) {
        if (isset($sampleData[$endpoint])) {
            $jsonData = json_encode($sampleData[$endpoint]);
        }
    }

    if (!empty($jsonData)) {
        $jsonData = str_replace(["\r", "\n", "    "], "", $jsonData);
        json_decode($jsonData);
        if (json_last_error() !== JSON_ERROR_NONE) {
            die('Invalid JSON format');
        }
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fullUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

    if (!empty($jsonData)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        $headers = [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        $response = json_encode(['error' => curl_error($ch)]);
    }

    curl_close($ch);
}

// Примеры тестовых данных для разных эндпоинтов
$sampleData = [
    'users' => [
        'full_name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'password' => 'securepassword123'
    ],
    'developers' => [
        'user_id' => '550e8400-e29b-41d4-a716-446655440000',
        'inn' => '1234567890',
        'name' => 'Example Developer',
        'website' => 'https://example.com'
    ],
    'apartments' => [
        'developer_id' => '550e8400-e29b-41d4-a716-446655440000',
        'description' => 'Beautiful apartment in city center',
        'address' => '123 Main St, City',
        'size' => 85.5,
        'region' => 'Moscow'
    ],
    'bookings' => [
        'apartment_id' => '550e8400-e29b-41d4-a716-446655440000',
        'user_id' => '550e8400-e29b-41d4-a716-446655440000'
    ],
    'favorites' => [
        'apartment_id' => '550e8400-e29b-41d4-a716-446655440000',
        'user_id' => '550e8400-e29b-41d4-a716-446655440000'
    ],
    'media' => [
        'apartment_id' => '550e8400-e29b-41d4-a716-446655440000',
        'description' => 'Living room photo'
    ]
];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real Estate 4.0 API Tester</title>
    <style>
        :root {
            --primary: #3498db;
            --success: #2ecc71;
            --danger: #e74c3c;
            --dark: #2c3e50;
            --light: #ecf0f1;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            background-color: var(--dark);
            color: white;
            padding: 1.5rem;
            border-radius: 8px 8px 0 0;
            margin-bottom: 20px;
        }

        h1 {
            margin-bottom: 0.5rem;
        }

        .subtitle {
            opacity: 0.8;
        }

        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            overflow: hidden;
        }

        .card-header {
            background-color: var(--light);
            padding: 15px 20px;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }

        .card-body {
            padding: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }

        select,
        input,
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: inherit;
        }

        .btn-group {
            display: flex;
            gap: 10px;
        }

        .btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .btn-primary {
            background-color: var(--primary);
        }

        .btn-success {
            background-color: var(--success);
        }

        .btn-danger {
            background-color: var(--danger);
        }

        .btn:hover {
            opacity: 0.9;
        }

        .response-container {
            margin-top: 20px;
        }

        .response-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .status-code {
            padding: 5px 10px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
        }

        .status-200 {
            background-color: var(--success);
        }

        .status-201 {
            background-color: var(--success);
        }

        .status-400 {
            background-color: #f39c12;
        }

        .status-404 {
            background-color: var(--danger);
        }

        .status-500 {
            background-color: var(--danger);
        }

        pre {
            background-color: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            max-height: 400px;
        }

        .endpoints {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .endpoint-card {
            background: white;
            border-left: 4px solid var(--primary);
            padding: 15px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .endpoint-card h3 {
            margin-bottom: 10px;
            color: var(--dark);
        }

        .endpoint-card ul {
            padding-left: 20px;
        }

        .endpoint-card li {
            margin-bottom: 5px;
        }
    </style>
</head>

<body>
    <div class="container">
        <header>
            <h1>Real Estate 4.0 API Tester</h1>
            <p class="subtitle">Тестирование бэкенд-сервиса платформы недвижимости</p>
        </header>

        <div class="card">
            <div class="card-header">Отправить запрос</div>
            <div class="card-body">
                <form method="POST">
                    <div class="form-group">
                        <label for="endpoint">API Endpoint</label>
                        <select id="endpoint" name="endpoint">
                            <option value="users" <?= $endpoint === 'users' ? 'selected' : '' ?>>/users</option>
                            <option value="developers" <?= $endpoint === 'developers' ? 'selected' : '' ?>>/developers
                            </option>
                            <option value="apartments" <?= $endpoint === 'apartments' ? 'selected' : '' ?>>/apartments
                            </option>
                            <option value="bookings" <?= $endpoint === 'bookings' ? 'selected' : '' ?>>/bookings</option>
                            <option value="favorites" <?= $endpoint === 'favorites' ? 'selected' : '' ?>>/favorites
                            </option>
                            <option value="media" <?= $endpoint === 'media' ? 'selected' : '' ?>>/media</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="method">HTTP Method</label>
                        <select id="method" name="method">
                            <option value="GET" <?= $method === 'GET' ? 'selected' : '' ?>>GET</option>
                            <option value="POST" <?= $method === 'POST' ? 'selected' : '' ?>>POST</option>
                            <option value="PUT" <?= $method === 'PUT' ? 'selected' : '' ?>>PUT</option>
                            <option value="DELETE" <?= $method === 'DELETE' ? 'selected' : '' ?>>DELETE</option>
                        </select>
                    </div>

                    <div class="form-group" id="idField"
                        style="display: <?= ($method === 'PUT' || $method === 'DELETE') ? 'block' : 'none' ?>">
                        <label for="id">ID (для PUT/DELETE)</label>
                        <input type="text" id="id" name="id" placeholder="Введите UUID">
                    </div>

                    <div class="form-group" id="bodyField"
                        style="display: <?= ($method === 'POST' || $method === 'PUT') ? 'block' : 'none' ?>">
                        <label for="body">Тело запроса (JSON)</label>
                        <textarea id="body" name="body" rows="6" placeholder="Введите данные в формате JSON"><?php
                        if (isset($endpoint) && array_key_exists($endpoint, $sampleData)) {
                            echo json_encode($sampleData[$endpoint], JSON_PRETTY_PRINT);
                        }
                        ?></textarea>
                    </div>

                    <div class="btn-group">
                        <button type="submit" class="btn btn-primary">Отправить запрос</button>
                        <button type="button" class="btn btn-success" onclick="fillSampleData()">Заполнить
                            пример</button>
                        <button type="reset" class="btn btn-danger">Очистить</button>
                    </div>
                </form>

                <?php if (!empty($response)): ?>
                    <div class="response-container">
                        <div class="response-header">
                            <h3>Ответ сервера:</h3>
                            <div class="status-code status-<?= substr($statusCode, 0, 1) ?>00">Status: <?= $statusCode ?>
                            </div>
                        </div>
                        <pre><?= htmlspecialchars(json_encode(json_decode($response), JSON_PRETTY_PRINT)) ?></pre>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <div class="card">
            <div class="card-header">Доступные эндпоинты API</div>
            <div class="card-body">
                <div class="endpoints">
                    <div class="endpoint-card">
                        <h3>Пользователи (/api/users)</h3>
                        <ul>
                            <li>GET / - список пользователей</li>
                            <li>POST / - создать пользователя</li>
                            <li>GET /:id - получить пользователя</li>
                            <li>PUT /:id - обновить пользователя</li>
                            <li>DELETE /:id - удалить пользователя</li>
                        </ul>
                    </div>

                    <div class="endpoint-card">
                        <h3>Застройщики (/api/developers)</h3>
                        <ul>
                            <li>GET / - список застройщиков</li>
                            <li>POST / - создать застройщика</li>
                            <li>GET /:id - получить застройщика</li>
                            <li>PUT /:id - обновить застройщика</li>
                            <li>DELETE /:id - удалить застройщика</li>
                        </ul>
                    </div>

                    <div class="endpoint-card">
                        <h3>Квартиры (/api/apartments)</h3>
                        <ul>
                            <li>GET / - список квартир</li>
                            <li>POST / - создать квартиру</li>
                            <li>GET /region/:region - квартиры по региону</li>
                            <li>GET /:id - получить квартиру</li>
                            <li>PUT /:id - обновить квартиру</li>
                            <li>DELETE /:id - удалить квартиру</li>
                        </ul>
                    </div>

                    <div class="endpoint-card">
                        <h3>Бронирования (/api/bookings)</h3>
                        <ul>
                            <li>GET / - список бронирований</li>
                            <li>POST / - создать бронирование</li>
                            <li>GET /user/:userId - бронирования пользователя</li>
                            <li>PATCH /:id/status - обновить статус</li>
                            <li>DELETE /:id - удалить бронирование</li>
                        </ul>
                    </div>

                    <div class="endpoint-card">
                        <h3>Избранное (/api/favorites)</h3>
                        <ul>
                            <li>POST / - добавить в избранное</li>
                            <li>GET /user/:userId - избранное пользователя</li>
                            <li>DELETE / - удалить из избранного</li>
                        </ul>
                    </div>

                    <div class="endpoint-card">
                        <h3>Медиа (/api/media)</h3>
                        <ul>
                            <li>POST / - добавить медиа</li>
                            <li>GET /apartment/:apartmentId - медиа квартиры</li>
                            <li>DELETE /:id - удалить медиа</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Переключение видимости полей в зависимости от метода
        document.getElementById('method').addEventListener('change', function () {
            const method = this.value;
            const idField = document.getElementById('idField');
            const bodyField = document.getElementById('bodyField');

            idField.style.display = (method === 'PUT' || method === 'DELETE') ? 'block' : 'none';
            bodyField.style.display = (method === 'POST' || method === 'PUT') ? 'block' : 'none';
        });

        // Автозаполнение примером данных
        function fillSampleData() {
            const endpoint = document.getElementById('endpoint').value;
            const sampleData = <?= json_encode($sampleData) ?>;

            if (sampleData[endpoint]) {
                document.getElementById('body').value = JSON.stringify(sampleData[endpoint], null, 2);
            }
        }
    </script>
</body>

</html>