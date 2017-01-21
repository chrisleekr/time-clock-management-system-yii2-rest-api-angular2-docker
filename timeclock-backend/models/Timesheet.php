<?php

namespace app\models;

use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;

/**
 * This is the model class for table "timesheet".
 *
 * @property integer $id
 * @property integer $staff_id
 * @property string $start_time
 * @property string $finish_time
 * @property integer $status
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Staff $staff
 */
class Timesheet extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'timesheet';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['staff_id', 'status'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['staff_id'], 'exist', 'skipOnError' => true, 'targetClass' => Staff::className(), 'targetAttribute' => ['staff_id' => 'id']],
            [['staff_id', 'start_time'], 'required'],
            [['start_time', 'finish_time'], 'datetime', 'format'=> 'yyyy-MM-dd HH:mm:ss'],
            ['start_time', 'validateTime', 'params' => ['type' => 'start']],
            ['finish_time', 'validateTime', 'params' => ['type' => 'finish', 'targetAttribute' => 'start_time']],
            [['status'], 'default', 'value' => 1],

        ];
    }

    /**
     * Validate date time format
     *
     * @param $attribute
     * @param $param
     */
    public function validateTime($attribute, $param) {
        $type = isset($param['type']) ? $param['type'] : 'start';

        if($this->$attribute && strtotime($this->$attribute) === -1) {
            $this->addError($attribute, Yii::t('app', 'Time is not valid format.'));
            return;
        }

        switch($type){
            case 'finish':
                $targetAttribute = isset($param['targetAttribute']) ? $param['targetAttribute'] : '';
                if($this->$targetAttribute && (strtotime($this->$attribute) < strtotime($this->$targetAttribute))) {
                    // then compare the value between target attribute
                    $this->addError($attribute, Yii::t('app', 'The finish time clashes with a start time.'));
                }
                break;
        }
    }

    /** @inheritdoc */
    public function behaviors()
    {
        // TimestampBehavior also provides a method named touch() that allows you to assign the current timestamp to the specified attribute(s) and save them to the database. For example,
        // $model->touch('confirmed_at');
        // $model->touch('last_login_at');
        // $model->touch('blocked_at');
        return [
            [
                'class' =>  TimestampBehavior::className(),
                'createdAtAttribute' => 'created_at',
                'updatedAtAttribute' => 'updated_at',
                'value' => date('Y-m-d H:i:s')
            ]
        ];
    }


    // explicitly list every field, best used when you want to make sure the changes
    // in your DB table or model attributes do not cause your field changes (to keep API backward compatibility).
    public function fields()
    {
        return [
            'id',
            'staff_id',
            'staff_fullname' => function(){
                return $this->staff->firstname.', '.$this->staff->lastname;
            },
            'start_time',
            'finish_time',
            'updated_at',
//            'staff' =>  function(){
//                return $this->staff;
//            }
        ];
    }
    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'staff_id' => Yii::t('app', 'Staff ID'),
            'start_time' => Yii::t('app', 'Start Time'),
            'finish_time' => Yii::t('app', 'Finish Time'),
            'status' => Yii::t('app', 'Status'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getStaff()
    {
        return $this->hasOne(Staff::className(), ['id' => 'staff_id']);
    }

    public static function getReportTimesheet($startDate, $finishDate) {

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

        $response = [
            'start_date'            => $startDate,
            'finish_date'           => $finishDate,
            'total_durations'       => [],
            'total_durations_label' => '',
            'total_durations_raw'   => 0,
            'staffs'                => []
        ];

        $staffTimesheets = Timesheet::find()
            ->select([
                'timesheet.*',
            ])->joinWith([
                'staff' => function ($query) {
                    $query->andWhere(['staff.status' => 1]);
                    $query->joinWith([
                        'team' => function ($query) {
                            $query->andWhere(['team.status' => 1]);
                        }
                    ]);
                },
            ])->where([
                'timesheet.status' => 1
            ])->andWhere([
                '>=', 'DATE(`timesheet`.`start_time`)',  $startDate
            ])->andWhere([
                '<=', 'DATE(`timesheet`.`finish_time`)', $finishDate
            ])->orderBy(
                'staff.id ASC'
            )->all();

        $tmpStaffs = [];
        $totalDurationsRaw = 0;
        if($staffTimesheets) {
            foreach($staffTimesheets as $timesheetKey => $timesheet) {
                if(isset($tmpStaffs[$timesheet['staff']['id']]) == false) {
                    $tmpStaffs[$timesheet['staff']['id']] = [
                        'firstname'             =>  $timesheet['staff']['firstname'],
                        'lastname'              =>  $timesheet['staff']['lastname'],
                        'primary_colour'        =>  $timesheet['staff']['primary_colour'],
                        'lightness'             =>  $timesheet['staff']['lightness'],
                        'team_name'             =>  $timesheet['staff']['team']['team_name'],
                        'team_primary_colour'   =>  $timesheet['staff']['team']['primary_colour'],
                        'team_lightness'        =>  $timesheet['staff']['team']['lightness'],
                        'total_durations'       =>  [],
                        'total_durations_label' => '',
                        'total_durations_raw'   => 0,
                        'timesheets'            =>  []
                    ];
                }

                $startDate = date("Y-m-d", strtotime($timesheet['start_time']));
                $finishDate = date("Y-m-d", strtotime($timesheet['finish_time']));
                $startTime = date("H:i", strtotime($timesheet['start_time']));
                if($startDate == $finishDate) {
                    $finishTime = date("H:i", strtotime($timesheet['finish_time']));
                } else {
                    $finishTime = date("Y-m-d H:i", strtotime($timesheet['finish_time']));
                }

                $durationsRaw = strtotime($timesheet['finish_time']) - strtotime($timesheet['start_time']);
                $durations = self::getDurations($durationsRaw);


                $tmpTimesheet = [
                    'id'            =>  $timesheet['id'],
                    'date'          =>  $startDate,
                    'start_time'    =>  $startTime,
                    'finish_time'   =>  $finishTime,
                    'start_time_raw'    => $timesheet['start_time'],
                    'finish_time_raw'   =>  $timesheet['finish_time'],
                    'durations'         => $durations,
                    'durations_label'   => self::convertDurationsToString($durations),
                    'durations_raw'     => $durationsRaw
                ];
                $tmpStaffs[$timesheet['staff']['id']]['timesheets'][] = $tmpTimesheet;
                $tmpStaffs[$timesheet['staff']['id']]['total_durations_raw'] += $durationsRaw;
                $tmpStaffs[$timesheet['staff']['id']]['total_durations'] = self::getDurations($tmpStaffs[$timesheet['staff']['id']]['total_durations_raw']);
                $tmpStaffs[$timesheet['staff']['id']]['total_durations_label'] = self::convertDurationsToString($tmpStaffs[$timesheet['staff']['id']]['total_durations']);

                $totalDurationsRaw += $durationsRaw;
            }
        }

        $response['staffs'] = $tmpStaffs;
        $response['total_durations_raw'] = $totalDurationsRaw;
        $response['total_durations'] = self::getDurations($totalDurationsRaw);
        $response['total_durations_label'] = self::convertDurationsToString($response['total_durations']);

        // sort staff name $response['staffs']
        function sortByOrder($a, $b) {
            return $a['order'] - $b['order'];
        }

        usort($response['staffs'], function($a, $b){
            return $a['firstname'] > $b['firstname'];
        });
        return $response;
    }


    private static function getDurations($time) {

        $hours = floor($time / (60 * 60));
        $time -= $hours * (60 * 60);
        $minutes = floor(($time / 60) % 60);
        $time -= $minutes * 60;
        $seconds = $time % 60;

        return [
            'hours'     =>  $hours,
            'minutes'   =>  $minutes,
            'seconds'   =>  $seconds
        ];
    }

    private static function convertDurationsToString($durations, $noSecondsLabel = true){
        $label = '';
        if($durations['hours'] == 1) {
            $label .= $durations['hours'].' Hour ';
        } elseif($durations['hours'] >= 2) {
            $label .= ($label != '' && $durations['hours'] < 10 ? '0':'').$durations['hours'].' Hours ';
        }

        if($durations['minutes'] == 1) {
            $label .= $durations['minutes'].' Minute ';
        } elseif($durations['minutes'] >= 2) {
            $label .= ($label != '' && $durations['minutes'] < 10 ? '0':'').$durations['minutes']. ' Minutes ';
        }

        if($noSecondsLabel == false) {
            if($durations['seconds'] == 1) {
                $label .= $durations['seconds'].' Second ';
            } elseif($durations['seconds'] >= 2) {
                $label .= ($label != '' && $durations['seconds'] < 10 ? '0':'').$durations['seconds']. ' Seconds ';
            }
        }
        return trim($label);
    }
}
