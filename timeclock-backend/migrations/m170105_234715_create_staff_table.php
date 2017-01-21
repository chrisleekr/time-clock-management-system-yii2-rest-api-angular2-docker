<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `staff`.
 */
class m170105_234715_create_staff_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('staff', [
            'id'        => $this->primaryKey(),
            'team_id'   => $this->integer(11),
            'firstname' => $this->string(100),
            'lastname'  => $this->string(100),
            'email_address'     => $this->string(255),
            'primary_colour'    => $this->string(10),
            'enabled'           => $this->boolean(),
            'status'            => $this->boolean(),
            'created_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP',
            'updated_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);


        // creates index for table
        $this->createIndex(
            'idx-staff',
            'staff',
            ['team_id', 'email_address', 'enabled', 'status']
        );

        // create foreign key for table
        $this->addForeignKey(
            'fk-staff',
            'staff', 'team_id',
            'team', 'id'
        );

    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropForeignKey('fk-staff', 'staff');

        $this->dropIndex('idx-staff', 'staff');

        $this->dropTable('staff');
    }
}
