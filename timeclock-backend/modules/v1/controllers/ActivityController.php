<?php
    namespace app\modules\v1\controllers;

    use Yii;
    use app\models\Activity;
    use yii\data\ActiveDataProvider;
    use yii\filters\auth\CompositeAuth;
    use app\filters\auth\HttpBearerAuth;
    use yii\rest\ActiveController;

    class ActivityController extends ActiveController
    {
        public $modelClass = 'app\models\Activity';

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
                    'view'   => [''],
                    'create' => [''],
                    'update' => [''],
                    'delete' => [''],
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
                    'Access-Control-Request-Method' => ['GET', 'OPTIONS'],
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

            $startDate = Yii::$app->request->get('start_date');
            $finishDate = Yii::$app->request->get('finish_date');
            $limit = Yii::$app->request->get('limit');

            if($startDate == '' || strtotime($startDate) == false) {
                $startDate = date("Y-m-d", strtotime("-7 days"));
            } else {
                $startDate = date("Y-m-d", strtotime($startDate));
            }

            if($finishDate == '' || strtotime($finishDate) == false) {
                $finishDate = date("Y-m-d");
            } else {
                $finishDate = date("Y-m-d", strtotime($finishDate));
            }

            $limit = (int)$limit;


            $query = Activity::find()->where([
                'status'    =>  1,
            ])->andWhere([
                '>=', 'DATE(`activity`.`created_at`)',  $startDate
            ])->andWhere([
                '<=', 'DATE(`activity`.`created_at`)', $finishDate
            ])->orderBy(
                'activity.id DESC'
            );

            if($limit > 0){
                $query = $query->limit($limit);
            }


            $activity = $query->all();

            return $activity;
        }


        public function actionOptions($id = null) {
            return "ok";
        }
    }