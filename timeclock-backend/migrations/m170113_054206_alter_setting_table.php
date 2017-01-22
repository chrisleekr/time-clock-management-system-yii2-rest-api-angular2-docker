<?php

use yii\db\Migration;

class m170113_054206_alter_setting_table extends Migration
{
    public function up()
    {
        // add column meta_name, meta_type, meta_desc
        $this->addColumn('setting', 'meta_name', $this->string(255));
        $this->addColumn('setting', 'meta_type', $this->string(50));
        $this->addColumn('setting', 'meta_desc', $this->text());
        $this->addColumn('setting', 'meta_attribute', $this->text());

        $this->update('setting', [
            'meta_name' =>  'Timezone',
            'meta_type' =>  'select',
            'meta_desc' =>  'Set the time zone of the application',
            'meta_attribute'    =>  '{"list":[{"value":"Australia/Adelaide","label":"Australia/Adelaide"},{"value":"Australia/Brisbane","label":"Australia/Brisbane"},{"value":"Australia/Canberra","label":"Australia/Canberra"},{"value":"Australia/Hobart","label":"Australia/Hobart"},{"value":"Australia/Melbourne","label":"Australia/Melbourne"},{"value":"Australia/Perth","label":"Australia/Perth"},{"value":"Australia/Sydney","label":"Australia/Sydney"}]}',
        ], "meta_key = 'timezone'");

        $this->update('setting', [
            'meta_name' =>  'Rounding of Times (minutes)',
            'meta_type' =>  'number',
            'meta_desc' =>  'Set rounding minutes. Assuming Rounding of Time (minutes) set as 5, if staff is clocked in 09:04, then clocked in time will be calculated as 09:00. If staff is clocked out 16:02, then clocked out time will be calculated as 16:05.',
            'meta_attribute'    =>  '{"max":55,"min":5}',
        ], "meta_key = 'rounding_times'");

        $this->update('setting', [
            'meta_name' =>  'Week Start On',
            'meta_type' =>  'select',
            'meta_desc' =>  'Set the day of timesheet starts on',
            'meta_attribute'    =>  '{"list":[{"value":"Monday","label":"Monday"},{"value":"Tuesday","label":"Tuesday"},{"value":"Wednesday","label":"Wednesday"},{"value":"Thursday","label":"Thursday"},{"value":"Friday","label":"Friday"},{"value":"Saturday","label":"Saturday"},{"value":"Sunday","label":"Sunday"}]}',
        ], "meta_key = 'week_start_on'");


        $this->update('setting', [
            'meta_name' =>  'Rounding Mode',
            'meta_type' =>  'select',
            'meta_desc' =>  'Set rounding mode. If set "Rounding Off", then clock in/off time will be rounding off to next rounding time. If set "Rounding Down", then clock in/off time will round down to previous rounding time. For example, if rounding mode is "Rounding Off" and rounding time is "15" and staff clocks in 14:17, then the time sheet will start in 14:30. Another example is, if staff clocks out 18:50, then the time sheet will finish at 19:00.',
            'meta_attribute'    =>  '{"list":[{"value":"1","label":"Rounding Off"},{"value":"2","label":"Rounding Down"}]}',
        ], "meta_key = 'rounding_mode'");

    }

    public function down()
    {
        $this->dropColumn('setting', 'meta_name');
        $this->dropColumn('setting', 'meta_type');
        $this->dropColumn('setting', 'meta_desc');
        $this->dropColumn('setting', 'meta_attribute');
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
