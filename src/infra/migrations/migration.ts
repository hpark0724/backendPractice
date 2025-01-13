import { Migration } from '@mikro-orm/migrations'

export class Migration20250107 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
        CREATE TABLE Membership (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(200) NOT NULL,
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

    this.addSql(`
        CREATE TABLE movie (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(200) NOT NULL,
          genre TEXT NOT NULL,
          duration INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          deleted_at TIMESTAMP NULL
        );
      `);

    // Full-Text Index 추가 
    this.addSql(`
          CREATE FULLTEXT INDEX genre_fulltext_idx ON movie (genre);
        `);
  }


}