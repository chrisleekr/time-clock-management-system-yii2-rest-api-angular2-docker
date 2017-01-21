<?php

namespace app\models;

use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;

/**
 * This is the model class for table "team".
 *
 * @property integer $id
 * @property string $team_name
 * @property string $primary_colour
 * @property integer $enabled
 * @property integer $status
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Staff[] $staff
 */
class Team extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'team';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['enabled', 'status'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['team_name'], 'string', 'max' => 255],
//            [['primary_colour'], 'string', 'length' => 7],
            [['enabled', 'status'], 'default', 'value' => 1],
//            [['team_name'], 'unique'],
            [['team_name', 'primary_colour'], 'required'],
            ['primary_colour', 'validateHexColour'],
            ['enabled', 'in', 'range' => [1, 0]],
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
            'team_name',
            'primary_colour',
            'enabled',
            'enabled_label' => function(){
                $enabledLabel = "";
                switch($this->enabled) {
                    case 1:
                        $enabledLabel = Yii::t('app', 'Enabled');
                        break;
                    case 0:
                        $enabledLabel = Yii::t('app', 'Disabled');
                        break;
                }

                return $enabledLabel;
            },
            'lightness' => function(){
                return $this->getLightness();
            },
            'created_at',
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
            'team_name' => Yii::t('app', 'Team Name'),
            'primary_colour' => Yii::t('app', 'Primary Colour'),
            'enabled' => Yii::t('app', 'Enabled/Disabled'),
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
        return $this->hasMany(Staff::className(), ['team_id' => 'id']);
    }

    /**
     * Validate hex colour
     *
     * @param $attribute
     * @param $param
     */
    public function validateHexColour($attribute, $param) {
        $hexCode = $this->primary_colour;
        if(preg_match('/^#[a-f0-9]{3}$/i', $hexCode) || preg_match('/^#[a-f0-9]{6}$/i', $hexCode)) {

        } else {
            $this->addError($attribute, Yii::t('app', 'Primary colour is not valid format. e.g. #EF00EE'));
        }
    }



    public function getLightness() {
        $lightness = null;
        if($this->primary_colour != '') {
            $rgb = $this->HTMLToRGB($this->primary_colour);
            $hsl = $this->RGBToHSL($rgb);
            $lightness = $hsl->lightness;
        }
        return $lightness;
    }

    private function HTMLToRGB($htmlCode)
    {
        if($htmlCode[0] == '#')
            $htmlCode = substr($htmlCode, 1);

        if (strlen($htmlCode) == 3)
        {
            $htmlCode = $htmlCode[0] . $htmlCode[0] . $htmlCode[1] . $htmlCode[1] . $htmlCode[2] . $htmlCode[2];
        }

        $r = hexdec($htmlCode[0] . $htmlCode[1]);
        $g = hexdec($htmlCode[2] . $htmlCode[3]);
        $b = hexdec($htmlCode[4] . $htmlCode[5]);

        return $b + ($g << 0x8) + ($r << 0x10);
    }

    private function RGBToHSL($RGB) {
        $r = 0xFF & ($RGB >> 0x10);
        $g = 0xFF & ($RGB >> 0x8);
        $b = 0xFF & $RGB;

        $r = ((float)$r) / 255.0;
        $g = ((float)$g) / 255.0;
        $b = ((float)$b) / 255.0;

        $maxC = max($r, $g, $b);
        $minC = min($r, $g, $b);

        $l = ($maxC + $minC) / 2.0;

        if($maxC == $minC)
        {
            $s = 0;
            $h = 0;
        }
        else
        {
            if($l < .5)
            {
                $s = ($maxC - $minC) / ($maxC + $minC);
            }
            else
            {
                $s = ($maxC - $minC) / (2.0 - $maxC - $minC);
            }
            if($r == $maxC)
                $h = ($g - $b) / ($maxC - $minC);
            if($g == $maxC)
                $h = 2.0 + ($b - $r) / ($maxC - $minC);
            if($b == $maxC)
                $h = 4.0 + ($r - $g) / ($maxC - $minC);

            $h = $h / 6.0;
        }

        $h = (int)round(255.0 * $h);
        $s = (int)round(255.0 * $s);
        $l = (int)round(255.0 * $l);

        return (object) Array('hue' => $h, 'saturation' => $s, 'lightness' => $l);
    }
}
