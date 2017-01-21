<?php

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'attendance-backend',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'DvaDS39a171gkXFwR42F5Rn3N3XTyQzN',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => false,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'enableStrictParsing' => true,
            'rules' => [
                'ping'  =>  'site/ping',
                [
                    'class'         => 'yii\rest\UrlRule',
                    'controller'    => 'v1/user',
                    'pluralize'     => false,
                    'tokens' => [
                    ],
                    'extraPatterns' => [
                        'POST login'        =>  'login',
                        'OPTIONS login'     =>  'options',
                    ]
                ],
                [
                    'class'         => 'yii\rest\UrlRule',
                    'controller'    => 'v1/setting',
                    'pluralize'     => false,
                    'tokens'        => [
                        '{id}'             => '<id:\d+>',
                    ],
                    'extraPatterns' => [
                        'GET public'       =>  'public',
                        'OPTIONS public'    =>  'options',
                    ]
                ],
                [
                    'class'         => 'yii\rest\UrlRule',
                    'controller'    => 'v1/team',
                    'pluralize'     => false,
                    'tokens'        => [
                        '{id}'             => '<id:\d+>',
                    ],
                    'extraPatterns' => [
                    ]
                ],
                [
                    'class'         => 'yii\rest\UrlRule',
                    'controller'    => 'v1/staff',
                    'pluralize'     => false,
                    'tokens'        => [
                        '{id}'             => '<id:\d+>',
                    ],
                    'extraPatterns' => [
                    ]
                ],
                [
                    'class'         => 'yii\rest\UrlRule',
                    'controller'    => 'v1/timesheet',
                    'pluralize'     => false,
                    'tokens'        => [
                        '{id}'             => '<id:\d+>',
                    ],
                    'extraPatterns' => [
                        'GET staff'     => 'staff',
                        'OPTIONS staff' => 'options',
                    ]
                ],
                [
                    'class'         => 'yii\rest\UrlRule',
                    'controller'    => 'v1/report',
                    'pluralize'     => false,
                    'tokens'        => [
                    ],
                    'extraPatterns' => [
                        'GET timesheet'     => 'timesheet',
                        'OPTIONS timesheet' => 'options',
                    ]
                ],
                [
                    'class'         => 'yii\rest\UrlRule',
                    'controller'    => 'v1/activity',
                    'pluralize'     => false,
                    'tokens'        => [
                    ],
                    'extraPatterns' => [
                    ]
                ],
            ],
        ],
        'response' => [
            'class' => 'yii\web\Response',
            'on beforeSend' => function ($event) {

                $response = $event->sender;
                if($response->format == 'html') {
                    return $response;
                }

                $responseData = $response->data;

                if(is_string($responseData) && json_decode($responseData)) {
                    $responseData = json_decode($responseData, true);
                }


                if($response->statusCode >= 200 && $response->statusCode <= 299) {
                    $response->data = [
                        'success'   => true,
                        'status'    => $response->statusCode,
                        'data'      => $responseData,
                    ];
                } else {
                    $response->data = [
                        'success'   => false,
                        'status'    => $response->statusCode,
                        'data'      => $responseData,
                    ];

                }
                return $response;
            },
        ],
    ],
    'modules' => [
        'v1' => [
            'class' => 'app\modules\v1\Module',
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
    ];
}

return $config;
