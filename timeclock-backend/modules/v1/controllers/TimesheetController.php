<?php
    namespace app\modules\v1\controllers;

    use app\models\Activity;
    use Yii;
    use app\models\Staff;
    use app\models\Timesheet;
    use yii\data\ActiveDataProvider;
    use yii\filters\auth\CompositeAuth;
    use app\filters\auth\HttpBearerAuth;
    use yii\rest\ActiveController;
    use yii\helpers\Url;
    use yii\web\NotFoundHttpException;
    use yii\web\ServerErrorHttpException;

    class TimesheetController extends ActiveController
    {
        public $modelClass = 'app\models\Timesheet';

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
                    'staff'  => ['get'],
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


        public function actionStaff(){
            $staffTimesheets = [];

            $staffs = Staff::find()->where([
                'enabled'   =>  1
            ])->andWhere([
                'status'    =>  1
            ])->orderBy(
                'firstname ASC'
            )->all();

            if($staffs) {
                foreach($staffs as $staffKey => $staff) {

                    $currentTimesheet = [];
                    $lastTimesheet = [];

                    // get latest timesheet
                    $timesheets = Timesheet::find()->where([
                        'staff_id'  =>  $staff['id'],
                    ])->andWhere([
                        'status'    =>  1
                    ])->orderBy(
                        'created_at DESC, updated_at DESC'
                    )->limit(2)->all();

                    if($timesheets) {
                        if(sizeof($timesheets) == 1) {
                            if($timesheets[0]['finish_time'] == null) {
                                $currentTimesheet = $timesheets[0];
                            }
                            elseif($timesheets[0]['finish_time'] != null) {
                                $lastTimesheet = $timesheets[0];
                            }
                        }
                        elseif(sizeof($timesheets) == 2) {
                            if($timesheets[0]['finish_time'] == null) {
                                $currentTimesheet = $timesheets[0];
                                $lastTimesheet = $timesheets[1];
                            }
                            elseif($timesheets[0]['finish_time'] != null) {
                                $lastTimesheet = $timesheets[0];
                            }
                        }
                    }

                    $staffTimesheet = [
                        'id'                =>  $staff['id'],
                        'team_name'         =>  $staff['team']['team_name'],
                        'fullname'          =>  $staff['firstname'].', '.$staff['lastname'],
                        'primary_colour'    =>  $staff['primary_colour'],
                        'team_primary_colour'    =>  $staff['team']['primary_colour'],
                        'is_clocked_in'     =>  $currentTimesheet && $currentTimesheet['finish_time'] == null ? 1 : 0,
                        'lightness'         =>  $staff['lightness'],
                        'team_lightness'         =>  $staff['team']['lightness'],
                        'current_timesheet' =>  $currentTimesheet,
                        'last_timesheet'    =>  $lastTimesheet,
                    ];
                    $staffTimesheets[] = $staffTimesheet;
                }
            }
            return $staffTimesheets;
        }

        public function actionIndex(){
            return new ActiveDataProvider([
                'query' =>  Timesheet::find()->where([
                    'status'    =>  1,
                ])
            ]);
        }

        public function actionView($id){
            $user = Timesheet::find()->where([
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
            $model = new Timesheet();
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
            $activityMessage = "";
            if($model->start_time && $model->finish_time == null) {
                $activityMessage = "The staff '".$model->staff->firstname.", ".$model->staff->lastname."' clocked in at ".date("Y-m-d H:i", strtotime($model->start_time)).".";
            } else {
                $activityMessage = "New timesheet entry '".date("Y-m-d H:i", strtotime($model->start_time))." ~ ".date("Y-m-d H:i", strtotime($model->finish_time))."' for '".$model->staff->firstname.", ".$model->staff->lastname."' is recorded.";
            }


            $activity = new Activity([
                'activity_type'     =>  'timesheet_create',
                'activity_message'  =>  $activityMessage,
                'activity_params'   =>  json_encode(['timesheet'=>$model->getAttributes()])
            ]);
            $activity->save();

            return $model;
        }

        public function actionUpdate($id) {
            /** @var Timesheet $model */
            $model = $this->actionView($id);

            $originalModel = clone $model;


            $model->load(\Yii::$app->getRequest()->getBodyParams(), '');
            if ($model->save() === false && !$model->hasErrors()) {
                throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
            }

            $activityMessage = "";
            if($originalModel->start_time == $model->start_time && $originalModel->finish_time == null && $model->finish_time) {
                $activityMessage = "The staff '".$model->staff->firstname.", ".$model->staff->lastname."' clocked out at ".date("Y-m-d H:i", strtotime($model->finish_time)).".";
            } else {
                $activityMessage = "The timesheet entry for '".$model->staff->firstname.", ".$model->staff->lastname."' is updated from '".date("Y-m-d H:i", strtotime($originalModel->start_time))." ~ ".date("Y-m-d H:i", strtotime($originalModel->finish_time))."' to '".date("Y-m-d H:i", strtotime($model->start_time))." ~ ".date("Y-m-d H:i", strtotime($model->finish_time))."'.";
            }

            $activity = new Activity([
                'activity_type'     =>  'timesheet_update',
                'activity_message'  =>  $activityMessage,
                'activity_params'   =>  json_encode(['old_timesheet'=>$originalModel->getAttributes(), 'timesheet'=>$model->getAttributes()])
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

            $activityMessage = "The timesheet entry '".date("Y-m-d H:i", strtotime($model->start_time))." ~ ".date("Y-m-d H:i", strtotime($model->finish_time))."' for '".$model->staff->firstname.", ".$model->staff->lastname."' is deleted.";
            $activity = new Activity([
                'activity_type'     =>  'timesheet_delete',
                'activity_message'  =>  $activityMessage,
                'activity_params'   =>  json_encode(['timesheet'=>$model->getAttributes()])
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