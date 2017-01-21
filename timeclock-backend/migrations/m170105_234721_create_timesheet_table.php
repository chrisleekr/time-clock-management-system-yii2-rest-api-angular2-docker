<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `timesheet`.
 */
class m170105_234721_create_timesheet_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('timesheet', [
            'id'            => $this->primaryKey(),
            'staff_id'      => $this->integer(11),
            'start_time'    => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'finish_time'   => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'status'        => $this->boolean(),
            'created_at'    => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP',
            'updated_at'    => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'

        ]);

        // creates index for table
        $this->createIndex(
            'idx-timesheet',
            'timesheet',
            ['start_time', 'finish_time', 'status']
        );


        // create foreign key for table
        $this->addForeignKey(
            'fk-timesheet',
            'timesheet', 'staff_id',
            'staff', 'id'
        );


    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->execute("SET foreign_key_checks = 0;");

        $this->dropForeignKey('fk-timesheet', 'timesheet');

        $this->dropIndex('idx-timesheet', 'timesheet');

        $this->dropTable('timesheet');
        $this->execute("SET foreign_key_checks = 1;");

    }
}
