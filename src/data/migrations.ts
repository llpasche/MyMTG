import { BaseDatabase } from "./BaseDatabase";
import dotenv from "dotenv";

dotenv.config();

const printError = (error: any) => {
  console.log(error.sqlMessage || error.message);
};

export class Migrations extends BaseDatabase {
  public createTables = () => {
    this.connection
      .raw(
        `CREATE TABLE IF NOT EXISTS Users(  
        user_id VARCHAR(255) NOT NULL PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        user_password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Cards(  
        card_id VARCHAR(255) PRIMARY KEY NOT NULL,
        card_name VARCHAR(255) NOT NULL,
        card_edition VARCHAR(255) NOT NULL,
        card_language ENUM('Inglês', 'Japonês', 'Português') NOT NULL,
        card_is_foil BOOLEAN NOT NULL,
        card_price VARCHAR(255) NOT NULL,
        card_quantity INT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Lists(  
    list_id VARCHAR(255) PRIMARY KEY NOT NULL,
    list_name VARCHAR(255) NOT NULL,
    creator_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (user_id)
);

    CREATE TABLE IF NOT EXISTS Card_and_List(  
        bond_id VARCHAR(255) PRIMARY KEY NOT NULL,
        card_id VARCHAR(255) NOT NULL,
        list_id VARCHAR(255) NOT NULL,
        FOREIGN KEY (card_id) REFERENCES cards (card_id),
        FOREIGN KEY (list_id) REFERENCES lists (list_id)
    );
    
    `
      )
      .then(() => {
        console.log("Tabelas criadas");
      })
      .catch(printError);

    const closeConnection = () => {
      this.connection.destroy();
    };
    closeConnection();
  };
}

const migrationsDB = new Migrations()

migrationsDB.createTables();
