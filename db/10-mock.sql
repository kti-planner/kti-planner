INSERT INTO users (id, name, email, password_hash, role)
VALUES (
  '9f4eacbf-9cfc-4a08-8c35-fb8eabcdd897',
  'Admin',
  'admin@admin.com',
  '$2b$10$RRdybUw9Ypxd.HR38l8UGORzd36eE.KbVXMUq1ICwBXnoxjAw8g8S', -- bcrypt hash of word kti
  'admin'
), (
  'c393c524-453c-4b02-bfad-5114fe828200',
  'Jan Kowalski',
  'jan@kowalski.pl',
  '$2b$10$JaxJ6EbZDFGx85OMNVOs1uSSk0SM3K7JFLmXDuqd2.x1kyEciaUdi', -- bcrypt hash of word kti
  'teacher'
), (
  'feeaa186-3d69-4801-a580-88be10d53553',
  'Bogdan Nowak',
  'bogdan@nowak.pl',
  '$2b$10$peLZH2NJD1Bqo.CwgWx.sOmAJO8eeUUmTLAnb5X6/m7EiwaUuCb9y', -- bcrypt hash of word kti
  'teacher'
);

INSERT INTO semesters (id, year, type, start_date, end_date)
VALUES
  ( 'e15683d9-bcd0-4893-ab28-cb7a8f44cbf3', 2023, 'winter', '2023-10-01', '2024-01-25' ),
  ( 'a4560e99-9aa0-4c3e-9a6d-73c63b847d2e', 2023, 'summer', '2024-02-21', '2024-06-14' ),
  ( '50138012-1f54-43a6-b5fd-8efea42020a9', 2024, 'winter', '2024-10-01', '2025-01-30' ),
  ( '094f8324-7c58-4566-b5d7-e4fe8ed03a18', 2024, 'summer', '2025-02-24', '2025-06-15' );

INSERT INTO schedule_changes (date, type)
VALUES
  -- winter 2024/2025
  ( '2024-10-31', 'holiday' ),
  ( '2024-11-01', 'holiday' ),
  ( '2024-11-11', 'holiday' ),
  ( '2024-11-12', 'monday' ),
  ( '2024-12-23', 'holiday' ),
  ( '2024-12-24', 'holiday' ),
  ( '2024-12-25', 'holiday' ),
  ( '2024-12-26', 'holiday' ),
  ( '2024-12-27', 'holiday' ),
  ( '2024-12-28', 'holiday' ),
  ( '2024-12-29', 'holiday' ),
  ( '2024-12-30', 'holiday' ),
  ( '2024-12-31', 'holiday' ),
  ( '2025-01-01', 'holiday' ),
  ( '2025-01-02', 'holiday' ),
  ( '2025-01-06', 'holiday' ),
  ( '2025-01-08', 'monday' ),
  -- winter 2024/2025
  ( '2025-04-16', 'friday' ),
  ( '2025-04-18', 'holiday' ),
  ( '2025-04-19', 'holiday' ),
  ( '2025-04-20', 'holiday' ),
  ( '2025-04-21', 'holiday' ),
  ( '2025-04-22', 'holiday' ),
  ( '2025-05-01', 'holiday' ),
  ( '2025-05-02', 'holiday' ),
  ( '2025-05-03', 'holiday' ),
  ( '2025-06-08', 'holiday' ),
  -- winter 2025/2026
  ( '2025-10-31', 'holiday' ),
  ( '2025-11-01', 'holiday' ),
  ( '2025-11-02', 'holiday' ),
  ( '2025-11-11', 'holiday' ),
  ( '2025-11-12', 'tuesday' ),
  ( '2025-12-22', 'holiday' ),
  ( '2025-12-23', 'holiday' ),
  ( '2025-12-24', 'holiday' ),
  ( '2025-12-25', 'holiday' ),
  ( '2025-12-26', 'holiday' ),
  ( '2025-12-27', 'holiday' ),
  ( '2025-12-28', 'holiday' ),
  ( '2025-12-29', 'holiday' ),
  ( '2025-12-30', 'holiday' ),
  ( '2025-12-31', 'holiday' ),
  ( '2026-01-01', 'holiday' ),
  ( '2026-01-02', 'holiday' ),
  ( '2026-01-03', 'holiday' ),
  ( '2026-01-04', 'holiday' ),
  ( '2026-01-06', 'holiday' ),
  ( '2026-01-08', 'tuesday' ),
  -- summer 2025/2026
  ( '2026-04-01', 'friday' ),
  ( '2026-04-03', 'holiday' ),
  ( '2026-04-04', 'holiday' ),
  ( '2026-04-05', 'holiday' ),
  ( '2026-04-06', 'holiday' ),
  ( '2026-04-07', 'holiday' ),
  ( '2026-05-01', 'holiday' ),
  ( '2026-05-02', 'holiday' ),
  ( '2026-05-03', 'holiday' ),
  ( '2026-05-24', 'holiday' ),
  ( '2026-06-04', 'holiday' );

