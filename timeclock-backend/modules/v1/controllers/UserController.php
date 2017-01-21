<?php
    namespace app\modules\v1\controllers;

    use Yii;
    use app\models\SignupForm;
    use app\models\LoginForm;
    use yii\helpers\Url;
    use yii\rest\ActiveController;
    use yii\web\HttpException;

    class UserController extends ActiveController
    {
        public $modelClass = 'app\models\User';

        public function __construct($id, $module, $config = [])
        {
            parent::__construct($id, $module, $config);

        }

        public function actions()
        {
//            $actions = parent::actions();
//            unset($actions['create']);
//            return $actions;
            return [];
        }

        public function behaviors()
        {
            $behaviors = parent::behaviors();

            $behaviors['verbs'] = [
                'class' => \yii\filters\VerbFilter::className(),
                'actions' => [
                    'index'  => [],
                    'view'   => [],
                    'create' => ['post'],
                    'update' => [],
                    'delete' => [],
                    'login'  => ['post']
                ],
            ];

            // remove authentication filter
            $auth = $behaviors['authenticator'];
            unset($behaviors['authenticator']);

            // add CORS filter
            $behaviors['corsFilter'] = [
                'class' => \yii\filters\Cors::className(),
                'cors' => [
                    'Origin' => ['*'],
                    'Access-Control-Request-Method' => ['POST', 'OPTIONS'],
                    'Access-Control-Request-Headers' => ['*'],
                ],
            ];

            // re-add authentication filter
            $behaviors['authenticator'] = $auth;
            // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
            $behaviors['authenticator']['except'] = ['options'];
            return $behaviors;
        }

        public function actionCreate(){
            // implement here your code
            $model = new SignupForm();


            Yii::trace(Yii::$app->request->post());
            Yii::trace($model->load(Yii::$app->request->post()));
            if ($model->load(Yii::$app->request->post()) && $model->validate()) {
                if ($user = $model->signup()) {
                    // force confirm email address
                    $user->confirmEmail();
                    if (Yii::$app->getUser()->login($user)) {

                        // return access code
                        $user->generateAccessTokenAfterUpdatingClientInfo(true);


                        $response = \Yii::$app->getResponse();
                        $response->setStatusCode(201);
                        $id = implode(',', array_values($user->getPrimaryKey(true)));
                        $response->getHeaders()->set('Location', Url::toRoute([$id], true));

                        $responseData = [
                            'id'    =>  $id,
                            'access_token' => $user->access_token,
                        ];

                        return $responseData;
                    } else {
                        // login error
                        throw new HttpException(400, "Login Error");
                    }
                } else {
                    // Save error
                    throw new HttpException(400, "Bad Request");
                }
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        }


        public function actionLogin(){
//            Yii::trace(Yii::$app->getRequest()->getMethod());
//
//            if(Yii::$app->getRequest()->getMethod() == 'OPTIONS'){
//                return json_encode('ok');
//            }


            $model = new LoginForm();
            Yii::trace(Yii::$app->request->post());
            Yii::trace($model->load(Yii::$app->request->post()));


            if ($model->load(Yii::$app->request->post()) && $model->login()) {
                $user = $model->getUser();
                $user->generateAccessTokenAfterUpdatingClientInfo(true);

                $response = \Yii::$app->getResponse();
                $response->setStatusCode(200);
                $id = implode(',', array_values($user->getPrimaryKey(true)));

                $responseData = [
                    'id'    =>  $id,
                    'access_token' => $user->access_token,
                ];

                return $responseData;
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        }


        public function actionOptions($id = null) {
            return "ok";
        }
    }