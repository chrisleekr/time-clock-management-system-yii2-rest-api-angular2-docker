<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `setting`.
 */
class m170103_232448_create_setting_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('setting', [
            'id'            => $this->primaryKey(),
            'meta_key'      => $this->string(255),
            'meta_value'    => 'LONGTEXT',
            'created_at'    => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP',
            'updated_at'    => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        // creates index for table `setting`
        $this->createIndex(
            'idx-setting',
            'setting',
            ['meta_key', 'created_at', 'updated_at']
        );

        $this->insert('setting', [
            'id'            =>  1,
            'meta_key'      =>  'timezone',
            'meta_value'    =>  'Australia/Melbourne',
        ]);

        $this->insert('setting', [
            'id'            =>  2,
            'meta_key'      =>  'rounding_times',
            'meta_value'    =>  '5',
        ]);

        $this->insert('setting', [
            'id'            =>  3,
            'meta_key'      =>  'week_start_on',
            'meta_value'    =>  'Tuesday',
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropIndex('idx-setting', 'setting');
        $this->dropTable('setting');
    }
}
