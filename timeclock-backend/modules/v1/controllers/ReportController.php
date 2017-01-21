<?php
    namespace app\modules\v1\controllers;

    use app\models\Timesheet;
    use Yii;
    use yii\filters\auth\CompositeAuth;
    use app\filters\auth\HttpBearerAuth;
    use yii\rest\Controller;

    class ReportController extends Controller
    {
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
                    'timesheet'  => ['get'],
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

        /**
         * Get report for timesheet
         *
         * URL: http://api.attendance.local/v1/report/timesheet?start_date=2017-01-01&finish_date=2017-01-15
         *
         * Sample Response:
         * {
         *      "success": true,
         *      "status": 200,
         *      "data": {
         *          "start_date": "2017-01-01",
         *          "finish_date": "2017-01-15",
         *          "total_durations": {
         *              "hours": 0,
         *              "minutes": 5,
         *              "seconds": 0
         *          },
         *          "total_durations_raw": 300,
         *          "staffs": {
         *              "3": {
         *                  "firstname": "Staff",
         *                  "lastname": "Name",
         *                  "primary_colour": "#395c5c",
         *                  "team_name": "Kitchen",
         *                  "team_primary_colour": "#201bca",
         *                  "total_durations": {
         *                      "hours": 0,
         *                      "minutes": 5,
         *                      "seconds": 0
         *                  },
         *                  "total_durations_raw": 300
         *                  "timesheets": [
         *                      {
         *                          "date": "2017-01-12",
         *                          "start_time": "17:20",
         *                          "finish_time": "17:25",
         *                          "start_time_raw": "2017-01-12 17:20:00",
         *                          "finish_time_raw": "2017-01-12 17:25:00",
         *                          "durations": {
         *                              "hours": 0,
         *                              "minutes": 5,
         *                              "seconds": 0
         *                          },
         *                          "durations_raw": 300
         *                      }
         *                  ]
         *              }
         *          }
         *      }
         *  }
         */
        public function actionTimesheet(){
            $startDate = Yii::$app->request->get('start_date');
            $finishDate = Yii::$app->request->get('finish_date');

            $response = Timesheet::getReportTimesheet($startDate, $finishDate);

            return $response;
        }



        public function actionOptions($id = null) {
            return "ok";
        }
    }