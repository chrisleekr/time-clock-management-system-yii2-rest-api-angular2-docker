<?php

namespace app\models;

use Yii;
use yii\behaviors\TimestampBehavior;

/**
 * This is the model class for table "activity".
 *
 * @property integer $id
 * @property string $activity_type
 * @property string $activity_message
 * @property string $activity_params
 * @property integer $status
 * @property string $created_at
 * @property string $updated_at
 */
class Activity extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'activity';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['activity_message', 'activity_params'], 'string'],
            [['status'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['activity_type'], 'string', 'max' => 45],


            [['status'], 'default', 'value' => 1],
            ['status', 'in', 'range' => [1, 0]],
        ];
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
            'activity_message',
            'created_at',
        ];
    }
    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'activity_type' => Yii::t('app', 'Activity Type'),
            'activity_message' => Yii::t('app', 'Activity Message'),
            'activity_params' => Yii::t('app', 'Activity Params'),
            'status' => Yii::t('app', 'Status'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }
}
