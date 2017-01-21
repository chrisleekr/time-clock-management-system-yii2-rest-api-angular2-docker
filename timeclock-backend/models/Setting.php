<?php

namespace app\models;

use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;

/**
 * This is the model class for table "setting".
 *
 * @property integer $id
 * @property string $meta_key
 * @property string $meta_name
 * @property string $meta_type
 * @property string $meta_desc
 * @property string $meta_attribute
 * @property string $meta_value
 * @property string $created_at
 * @property string $updated_at
 */
class Setting extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'setting';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['meta_value'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['meta_key'], 'string', 'max' => 255],
            [['meta_key'], 'unique'],
            [['meta_key', 'meta_value', 'meta_name', 'meta_type'], 'required'],
            [['meta_desc', 'meta_attribute'], 'safe']

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
            'meta_key',
            'meta_name',
            'meta_type',
            'meta_desc',
            'meta_attribute',
            'meta_value',
            'updated_at',
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'meta_key' => Yii::t('app', 'Meta Key'),
            'meta_name' => Yii::t('app', 'Meta Name'),
            'meta_type' => Yii::t('app', 'Meta Type'),
            'meta_desc' => Yii::t('app', 'Meta Description'),
            'meta_attribute' => Yii::t('app', 'Meta Attribute'),
            'meta_value' => Yii::t('app', 'Meta Value'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }
}
