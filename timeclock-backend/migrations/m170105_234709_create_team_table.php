<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `team`.
 */
class m170105_234709_create_team_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('team', [
            'id'                => $this->primaryKey(),
            'team_name'         => $this->string(255),
            'primary_colour'    => $this->string(10),
            'enabled'           => $this->boolean(),
            'status'            => $this->boolean(),
            'created_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP',
            'updated_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        // creates index for table
        $this->createIndex(
            'idx-team',
            'team',
            ['enabled', 'status']
        );
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropIndex('idx-team', 'team');

        $this->dropTable('team');
    }
}
