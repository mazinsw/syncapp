// React Modules
import React, { Component } from 'react';
// Modules for create navigation
import { StackNavigator } from 'react-navigation';

// SQLite module
import SQLite from 'react-native-sqlite-storage';

// Screens
import HomeScreen from './screens/Home/';
import ListPhonesScreen from './screens/ListPhones';
import RegisterCustomerScreen from './screens/RegisterCustomer/';
import RegisterPhonesScreen from './screens/RegisterPhones';
import UpdateCustomerScreen from './screens/UpdateCustomer';
import UpdatePhoneScreen from './screens/UpdatePhone';

// Creating navigator
const Navigator = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    ListPhones: {
      screen: ListPhonesScreen
    },
    RegisterCustomer: {
      screen: RegisterCustomerScreen
    },
    RegisterPhones: {
      screen: RegisterPhonesScreen
    },
    UpdateCustomer: {
      screen: UpdateCustomerScreen
    },
    UpdatePhone: {
      screen: UpdatePhoneScreen
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home'
  }
);

export default class App extends Component {
  constructor(props) {
    super(props);
    let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
    // Customer Table
    db.executeSql('CREATE TABLE IF NOT EXISTS "customer"( "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "name" VARCHAR(45) NOT NULL, "code" VARCHAR(45), CONSTRAINT "code_UNIQUE" UNIQUE("code") );');
    // Phone Table
    db.executeSql('CREATE TABLE IF NOT EXISTS "phone"( "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "customer_id" INTEGER NOT NULL, "number" VARCHAR(45) NOT NULL, CONSTRAINT "uk_phone_custimer_id_number" UNIQUE("customer_id", "number"), CONSTRAINT "fk_phone_customer_id" FOREIGN KEY("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE RESTRICT );');
    // Index Phone
    db.executeSql('CREATE INDEX IF NOT EXISTS "phone.fk_phone_customer_id_idx" ON "phone" ("customer_id");');
    // Device Table
    db.executeSql('CREATE TABLE IF NOT EXISTS "device"( "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "guid" VARCHAR(48) NOT NULL, "offset" INTEGER DEFAULT NULL,-- Last server offset that was synced "synced" INTEGER DEFAULT NULL,-- Last timestamp that device was synced CONSTRAINT "guid_UNIQUE" UNIQUE("guid"));');
    // Logger Table
    db.executeSql('CREATE TABLE IF NOT EXISTS "logger"( "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "device_id" INTEGER NOT NULL, "table" VARCHAR(45) NOT NULL,-- Table that row was modified "row" INTEGER NOT NULL,-- Row id modified "event" TEXT NOT NULL CHECK("event" IN("insert", "update", "delete")),-- That happens to row "date" INTEGER NOT NULL,-- Date and time unix timestamp of occurrency CONSTRAINT "fk_logger_device_id" FOREIGN KEY("device_id") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE RESTRICT);');
    // Index Logger Device
    db.executeSql('CREATE INDEX IF NOT EXISTS "logger.fk_logger_device_id_idx" ON "logger" ("device_id");');
    // Index Logger Table
    db.executeSql('CREATE INDEX IF NOT EXISTS "logger.table_row" ON "logger" ("table","row" DESC);');
    // Mapper Table
    db.executeSql('CREATE TABLE IF NOT EXISTS "mapper"( "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "device_id" INTEGER NOT NULL, "table" VARCHAR(45) NOT NULL,-- Table of new row "from" INTEGER NOT NULL,-- Row id from origem device "to" INTEGER NOT NULL,-- Local row id CONSTRAINT "fk_mapper_device_id" FOREIGN KEY("device_id") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE RESTRICT);');
    // Index Mapper Table
    db.executeSql('CREATE INDEX IF NOT EXISTS "mapper.device_id_table_from" ON "mapper" ("device_id","table","from" DESC);');
    // Index Mapper Device
    db.executeSql('CREATE INDEX IF NOT EXISTS "mapper.fk_mapper_device_id_idx" ON "mapper" ("device_id");');
    // System Table
    db.executeSql('CREATE TABLE IF NOT EXISTS "system"( "id" TEXT PRIMARY KEY NOT NULL CHECK("id" IN("1")) DEFAULT "1", "device_id" INTEGER NOT NULL, "db_version" VARCHAR(45) NOT NULL, CONSTRAINT "fk_system_device_id" FOREIGN KEY("device_id") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE RESTRICT);');
    // Index System
    db.executeSql('CREATE INDEX IF NOT EXISTS "system.fk_system_device_id_idx" ON "system" ("device_id");');
  }

  successCB() {
    console.log("SQL executed fine");
  }

  errorCB(err) {
    console.error("SQLite3 Error: " + err);
  }

  openCB() {
    console.log("Database OPENED");
  }

  render() {
    return (
      <Navigator />
    );
  }

}
