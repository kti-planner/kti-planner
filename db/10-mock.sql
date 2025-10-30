INSERT INTO users (id, name, email, password_hash, role)
VALUES (
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
  ( '094f8324-7c58-4566-b5d7-e4fe8ed03a18', 2024, 'summer', '2025-02-24', '2025-06-15' ),
  ( 'b2805b48-3d24-4169-8f67-88561345ee99', 2025, 'winter', '2025-10-01', '2026-01-30' );

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
  ( '8689d55d-508e-4f5d-aef8-d5052f220d20', 'EA 204' );

INSERT INTO subjects (id, name, semester_id, teacher_ids, description, moodle_course_id)
VALUES
  ( '60bd04c7-b83c-4b4d-8668-7bad4ea0a800', 'Lokalne sieci bezprzewodowe - Informatyka sem. VI', 'a4560e99-9aa0-4c3e-9a6d-73c63b847d2e', '{c393c524-453c-4b02-bfad-5114fe828200,feeaa186-3d69-4801-a580-88be10d53553}', '', '' ),
  ( 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 'Sieci komputerowe - Informatyka sem. V', '50138012-1f54-43a6-b5fd-8efea42020a9', '{c393c524-453c-4b02-bfad-5114fe828200}', '[Wyniki](http://wyniki.kti.gda.pl/?nazwa=2024Z-SK-I)', '' ),
  ( '25108321-0391-4c7a-b4d8-5ea20388e813', 'Lokalne sieci bezprzewodowe - Informatyka sem. VI', '094f8324-7c58-4566-b5d7-e4fe8ed03a18', '{c393c524-453c-4b02-bfad-5114fe828200,feeaa186-3d69-4801-a580-88be10d53553}', '', '' ),
  ( '3f58b671-5b38-43f8-bf0f-49d93048c52e', 'Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI', '094f8324-7c58-4566-b5d7-e4fe8ed03a18', '{c393c524-453c-4b02-bfad-5114fe828200,feeaa186-3d69-4801-a580-88be10d53553}', '', '' ),
  ( '981c68ba-3f6a-459e-83af-f9fc578adc85', 'Sieci komputerowe - Informatyka sem. V', 'b2805b48-3d24-4169-8f67-88561345ee99', '{c393c524-453c-4b02-bfad-5114fe828200}', '', '' ),
  ( '9068cb5a-fe4b-4b93-af91-7050e61eceeb', 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V', 'b2805b48-3d24-4169-8f67-88561345ee99', '{c393c524-453c-4b02-bfad-5114fe828200,feeaa186-3d69-4801-a580-88be10d53553}', '', '' );

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
  ( '89a84652-0f57-4955-b320-eb04fe31bf51', 'Tunele IPv6 i IPSec', '3f58b671-5b38-43f8-bf0f-49d93048c52e', 4, NULL, 'feeaa186-3d69-4801-a580-88be10d53553' ),

  -- Sieci komputerowe 2024
  ( 'ca7b29d6-3920-4566-8836-6045f6191b54', 'Diagnostyka sieci IPv4', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 1, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'd9ca226b-16c8-40db-8997-84c3b171d41d', 'Zarządzanie sprzętem sieciowym', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 2, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'eda8f76f-414a-4abb-b2f1-7a97b49cbe53', 'IPv6', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 3, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'da10e215-beb9-41f6-9895-0a6b83ab9a79', 'IPv6 cz. II', 'cfaa8255-992f-405e-9064-dd8baf9dfde3', 4, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),

  -- Sieci komputerowe 2025
  ( '79d83df1-1fc1-4cc5-afe6-6cc9e0387221', 'Diagnostyka sieci IPv4', '981c68ba-3f6a-459e-83af-f9fc578adc85', 1, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '2a31cf55-f926-42e2-a985-50849bafe939', 'Zarządzanie sprzętem sieciowym', '981c68ba-3f6a-459e-83af-f9fc578adc85', 2, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'a263264d-1d2d-42de-939e-ee9553961b17', 'IPv6', '981c68ba-3f6a-459e-83af-f9fc578adc85', 3, '8689d55d-508e-4f5d-aef8-d5052f220d20', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '805124e6-2595-4fe6-ad91-93f2a6c5762e', 'IPv6 cz. II', '981c68ba-3f6a-459e-83af-f9fc578adc85', 4, '8689d55d-508e-4f5d-aef8-d5052f220d20', 'c393c524-453c-4b02-bfad-5114fe828200' ),

  -- Wstęp do sieci komputerowych 2025
  ( '042c7d5c-ba9c-4a01-bbd8-79e743829f4d', 'Diagnostyka sieci IPv4', '9068cb5a-fe4b-4b93-af91-7050e61eceeb', 1, '8689d55d-508e-4f5d-aef8-d5052f220d20', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( 'ab126bb5-d52a-4ec7-b199-ab1d73177c80', 'Zarządzanie sprzętem sieciowym', '9068cb5a-fe4b-4b93-af91-7050e61eceeb', 2, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( 'ccef8e62-4de9-4aa3-8a75-70276aab7ee4', 'Routing Statyczny', '9068cb5a-fe4b-4b93-af91-7050e61eceeb', 3, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'feeaa186-3d69-4801-a580-88be10d53553' ),
  ( '8b3ddf60-a307-46fe-a53a-c79f44161946', 'WiFi Sieci bezprzewodowe standardu 802.11', '9068cb5a-fe4b-4b93-af91-7050e61eceeb', 4, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( 'fc48900f-fd81-45a6-8878-5044076c0c06', 'Wirtualne sieci lokalne (VLAN)', '9068cb5a-fe4b-4b93-af91-7050e61eceeb', 5, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' ),
  ( '019e221d-85fe-4d00-afbc-c81b609ad252', 'Bezpieczeństwo sieci standardów 802.11', '9068cb5a-fe4b-4b93-af91-7050e61eceeb', 6, '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'c393c524-453c-4b02-bfad-5114fe828200' );

INSERT INTO laboratory_groups (id, name, subject_id)
VALUES
  -- Lokalne sieci bezprzewodowe 2024
  ( 'bb9309c2-6a67-4f65-bcc9-fa9547d9ffe9', '5A', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( '1bae5961-9ad4-4cfc-8240-f213deea65a4', '5B', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( 'edf46299-620d-4ce7-9495-ad52ae6553b4', '6A', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( '4dd6eb8b-94e0-4d04-8cc7-bdbcf873bea8', '6B', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( '155fefc9-2702-428a-b8c2-be492233b037', '7A', '25108321-0391-4c7a-b4d8-5ea20388e813' ),
  ( '88a0b530-7535-455c-8d20-385acce8a728', '7B', '25108321-0391-4c7a-b4d8-5ea20388e813' ),

  -- Lokalne sieci bezprzewodowe 2023
  ( '8c90429c-f950-4e3c-9431-94109a0b44e0', '5A', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800' ),
  ( '93982857-f764-4e4a-a6fb-e914e52090f0', '5B', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800' ),
  ( 'a82bbde7-b1f4-4550-9549-17579f4fbe93', '6A', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800' ),
  ( 'a2dfac24-6270-47a0-8017-a859508f1596', '6B', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800' ),
  ( 'c76e84b3-853b-46e8-956c-e4217105ce7a', '7A', '60bd04c7-b83c-4b4d-8668-7bad4ea0a800' ),

  -- Zarządzanie bezpieczeństwem sieci 2024
  ( '5716ab65-c00f-4314-a72d-2d8c3e7f986b', '1A', '3f58b671-5b38-43f8-bf0f-49d93048c52e' ),
  ( '5efc7df8-feea-492f-97f8-a1d9bd9740b4', '1B', '3f58b671-5b38-43f8-bf0f-49d93048c52e' ),
  ( 'd363bbde-bdeb-4724-a337-c9df24006abe', '2A', '3f58b671-5b38-43f8-bf0f-49d93048c52e' ),
  ( '318f9e58-4406-44b6-976a-3e139c99c8a6', '2B', '3f58b671-5b38-43f8-bf0f-49d93048c52e' ),
  ( 'bc2d78d7-6d25-43e3-9ec6-b3d55689b2c6', '3A', '3f58b671-5b38-43f8-bf0f-49d93048c52e' ),
  ( '1de3f581-294a-4204-a3c4-d5aec56a4424', '3B', '3f58b671-5b38-43f8-bf0f-49d93048c52e' ),

  -- Sieci komputerowe 2024
  ( '4726687c-d496-45b4-b261-42344b46528a', '1A', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( '84f99e4e-ef62-49bf-ac43-a1bf8e4da469', '1B', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( '03c928b3-f5b1-45d8-96b1-4a361b39b81c', '2A', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( 'e87c7530-59b7-4157-bca3-acac0801a63a', '2B', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( '23ca8659-9791-434e-a045-979cc3d3ea26', '3A', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( '20c8d7ef-f0c8-49b4-9b40-17d0bbfe12c1', '3B', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( '6a9e54a6-8c53-4a3b-a98e-c8f6df8ad5f9', '4A', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( 'a34cbb0c-3eb1-498e-b150-2259d4673a74', '4B', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( '46e9b773-6925-4310-b02d-2dbcc40ba8e1', '5A', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),
  ( '36c32075-472e-4ae1-84e9-d378972104ab', '5B', 'cfaa8255-992f-405e-9064-dd8baf9dfde3' ),

  -- Sieci komputerowe 2025
  ( 'c9854621-e713-4b3f-b442-8e8cbdb20b57', '1A', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '81f35756-28be-4942-bddf-d245d4deaab3', '1B', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '1e4f7873-0d68-48bc-bf3e-86f0073a0ee2', '2A', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '7fcc1ea8-fcf4-4a0e-a3cd-41391be3209e', '2B', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( 'f8699364-b9bf-4ec2-9efc-7fc1bf626a13', '3A', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '6b4259bb-228d-4bb1-ae75-809545c24812', '3B', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '85c2d03f-6a46-4a3b-a4ed-2b51d668676a', '4A', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '075f17f0-ed9c-4797-a605-75936d452f0d', '4B', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '7031ceff-0000-4d50-82de-bd4a781e9eea', '5A', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '4d20e187-ac48-45d0-927d-d9a4ea242029', '5B', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '52a97503-34a5-4a2b-ab4a-1acc9add64f5', '6A', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),
  ( '854e4921-c286-4b06-a713-16049ec5048d', '6B', '981c68ba-3f6a-459e-83af-f9fc578adc85' ),

  -- Wstęp do sieci komputerowych 2025
  ( '68d444cf-b67e-41ac-bc47-74dfcb5d031a', 'air1A', '9068cb5a-fe4b-4b93-af91-7050e61eceeb' ),
  ( '92145d11-c173-417e-af93-b1a3fab0249c', 'air1B', '9068cb5a-fe4b-4b93-af91-7050e61eceeb' ),
  ( '5dfe45ea-7a6a-4192-a58b-7541494856eb', 'air2A', '9068cb5a-fe4b-4b93-af91-7050e61eceeb' ),
  ( '35ac8c7d-737c-4155-9c6d-9be5b6908c5a', 'air2B', '9068cb5a-fe4b-4b93-af91-7050e61eceeb' ),
  ( '0fa2f183-4d9c-4441-8382-ae6955a6905e', 'ib1A', '9068cb5a-fe4b-4b93-af91-7050e61eceeb' ),
  ( '36e0f0ca-e87f-434a-a8b5-fb89e177191a', 'ib1B', '9068cb5a-fe4b-4b93-af91-7050e61eceeb' );

INSERT INTO laboratory_classes (id, exercise_id, laboratory_group_id, start_date, end_date, teacher_id)
VALUES
  -- Sieci komputerowe 2025, Group 1A
  ('05c03885-dca8-481e-a635-511024503acd', '79d83df1-1fc1-4cc5-afe6-6cc9e0387221', 'c9854621-e713-4b3f-b442-8e8cbdb20b57', '2025-10-01 11:15 Europe/Warsaw', '2025-10-01 13:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('bab85007-4fdc-4171-8de7-9700a9a8f775', '2a31cf55-f926-42e2-a985-50849bafe939', 'c9854621-e713-4b3f-b442-8e8cbdb20b57', '2025-10-08 11:15 Europe/Warsaw', '2025-10-08 13:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('c37a7353-42e9-4049-a372-41aa54ff25e6', 'a263264d-1d2d-42de-939e-ee9553961b17', 'c9854621-e713-4b3f-b442-8e8cbdb20b57', '2025-10-15 11:15 Europe/Warsaw', '2025-10-15 13:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('c083bfab-f681-431e-a863-1298fb97bc67', '805124e6-2595-4fe6-ad91-93f2a6c5762e', 'c9854621-e713-4b3f-b442-8e8cbdb20b57', '2025-10-22 11:15 Europe/Warsaw', '2025-10-22 13:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),

  -- Sieci komputerowe 2025, Group 1B
  ('60e5b9be-5f25-4ec8-aee6-e3eee103e4b8', '79d83df1-1fc1-4cc5-afe6-6cc9e0387221', '81f35756-28be-4942-bddf-d245d4deaab3', '2025-10-03 09:15 Europe/Warsaw', '2025-10-03 11:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('ba17115d-c7c5-4ebe-b1b2-5a2ed8823582', '2a31cf55-f926-42e2-a985-50849bafe939', '81f35756-28be-4942-bddf-d245d4deaab3', '2025-10-10 09:15 Europe/Warsaw', '2025-10-10 11:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('e972e1db-19c1-4dad-868f-6374d42656eb', 'a263264d-1d2d-42de-939e-ee9553961b17', '81f35756-28be-4942-bddf-d245d4deaab3', '2025-10-17 09:15 Europe/Warsaw', '2025-10-17 11:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('c9fdec5d-f716-4d24-bd1b-04b54b38363a', '805124e6-2595-4fe6-ad91-93f2a6c5762e', '81f35756-28be-4942-bddf-d245d4deaab3', '2025-10-24 09:15 Europe/Warsaw', '2025-10-24 11:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),

  -- Wstęp do sieci komputerowych 2025, Group air2A
  ('a3394a83-72db-485c-92b6-3fcb7c8cfaba', '042c7d5c-ba9c-4a01-bbd8-79e743829f4d', '5dfe45ea-7a6a-4192-a58b-7541494856eb', '2025-10-07 13:15 Europe/Warsaw', '2025-10-07 15:00 Europe/Warsaw', 'feeaa186-3d69-4801-a580-88be10d53553'),
  ('bf4aee3a-a5b1-4ad3-91ac-0cdb71100efe', 'ab126bb5-d52a-4ec7-b199-ab1d73177c80', '5dfe45ea-7a6a-4192-a58b-7541494856eb', '2025-10-14 13:15 Europe/Warsaw', '2025-10-14 15:00 Europe/Warsaw', 'feeaa186-3d69-4801-a580-88be10d53553'),
  ('bf2f5e3c-6a66-4093-af30-e2134841f982', 'ccef8e62-4de9-4aa3-8a75-70276aab7ee4', '5dfe45ea-7a6a-4192-a58b-7541494856eb', '2025-10-21 13:15 Europe/Warsaw', '2025-10-21 15:00 Europe/Warsaw', 'feeaa186-3d69-4801-a580-88be10d53553'),
  ('82e69073-e8a5-413e-8d6e-98f20748cddb', '8b3ddf60-a307-46fe-a53a-c79f44161946', '5dfe45ea-7a6a-4192-a58b-7541494856eb', '2025-10-28 13:15 Europe/Warsaw', '2025-10-28 15:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('f6f23cbd-3868-4030-8786-a8883ee44249', 'fc48900f-fd81-45a6-8878-5044076c0c06', '5dfe45ea-7a6a-4192-a58b-7541494856eb', '2025-11-04 13:15 Europe/Warsaw', '2025-11-04 15:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('76911161-3f86-45fa-902a-f7002d883a6d', '019e221d-85fe-4d00-afbc-c81b609ad252', '5dfe45ea-7a6a-4192-a58b-7541494856eb', '2025-11-18 13:15 Europe/Warsaw', '2025-11-18 15:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),

  -- Wstęp do sieci komputerowych 2025, Group air2B
  ('90a2d2d5-1b59-4f73-9011-718db2344b28', '042c7d5c-ba9c-4a01-bbd8-79e743829f4d', '35ac8c7d-737c-4155-9c6d-9be5b6908c5a', '2025-10-01 09:15 Europe/Warsaw', '2025-10-01 11:00 Europe/Warsaw', 'feeaa186-3d69-4801-a580-88be10d53553'),
  ('0efbdbb9-3e85-4ad8-93e6-c64ef65a2c2b', 'ab126bb5-d52a-4ec7-b199-ab1d73177c80', '35ac8c7d-737c-4155-9c6d-9be5b6908c5a', '2025-10-08 09:15 Europe/Warsaw', '2025-10-08 11:00 Europe/Warsaw', 'feeaa186-3d69-4801-a580-88be10d53553'),
  ('34b0cc55-5766-4e32-979b-bba6eb765b58', 'ccef8e62-4de9-4aa3-8a75-70276aab7ee4', '35ac8c7d-737c-4155-9c6d-9be5b6908c5a', '2025-10-15 09:15 Europe/Warsaw', '2025-10-15 11:00 Europe/Warsaw', 'feeaa186-3d69-4801-a580-88be10d53553'),
  ('cd998c22-c9a7-4d89-b5c9-9018c435a72e', '8b3ddf60-a307-46fe-a53a-c79f44161946', '35ac8c7d-737c-4155-9c6d-9be5b6908c5a', '2025-10-22 09:15 Europe/Warsaw', '2025-10-22 11:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('f8759326-af65-4e7c-975b-802cc8c6fa31', 'fc48900f-fd81-45a6-8878-5044076c0c06', '35ac8c7d-737c-4155-9c6d-9be5b6908c5a', '2025-10-29 09:15 Europe/Warsaw', '2025-10-29 11:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200'),
  ('5c7eff85-77a9-445d-8425-d54190e9a74a', '019e221d-85fe-4d00-afbc-c81b609ad252', '35ac8c7d-737c-4155-9c6d-9be5b6908c5a', '2025-11-05 09:15 Europe/Warsaw', '2025-11-05 11:00 Europe/Warsaw', 'c393c524-453c-4b02-bfad-5114fe828200');

INSERT INTO calendar_events (id, name, user_id, classroom_id, semester_id, start_date, end_date)
VALUES
  -- Winter 2025/2026
  ('3dbd9654-e207-4c36-8c31-5e3ff4ef9187', 'Koło naukowe', 'feeaa186-3d69-4801-a580-88be10d53553', '8689d55d-508e-4f5d-aef8-d5052f220d20', 'b2805b48-3d24-4169-8f67-88561345ee99', '2025-10-02 11:15 Europe/Warsaw', '2025-10-02 13:00 Europe/Warsaw'),
  ('5cef97c4-436d-4775-b05f-d144c9a84023', 'Koło naukowe', 'feeaa186-3d69-4801-a580-88be10d53553', '8689d55d-508e-4f5d-aef8-d5052f220d20', 'b2805b48-3d24-4169-8f67-88561345ee99', '2025-10-09 11:15 Europe/Warsaw', '2025-10-09 13:00 Europe/Warsaw'),
  ('4357dae8-7d60-4444-8578-a737069b31e3', 'Szkolenie', 'c393c524-453c-4b02-bfad-5114fe828200', '2affdc99-7dd6-47f0-b26c-3c413bf063dd', 'b2805b48-3d24-4169-8f67-88561345ee99', '2025-10-03 14:15 Europe/Warsaw', '2025-10-03 17:00 Europe/Warsaw');