INSERT INTO classrooms (id, name)
VALUES
  ( '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'EA 142' ),
  ( '8689d55d-508e-4f5d-aef8-d5052f220d20', 'EA 204' ),
  ( '556e5246-040e-4ad9-8cf8-5b30c34c76bd', 'Zdalnie' );

INSERT INTO subjects (id, name, semester_id, teacher_ids)
VALUES
  ( '981c68ba-3f6a-459e-83af-f9fc578adc85', 'Sieci komputerowe', 'e15683d9-bcd0-4893-ab28-cb7a8f44cbf3', '{c393c524-453c-4b02-bfad-5114fe828200}' ),
  ( '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 'Lokalne sieci bezprzewodowe', 'a4560e99-9aa0-4c3e-9a6d-73c63b847d2e', '{c393c524-453c-4b02-bfad-5114fe828200,feeaa186-3d69-4801-a580-88be10d53553}' ),
  ( 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 'Sieci komputerowe', '50138012-1f54-43a6-b5fd-8efea42020a9', '{c393c524-453c-4b02-bfad-5114fe828200}' ),
  ( '25108321-0391-4c7a-b4d8-5ea20388e813', 'Lokalne sieci bezprzewodowe', '094f8324-7c58-4566-b5d7-e4fe8ed03a18', '{c393c524-453c-4b02-bfad-5114fe828200,feeaa186-3d69-4801-a580-88be10d53553}' ),
  ( '3f58b671-5b38-43f8-bf0f-49d93048c52e', 'Zarządzanie bezpieczeństwem sieci', '094f8324-7c58-4566-b5d7-e4fe8ed03a18', '{c393c524-453c-4b02-bfad-5114fe828200,feeaa186-3d69-4801-a580-88be10d53553}' );

INSERT INTO exercises (id, name, subject_id, exercise_number, classroom_id, teacher_id)
VALUES
  -- Lokalne sieci bezprzewodowe 2024
  ( 'c3a882b8-d058-4f5e-9ea6-920856776679', 'Tryby pracy punktów dostępowych', '25108321-0391-4c7a-b4d8-5ea20388e813', 1, '8689d55d-508e-4f5d-aef8-d5052f220d20', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '41a2590d-0b40-41df-87be-80251594218a', 'Wydajność sieci standardów IEEE 802.11', '25108321-0391-4c7a-b4d8-5ea20388e813', 2, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( 'fef8b9d5-4a4f-4546-abc0-e9fc48b4661a', 'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11', '25108321-0391-4c7a-b4d8-5ea20388e813', 3, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( '6dd4c88b-89bd-4c3e-94e0-04750096bf86', 'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11 cz. II', '25108321-0391-4c7a-b4d8-5ea20388e813', 4, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( 'f4ef08bf-f778-4ef7-9bf4-875eb77a12a7', 'Emulacja sieci bezprzewodowych', '25108321-0391-4c7a-b4d8-5ea20388e813', 5, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'e4ffb869-8d1d-4396-89b5-f427af451e50', 'Radius', '25108321-0391-4c7a-b4d8-5ea20388e813', 6, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),

  -- Lokalne sieci bezprzewodowe 2023
  ( 'fb2180ac-a9c1-46e6-952e-5be2a54b1346', 'Tryby pracy punktów dostępowych', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 1, '8689d55d-508e-4f5d-aef8-d5052f220d20', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '8347ccd3-5d36-40ff-8a21-4e7d49f52455', 'Wydajność sieci standardów IEEE 802.11', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 2, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( '724ee79c-47e6-40d0-97fa-1a2b03085c95', 'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 3, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( '3a330675-94a8-44f8-8806-456cc3f4a0b7', 'Emulacja sieci bezprzewodowych', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 4, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'feeaa186-3d69-4801-a580-88be10d53553' ),

  -- Zarządzanie bezpieczeństwem sieci 2024
  ( 'f2cde405-c91f-417e-be0c-34217ed694e2', 'VLAN 2', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 1, '8689d55d-508e-4f5d-aef8-d5052f220d20', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( '24adefb8-c2a4-4320-b64d-d9b9d2d59656', 'Firewall', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 2, '8689d55d-508e-4f5d-aef8-d5052f220d20', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '686b3992-b468-42b5-bf78-c6247d96e910', 'Skanowanie sieci', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 3, '8689d55d-508e-4f5d-aef8-d5052f220d20', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '89a84652-0f57-4955-b320-eb04fe31bf51', 'Tunele IPv6 i IPSec', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 4, '556e5246-040e-4ad9-8cf8-5b30c34c76bd', 'feeaa186-3d69-4801-a580-88be10d53553' ),

  -- Sieci komputerowe 2024
  ( 'ca7b29d6-3920-4566-8836-6045f6191b54', 'Diagnostyka sieci IPv4', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 1, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'd9ca226b-16c8-40db-8997-84c3b171d41d', 'Zarządzanie sprzętem sieciowym', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 2, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'eda8f76f-414a-4abb-b2f1-7a97b49cbe53', 'IPv6', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 3, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'da10e215-beb9-41f6-9895-0a6b83ab9a79', 'IPv6 cz. II', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 4, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),

  -- Sieci komputerowe 2023
  ( '79d83df1-1fc1-4cc5-afe6-6cc9e0387221', 'Diagnostyka sieci IPv4', '981c68ba-3f6a-459e-83af-f9fc578adc85', 1, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '2a31cf55-f926-42e2-a985-50849bafe939', 'Zarządzanie sprzętem sieciowym', '981c68ba-3f6a-459e-83af-f9fc578adc85', 2, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'a263264d-1d2d-42de-939e-ee9553961b17', 'IPv6', '981c68ba-3f6a-459e-83af-f9fc578adc85', 3, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '805124e6-2595-4fe6-ad91-93f2a6c5762e', 'IPv6 cz. II', '981c68ba-3f6a-459e-83af-f9fc578adc85', 4, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' );

INSERT INTO laboratory_groups (id, name, subject_id)
VALUES
  ( 'bb9309c2-6a67-4f65-bcc9-fa9547d9ffe9', 'inf1a', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( '1bae5961-9ad4-4cfc-8240-f213deea65a4', 'inf1b', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( 'edf46299-620d-4ce7-9495-ad52ae6553b4', 'inf2a', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( '4dd6eb8b-94e0-4d04-8cc7-bdbcf873bea8', 'inf2b', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( '155fefc9-2702-428a-b8c2-be492233b037', 'inf3a', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( '88a0b530-7535-455c-8d20-385acce8a728', 'inf3b', '25108321-0391-4c7a-b4d8-5ea20388e813' );
