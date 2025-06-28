<?php
require_once(__DIR__.'/crest.php');

// Данные для создания контакта
$contactData = [
    'FIELDS' => [
        'NAME' => 'Иван',
        'LAST_NAME' => 'Петров',
        'EMAIL' => [
            [
                'VALUE' => 'mail@example.com',
                'VALUE_TYPE' => 'WORK',
            ],
        ],
        'PHONE' => [
            [
                'VALUE' => '555888',
                'VALUE_TYPE' => 'WORK',
            ],
        ],
    ],
];

// Вызов API
$result = CRest::call('crm.contact.add', $contactData);

// Устанавливаем заголовок для корректного отображения
header('Content-Type: text/html; charset=utf-8');

// Проверка и вывод результата
if (isset($result['error'])) {
    echo '<h2>Ошибка при создании контакта</h2>';
    echo '<pre>' . htmlspecialchars(print_r($result, true)) . '</pre>';
} else {
    echo '<h2>Контакт успешно создан</h2>';
    echo '<pre>' . htmlspecialchars(print_r($result, true)) . '</pre>';
    echo '<p>ID нового контакта: ' . htmlspecialchars($result['result']) . '</p>';
}
?>