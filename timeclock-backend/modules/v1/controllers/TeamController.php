<?php
    namespace app\modules\v1\controllers;

    use app\models\Activity;
    use app\models\Team;
    use yii\data\ActiveDataProvider;
    use yii\filters\auth\CompositeAuth;
    use app\filters\auth\HttpBearerAuth;
    use yii\rest\ActiveController;
    use yii\helpers\Url;
    use yii\web\NotFoundHttpException;
    use yii\web\ServerErrorHttpException;
    use yii\web\UnauthorizedHttpException;

    class TeamController extends ActiveController
    {
        public $modelClass = 'app\models\Team';

        public function __construct($id, $module, $config = [])
        {
            parent::__construct($id, $module, $config);

        }

        public function actions()
        {
            //            $actions = parent::actions();
            //            unset($actions['index']);
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
                    'create' => ['post'],
                    'update' => ['put'],
                    'delete' => ['delete'],
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
                    'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    'Access-Control-Request-Headers' => ['*'],
                ],
            ];

            // re-add authentication filter
            $behaviors['authenticator'] = $auth;
            // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
            $behaviors['authenticator']['except'] = ['options'];

            return $behaviors;
        }


        public function actionIndex(){
            return new ActiveDataProvider([
                'query' =>  Team::find()->where([
                    'status'    =>  1,
                ])
            ]);
        }

        public function actionView($id){

            $user = Team::find()->where([
                'status'    =>  1
            ])->andWhere([
                'id'    =>  $id
            ])->one();
            if($user){
                return $user;
            } else {
                throw new NotFoundHttpException("Object not found: $id");
            }
        }

        public function actionCreate(){

            $model = new Team();
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
                'activity_type'     =>  'team_create',
                'activity_message'  =>  'Team "'.$model->team_name.'" has been created.',
                'activity_params'   =>  json_encode(['team'=>$model->getAttributes()])
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
                'activity_type'     =>  'team_update',
                'activity_message'  =>  'Team "'.$model->team_name.'" has been updated.',
                'activity_params'   =>  json_encode(['team'=>$model->getAttributes()])
            ]);
            $activity->save();

            return $model;

        }

        public function actionDelete($id) {
            $model = $this->actionView($id);

            $model->status = 0;

            if ($model->save() === false) {
                throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
            }


            // save activity
            $activity = new Activity([
                'activity_type'     =>  'team_delete',
                'activity_message'  =>  'Team "'.$model->team_name.'" has been deleted.',
                'activity_params'   =>  json_encode(['team'=>$model->getAttributes()])
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