<?php
    namespace app\modules\v1\controllers;

    use app\models\Activity;
    use app\models\Setting;
    use yii\data\ActiveDataProvider;
    use yii\filters\auth\CompositeAuth;
    use app\filters\auth\HttpBearerAuth;
    use yii\helpers\Url;
    use yii\rest\ActiveController;
    use yii\web\NotFoundHttpException;
    use yii\web\ServerErrorHttpException;

    class SettingController extends ActiveController
    {
        public $modelClass = 'app\models\Setting';

        public function __construct($id, $module, $config = [])
        {
            parent::__construct($id, $module, $config);

        }

        public function actions()
        {
//            $actions = parent::actions();
//            unset($actions['delete']);
//            return $actions;
            return [];
        }

        public function behaviors()
        {
            $behaviors = parent::behaviors();


            $behaviors['authenticator'] = [
                'class' => CompositeAuth::className(),
                'authMethods' => [
                    HttpBearerAuth::className(),
                ],

            ];

            $behaviors['verbs'] = [
                'class' => \yii\filters\VerbFilter::className(),
                'actions' => [
                    'index'  => ['get'],
                    'view'   => ['get'],
                    'create' => [],
                    'update' => ['put'],
                    'delete' => [],
                    'public' => ['get']
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
                    'Access-Control-Request-Method' => ['GET', 'PUT', 'OPTIONS'],
                    'Access-Control-Request-Headers' => ['*'],
                ],
            ];

            // re-add authentication filter
            $behaviors['authenticator'] = $auth;
            // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
            $behaviors['authenticator']['except'] = ['options', 'public'];


            return $behaviors;
        }

        public function actionPublic(){
            $publicSettings = [];

            $settings = Setting::find()->all();

            if($settings) {
                foreach($settings as $settingKey => $setting) {
                    $publicSettings[] = [
                        'meta_key'      => $setting['meta_key'],
                        'meta_type'     => $setting['meta_type'],
                        'meta_value'    => $setting['meta_value']
                    ];
                }
            }

            return $publicSettings;
        }

        public function actionIndex(){
            return new ActiveDataProvider([
                'query' =>  Setting::find()
            ]);
        }

        public function actionView($id){
            $setting = Setting::find()->where([
                'id'    =>  $id
            ])->one();
            if($setting){
                return $setting;
            } else {
                throw new NotFoundHttpException("Object not found: $id");
            }
        }

        public function actionCreate(){
            $model = new Setting();
            $model->load(\Yii::$app->getRequest()->getBodyParams(), '');
            if ($model->save()) {
                $response = \Yii::$app->getResponse();
                $response->setStatusCode(201);
                $id = implode(',', array_values($model->getPrimaryKey(true)));
                $response->getHeaders()->set('Location', Url::toRoute([$id], true));
            } elseif (!$model->hasErrors()) {
                throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
            }

            // save activity
            $activity = new Activity([
                'activity_type'     =>  'setting_create',
                'activity_message'  =>  'Setting "'.$model->meta_name.'" has been created to '.$model->meta_value.'.',
                'activity_params'   =>  json_encode(['setting'=>$model->getAttributes()])
            ]);
            $activity->save();

            return $model;
        }

        public function actionUpdate($id) {
            $model = $this->actionView($id);

            $model->load(\Yii::$app->getRequest()->getBodyParams(), '');
            if ($model->save() === false && !$model->hasErrors()) {
                throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
            }

            // save activity
            $activity = new Activity([
                'activity_type'     =>  'setting_update',
                'activity_message'  =>  'Setting "'.$model->meta_name.'" has been updated to '.$model->meta_value.'.',
                'activity_params'   =>  json_encode(['setting'=>$model->getAttributes()])
            ]);
            $activity->save();

            return $model;

        }

        public function actionDelete($id) {
            $model = $this->actionView($id);

            if ($model->delete() === false) {
                throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
            }


            // save activity
            $activity = new Activity([
                'activity_type'     =>  'setting_delete',
                'activity_message'  =>  'Setting "'.$model->meta_name.'" has been deleted.',
                'activity_params'   =>  json_encode(['setting'=>$model->getAttributes()])
            ]);
            $activity->save();

            $response = \Yii::$app->getResponse();
            $response->setStatusCode(204);
            return "ok";

        }

        public function actionOptions($id = null) {
            return "ok";
        }
    }