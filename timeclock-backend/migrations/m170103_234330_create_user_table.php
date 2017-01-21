<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `user`.
 */
class m170103_234330_create_user_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('user', [
            'id' => $this->primaryKey(),
            'username'      => $this->string(200),
            'auth_key'      => $this->string(255),
            'access_token'  => $this->string(255),
            'access_token_expired_at'  => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'password_hash' => $this->string(255),
            'password_reset_token' => $this->string(255),
            'email'             => $this->string(255),

            'unconfirmed_email' =>  $this->string(255),
            'confirmed_at'      => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'registration_ip'   => $this->string(20),
            'last_login_at'     => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'last_login_ip'     => $this->string(20),
            'blocked_at'        => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',

            'status'            => $this->boolean()->defaultValue(1),
            'role'              => $this->integer(11)->null(),
            'created_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP',
            'updated_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        // creates index for table
        $this->createIndex(
            'idx-user',
            'user',
            ['username', 'auth_key', 'access_token', 'password_hash', 'status']
        );

        $this->insert('user', [
            'id'                    => 1,
            'username'              => 'admin',
            'auth_key'              => 'Qyn3L1XZzq9QZFT20ZCRsLDzQ3JtYhhK',
            'access_token'          => 'FcyoiSJ0Y8SA71uD3LoISqTJKISmQPAU',
            'access_token_expired_at'  => '2017-01-23 20:41:57',
            'password_hash'         => '$2y$13$YU8prbjG5.j46u67LeQ6De4QUXNGYuNAYkJK.Tqc6r./jGae8jye6',
            'password_reset_token' => null,
            'email'                 => 'admin@admin.com',

            'unconfirmed_email'     =>  'admin@admin.com',
            'confirmed_at'          => '2017-01-05 11:37:03',
            'registration_ip'       => '127.0.0.1',
            'last_login_at'         => '2017-01-18 20:41:57',
            'last_login_ip'         => '127.0.0.1',
            'blocked_at'            => null,

            'status'                => 10,
            'role'                  => null
        ]);

    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropIndex('idx-user', 'user');

        $this->dropTable('user');
    }
}
