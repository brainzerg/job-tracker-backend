
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLES IF EXISTS Companies, Jobs, User, Applications, Skills, User_has_Skills, Jobs_has_Skills, Contacts;

-- -----------------------------------------------------
-- Table `Companies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Companies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(145) NOT NULL,
  `products` VARCHAR(545) NULL,
  `headqtrs` VARCHAR(145) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Jobs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `startdate` VARCHAR(145) NOT NULL,
  `salary` VARCHAR(145) NULL,
  `location` VARCHAR(145) NULL,
  `Companies_id` INT NOT NULL,
  `position` VARCHAR(145),
  PRIMARY KEY (`id`, `Companies_id`),
  INDEX `fk_Jobs_Companies1_idx` (`Companies_id` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `auth0_id` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Applications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Applications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `applydate` VARCHAR(45) NOT NULL,
  `Jobs_id` INT NOT NULL,
  `User_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Jobs_id`, `User_id`),
  INDEX `fk_Applications_Jobs1_idx` (`Jobs_id` ASC) VISIBLE,
  INDEX `fk_Applications_Person1_idx` (`User_id` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `Skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Skills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(145) UNIQUE NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `User_has_Skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `User_has_Skills` (
  `User_id` INT NOT NULL,
  `Skills_id` INT NOT NULL,
  `proficiency` VARCHAR(45) NULL,
  PRIMARY KEY (`User_id`, `Skills_id`),
  INDEX `fk_Skills_has_Person_Person1_idx` (`User_id` ASC) VISIBLE,
  INDEX `fk_Skills_has_Person_Skills1_idx` (`Skills_id` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `Jobs_has_Skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Jobs_has_Skills` (
  `Jobs_id` INT NOT NULL,
  `Skills_id` INT NOT NULL,
  PRIMARY KEY (`Jobs_id`, `Skills_id`),
  INDEX `fk_Jobs_has_Skills_Skills1_idx` (`Skills_id` ASC) VISIBLE,
  INDEX `fk_Jobs_has_Skills_Jobs1_idx` (`Jobs_id` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `Contacts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(145) NOT NULL,
  `email` VARCHAR(145) NULL,
  `phone` VARCHAR(45) NULL,
  `User_id` INT NOT NULL,
  `Companies_id` INT NOT NULL,
  PRIMARY KEY (`id`, `User_id`, `Companies_id`),
  INDEX `fk_Contacts_Person1_idx` (`User_id` ASC) VISIBLE,
  INDEX `fk_Contacts_Companies1_idx` (`Companies_id` ASC) VISIBLE);

-- -----------------------------------------------------
-- INSERT INTO Companies, Jobs, User, Applications, Skills, User_has_Skills, Jobs_has_Skills, Contacts
-- -----------------------------------------------------

INSERT INTO Companies (name, products, headqtrs)
VALUES
('Google', 'Web services, etc.', 'Mountainview, CA USA'),
('Amazon', 'Lots of Junk', 'Palo Alto, CA USA'),
('Intel', 'Motherboards GPUs and Foundary chips', 'Santa Clara, CA USA');

INSERT INTO Jobs (Companies_id, location, salary, startdate)
VALUES
(1, 'San Francisco, CA USA', '$125 K', '01-04-2024'),
(3, 'Hillsboro, OR USA', '$105 K', '09-12-2023'),
(1, 'Seattle, WA USA', '$120 K', '08-31-2023');

INSERT INTO User (name, email, auth0_id)
VALUES
('Christian Kesting', 'cKesting@gmail.com', 'test-auth0-123'),
('Kim Neher', 'kNeher@gmail.com', 'test-auth0-234'),
('Waffs Kesting', 'wKesting@gmail.com', 'test-auth0-555');

INSERT INTO Applications (applydate, Jobs_id, status, User_id)
VALUES
('07-04-23', 1, 'Applied', 1),
('06-29-23', 1, 'Job Offer', 3),
('05-20-23', 3, 'Investigation', 2);

INSERT INTO Skills (type)
VALUES
('python'),
('sql'),
('webdev');

INSERT INTO User_has_Skills (proficiency, Skills_id, User_id)
VALUES
(5, 1, 1),
(4, 2, 1),
(3, 3, 3);

INSERT INTO Jobs_has_Skills (Jobs_id, Skills_id)
VALUES
(1, 1),
(2, 3),
(1, 2);

INSERT INTO Contacts (Companies_id, email, name, phone, User_id)
VALUES
(1, 'Cody@gmail.com', 'Cody Kesting', '425-145-5677', 1),
(3, 'Kim@Intel.com', 'Kim Thebomb', '503-644-5643', 1),
(2, 'Chris@amazon.com', 'Chris Elsworth', '360-342-8965', 3);


SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
