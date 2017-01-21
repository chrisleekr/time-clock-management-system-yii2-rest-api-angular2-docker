<?php

use yii\db\Migration;
    use yii\db\Schema;

/**
 * Handles the creation of table `activity`.
 */
class m170116_105812_create_activity_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('activity', [
            'id'                => $this->primaryKey(),
            'activity_type'     => $this->string(45),
            'activity_message'  => $this->text(),
            'activity_params'   => 'LONGTEXT',
            'status'            => $this->boolean(),
            'created_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP',
            'updated_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);
        // creates index for table
        $this->createIndex(
            'idx-activity',
            'activity',
            ['activity_type', 'created_at', 'updated_at']
        );
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropIndex('idx-activity', 'activity');

        $this->dropTable('activity');
    }
}
