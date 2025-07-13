INSERT INTO users (id, name, email, password_hash)
VALUES (
  '9f4eacbf-9cfc-4a08-8c35-fb8eabcdd897',
  'Admin',
  'admin@admin.com',
  '$2b$10$RRdybUw9Ypxd.HR38l8UGORzd36eE.KbVXMUq1ICwBXnoxjAw8g8S' -- bcrypt hash of word kti
);

INSERT INTO semesters (id, year, type, start_date, end_date)
VALUES
  ( 'e15683d9-bcd0-4893-ab28-cb7a8f44cbf3', 2023, 'winter', '2023-10-01', '2024-01-25' ),
  ( 'a4560e99-9aa0-4c3e-9a6d-73c63b847d2e', 2023, 'summer', '2024-02-21', '2024-06-14' ),
  ( '50138012-1f54-43a6-b5fd-8efea42020a9', 2024, 'winter', '2024-10-01', '2025-01-30' ),
  ( '094f8324-7c58-4566-b5d7-e4fe8ed03a18', 2024, 'summer', '2025-02-24', '2025-06-15' );

INSERT INTO subjects (id, name, semester_id)
VALUES
  ( '981c68ba-3f6a-459e-83af-f9fc578adc85', 'Sieci komputerowe', 'e15683d9-bcd0-4893-ab28-cb7a8f44cbf3' ),
  ( '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 'Lokalne sieci bezprzewodowe', 'a4560e99-9aa0-4c3e-9a6d-73c63b847d2e' ),
  ( 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 'Sieci komputerowe', '50138012-1f54-43a6-b5fd-8efea42020a9' ),
  ( '25108321-0391-4c7a-b4d8-5ea20388e813', 'Lokalne sieci bezprzewodowe', '094f8324-7c58-4566-b5d7-e4fe8ed03a18' ),
  ( '3f58b671-5b38-43f8-bf0f-49d93048c52e', 'Zarządzanie bezpieczeństwem sieci', '094f8324-7c58-4566-b5d7-e4fe8ed03a18' );

INSERT INTO exercises (id, name, subject_id, exercise_number)
VALUES
  -- Lokalne sieci bezprzewodowe 2024
  ( 'c3a882b8-d058-4f5e-9ea6-920856776679', 'Tryby pracy punktów dostępowych', '25108321-0391-4c7a-b4d8-5ea20388e813', 1 ),
  ( '41a2590d-0b40-41df-87be-80251594218a', 'Wydajność sieci standardów IEEE 802.11', '25108321-0391-4c7a-b4d8-5ea20388e813', 2 ),
  ( 'fef8b9d5-4a4f-4546-abc0-e9fc48b4661a', 'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11', '25108321-0391-4c7a-b4d8-5ea20388e813', 3 ),
  ( '6dd4c88b-89bd-4c3e-94e0-04750096bf86', 'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11 cz. II', '25108321-0391-4c7a-b4d8-5ea20388e813', 4 ),
  ( 'f4ef08bf-f778-4ef7-9bf4-875eb77a12a7', 'Emulacja sieci bezprzewodowych', '25108321-0391-4c7a-b4d8-5ea20388e813', 5 ),
  ( 'e4ffb869-8d1d-4396-89b5-f427af451e50', 'Radius', '25108321-0391-4c7a-b4d8-5ea20388e813', 6 ),

  -- Lokalne sieci bezprzewodowe 2023
  ( 'fb2180ac-a9c1-46e6-952e-5be2a54b1346', 'Tryby pracy punktów dostępowych', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 1 ),
  ( '8347ccd3-5d36-40ff-8a21-4e7d49f52455', 'Wydajność sieci standardów IEEE 802.11', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 2 ),
  ( '724ee79c-47e6-40d0-97fa-1a2b03085c95', 'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 3 ),
  ( '3a330675-94a8-44f8-8806-456cc3f4a0b7', 'Emulacja sieci bezprzewodowych', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 4 ),

  -- Zarządzanie bezpieczeństwem sieci
  ( 'f2cde405-c91f-417e-be0c-34217ed694e2', 'VLAN 2', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 1 ),
  ( '24adefb8-c2a4-4320-b64d-d9b9d2d59656', 'Firewall', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 2 ),
  ( '686b3992-b468-42b5-bf78-c6247d96e910', 'Skanowanie sieci', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 3 ),
  ( '89a84652-0f57-4955-b320-eb04fe31bf51', 'Tunele IPv6 i IPSec', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 4 ),

  -- Sieci komputerowe 2024
  ( 'ca7b29d6-3920-4566-8836-6045f6191b54', 'Diagnostyka sieci IPv4', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 1 ),
  ( 'd9ca226b-16c8-40db-8997-84c3b171d41d', 'Zarządzanie sprzętem sieciowym', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 2 ),
  ( 'eda8f76f-414a-4abb-b2f1-7a97b49cbe53', 'IPv6', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 3 ),
  ( 'da10e215-beb9-41f6-9895-0a6b83ab9a79', 'IPv6 cz. II', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 4 ),

  -- Sieci komputerowe 2024
  ( '79d83df1-1fc1-4cc5-afe6-6cc9e0387221', 'Diagnostyka sieci IPv4', '981c68ba-3f6a-459e-83af-f9fc578adc85', 1 ),
  ( '2a31cf55-f926-42e2-a985-50849bafe939', 'Zarządzanie sprzętem sieciowym', '981c68ba-3f6a-459e-83af-f9fc578adc85', 2 ),
  ( 'a263264d-1d2d-42de-939e-ee9553961b17', 'IPv6', '981c68ba-3f6a-459e-83af-f9fc578adc85', 3 ),
  ( '805124e6-2595-4fe6-ad91-93f2a6c5762e', 'IPv6 cz. II', '981c68ba-3f6a-459e-83af-f9fc578adc85', 4 );
