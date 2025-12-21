# Tasks: 数据库查询工具

**Input**: Design documents from `/specs/001-db-query-tool/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Note**: Per Constitution, all code MUST use TypeScript with strict type annotations. All JSON responses MUST use camelCase.

- [X] T001 Create project structure at w2/db_query/ per implementation plan (backend/, frontend/, data/)
- [X] T002 Initialize backend TypeScript project with Express.js dependencies in w2/db_query/backend/ (tsconfig.json with strict mode)
- [X] T003 Initialize frontend TypeScript project with React + Vite dependencies in w2/db_query/frontend/ (tsconfig.json with strict mode)
- [X] T004 [P] Configure backend TypeScript, ESLint and Prettier in w2/db_query/backend/
- [X] T005 [P] Configure frontend TypeScript, ESLint and Prettier in w2/db_query/frontend/
- [X] T006 [P] Install backend dependencies: express, mysql2, better-sqlite3, node-sql-parser, openai, cors in w2/db_query/backend/
- [X] T007 [P] Install frontend dependencies: react, react-dom, vite, tailwindcss, @monaco-editor/react, shadcn/ui in w2/db_query/frontend/
- [X] T008 Create data directory structure w2/db_query/data/ for SQLite database storage
- [X] T009 Setup environment configuration for OPENAI_API_KEY in w2/db_query/backend/.env.example

---

## Phase 2: User Story 1 - 添加数据库并查看元数据 (Priority: P1) 🎯 MVP

**Goal**: 用户能够添加MySQL数据库连接，系统自动获取并展示数据库中的表和视图信息

**Independent Test**: 添加一个测试数据库连接，验证系统能够成功连接、获取元数据并展示表和视图信息

### Implementation for User Story 1

#### Backend - Database & Models

- [ ] T010 [P] [US1] Create SQLite database initialization script in w2/db_query/backend/src/db/init.ts (create databases and metadata tables)
- [ ] T011 [P] [US1] Create Database model type definitions in w2/db_query/backend/src/models/database.ts (DatabaseConnection, DatabaseInfo interfaces with strict types)
- [ ] T012 [P] [US1] Create Metadata model type definitions in w2/db_query/backend/src/models/metadata.ts (DatabaseMetadata, TableMetadata, ColumnMetadata interfaces with strict types)
- [ ] T013 [US1] Implement SQLite database service in w2/db_query/backend/src/services/sqlite.service.ts (CRUD operations for databases and metadata tables)

#### Backend - MySQL Connection & Metadata

- [ ] T014 [US1] Implement MySQL connection string parser utility in w2/db_query/backend/src/utils/connection-parser.ts (parse mysql:// URL format)
- [ ] T015 [US1] Implement MySQL connection service in w2/db_query/backend/src/services/mysql.service.ts (connect, test connection, get metadata using INFORMATION_SCHEMA)
- [ ] T016 [US1] Implement metadata fetcher service in w2/db_query/backend/src/services/metadata-fetcher.service.ts (fetch tables, views, columns from MySQL)

#### Backend - API Endpoints

- [ ] T017 [US1] Implement GET /api/v1/dbs endpoint in w2/db_query/backend/src/api/databases.controller.ts (list all databases, return camelCase JSON)
- [ ] T018 [US1] Implement PUT /api/v1/dbs/{name} endpoint in w2/db_query/backend/src/api/databases.controller.ts (add/update database, connect and fetch metadata, return camelCase JSON)
- [ ] T019 [US1] Implement GET /api/v1/dbs/{name} endpoint in w2/db_query/backend/src/api/databases.controller.ts (get database metadata, return camelCase JSON)
- [ ] T020 [US1] Setup Express routes and CORS middleware in w2/db_query/backend/src/app.ts (allow all origins, mount /api/v1/dbs routes)
- [ ] T021 [US1] Implement error handling middleware in w2/db_query/backend/src/middleware/error-handler.ts (return camelCase ErrorResponse format)

#### Frontend - Types & Services

- [ ] T022 [P] [US1] Create TypeScript type definitions in w2/db_query/frontend/src/types/api.ts (DatabaseInfo, DatabaseMetadata, ErrorResponse with strict types)
- [ ] T023 [P] [US1] Create API client service in w2/db_query/frontend/src/services/api.ts (fetchDatabases, addDatabase, getDatabaseMetadata functions)

#### Frontend - Components & Pages

- [ ] T024 [US1] Create DatabaseList component in w2/db_query/frontend/src/components/DatabaseList.tsx (display list of databases)
- [ ] T025 [US1] Create AddDatabaseForm component in w2/db_query/frontend/src/components/AddDatabaseForm.tsx (form to add database connection)
- [ ] T026 [US1] Create MetadataView component in w2/db_query/frontend/src/components/MetadataView.tsx (display tables and views metadata)
- [ ] T027 [US1] Create main page component in w2/db_query/frontend/src/pages/MainPage.tsx (combine DatabaseList, AddDatabaseForm, MetadataView)
- [ ] T028 [US1] Setup React Router and main App component in w2/db_query/frontend/src/App.tsx (route to MainPage)
- [ ] T029 [US1] Configure Tailwind CSS and Shadcn/ui in w2/db_query/frontend/

**Checkpoint**: At this point, User Story 1 should be fully functional - users can add databases and view metadata independently

---

## Phase 3: User Story 2 & 3 - SQL查询和自然语言生成 (Priority: P2 + P3)

**Goal**: 
- US2: 用户能够输入SQL查询语句，系统验证语法并执行查询，返回结果以表格形式展示
- US3: 用户可以使用自然语言描述查询需求，系统自动生成对应的SQL查询语句并执行

**Independent Test**: 
- US2: 在已有数据库连接基础上，输入SQL查询语句，验证语法检查、执行和结果展示
- US3: 在已有数据库连接和元数据基础上，使用自然语言描述查询需求，验证SQL生成和查询结果

### Implementation for User Story 2 (SQL查询)

#### Backend - SQL Validation & Execution

- [ ] T030 [P] [US2] Create SQL parser utility in w2/db_query/backend/src/utils/sql-parser.ts (parse SQL, validate SELECT only, check/add LIMIT clause using node-sql-parser)
- [ ] T031 [US2] Implement SQL query executor service in w2/db_query/backend/src/services/query-executor.service.ts (execute SELECT queries, return results in camelCase format)
- [ ] T032 [US2] Implement QueryRequest and QueryResult type definitions in w2/db_query/backend/src/models/query.ts (strict TypeScript types)

#### Backend - API Endpoint

- [ ] T033 [US2] Implement POST /api/v1/dbs/{name}/query endpoint in w2/db_query/backend/src/api/queries.controller.ts (validate SQL, execute query, return camelCase QueryResult)

#### Frontend - Types & Services

- [ ] T034 [P] [US2] Add QueryRequest and QueryResult types to w2/db_query/frontend/src/types/api.ts
- [ ] T035 [P] [US2] Add executeQuery function to API client in w2/db_query/frontend/src/services/api.ts

#### Frontend - Components

- [ ] T036 [US2] Create SQL Editor component using Monaco Editor in w2/db_query/frontend/src/components/SqlEditor.tsx (SQL syntax highlighting, code editor)
- [ ] T037 [US2] Create QueryResultTable component in w2/db_query/frontend/src/components/QueryResultTable.tsx (display query results as table)
- [ ] T038 [US2] Create QueryPage component in w2/db_query/frontend/src/pages/QueryPage.tsx (combine SqlEditor and QueryResultTable)
- [ ] T039 [US2] Add QueryPage route to App.tsx in w2/db_query/frontend/src/App.tsx

**Checkpoint**: At this point, User Story 2 should be fully functional - users can execute SQL queries independently

### Implementation for User Story 3 (自然语言SQL生成)

#### Backend - LLM Integration

- [ ] T040 [P] [US3] Create OpenAI service wrapper in w2/db_query/backend/src/services/openai.service.ts (initialize OpenAI client, generate SQL from natural language)
- [ ] T041 [US3] Implement natural language to SQL generator service in w2/db_query/backend/src/services/nl-to-sql.service.ts (build prompt with metadata context, call OpenAI, validate generated SQL)
- [ ] T042 [US3] Add NaturalLanguageQueryRequest type definition in w2/db_query/backend/src/models/query.ts

#### Backend - API Endpoint

- [ ] T043 [US3] Implement POST /api/v1/dbs/{name}/query/natural endpoint in w2/db_query/backend/src/api/queries.controller.ts (generate SQL, execute query, return result with generated SQL)

#### Frontend - Types & Services

- [ ] T044 [P] [US3] Add NaturalLanguageQueryRequest type to w2/db_query/frontend/src/types/api.ts
- [ ] T045 [P] [US3] Add executeNaturalLanguageQuery function to API client in w2/db_query/frontend/src/services/api.ts

#### Frontend - Components

- [ ] T046 [US3] Create NaturalLanguageInput component in w2/db_query/frontend/src/components/NaturalLanguageInput.tsx (text input for natural language query)
- [ ] T047 [US3] Update QueryPage component in w2/db_query/frontend/src/pages/QueryPage.tsx (add natural language input option, display generated SQL)

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all be independently functional

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion - BLOCKS User Stories 2 & 3
- **User Stories 2 & 3 (Phase 3)**: Depend on User Story 1 completion (need database connections)
  - User Story 2 and User Story 3 can proceed in parallel within Phase 3 (different services/components)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after User Story 1 - Needs database connections and metadata
- **User Story 3 (P3)**: Can start after User Story 1 - Needs database connections and metadata, can use User Story 2's query executor

### Within Each User Story

- Backend models/types before services
- Services before API endpoints
- Frontend types/services before components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:
- T004, T005 can run in parallel (backend/frontend config)
- T006, T007 can run in parallel (backend/frontend dependencies)
- T004-T007 can all run in parallel (different files)

**Phase 2 (User Story 1)**:
- T010-T012 can run in parallel (different model files)
- T022-T023 can run in parallel (frontend types/services)
- T024-T026 can run in parallel (different frontend components)

**Phase 3 (User Stories 2 & 3)**:
- T030, T040 can run in parallel (different utility services)
- T034-T035, T044-T045 can run in parallel (frontend types/services)
- T036-T037, T046 can run in parallel (different frontend components)
- User Story 2 and User Story 3 backend tasks can run in parallel (different services)

---

## Parallel Example: Phase 2 (User Story 1)

```bash
# Launch all model definitions together:
Task: "Create Database model type definitions in w2/db_query/backend/src/models/database.ts"
Task: "Create Metadata model type definitions in w2/db_query/backend/src/models/metadata.ts"
Task: "Create TypeScript type definitions in w2/db_query/frontend/src/types/api.ts"
Task: "Create API client service in w2/db_query/frontend/src/services/api.ts"

# Launch all frontend components together (after models/services):
Task: "Create DatabaseList component in w2/db_query/frontend/src/components/DatabaseList.tsx"
Task: "Create AddDatabaseForm component in w2/db_query/frontend/src/components/AddDatabaseForm.tsx"
Task: "Create MetadataView component in w2/db_query/frontend/src/components/MetadataView.tsx"
```

---

## Parallel Example: Phase 3 (User Stories 2 & 3)

```bash
# Launch SQL parser and OpenAI service together:
Task: "Create SQL parser utility in w2/db_query/backend/src/utils/sql-parser.ts"
Task: "Create OpenAI service wrapper in w2/db_query/backend/src/services/openai.service.ts"

# Launch frontend types/services together:
Task: "Add QueryRequest and QueryResult types to w2/db_query/frontend/src/types/api.ts"
Task: "Add NaturalLanguageQueryRequest type to w2/db_query/frontend/src/types/api.ts"
Task: "Add executeQuery function to API client in w2/db_query/frontend/src/services/api.ts"
Task: "Add executeNaturalLanguageQuery function to API client in w2/db_query/frontend/src/services/api.ts"

# Launch frontend components together:
Task: "Create SQL Editor component using Monaco Editor in w2/db_query/frontend/src/components/SqlEditor.tsx"
Task: "Create QueryResultTable component in w2/db_query/frontend/src/components/QueryResultTable.tsx"
Task: "Create NaturalLanguageInput component in w2/db_query/frontend/src/components/NaturalLanguageInput.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently
   - Add a database connection
   - View database metadata
   - Verify tables and views are displayed correctly
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
   - Users can add databases and view metadata
3. Add User Story 2 → Test independently → Deploy/Demo
   - Users can execute SQL queries
4. Add User Story 3 → Test independently → Deploy/Demo
   - Users can use natural language to generate SQL
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup together
2. Once Setup is done:
   - Developer A: User Story 1 backend (models, services, API)
   - Developer B: User Story 1 frontend (components, pages)
3. Once User Story 1 is done:
   - Developer A: User Story 2 (SQL query execution)
   - Developer B: User Story 3 (Natural language SQL generation)
   - Both can work in parallel as they use different services

---

## Task Summary

**Total Tasks**: 47

**By Phase**:
- Phase 1 (Setup): 9 tasks
- Phase 2 (User Story 1): 20 tasks
- Phase 3 (User Stories 2 & 3): 18 tasks

**By User Story**:
- User Story 1: 20 tasks
- User Story 2: 10 tasks
- User Story 3: 8 tasks

**Parallel Opportunities**:
- Phase 1: 6 tasks can run in parallel
- Phase 2: 8 tasks can run in parallel
- Phase 3: 12 tasks can run in parallel

**Independent Test Criteria**:
- **User Story 1**: Add a test database connection, verify connection succeeds, verify metadata (tables/views) is displayed correctly
- **User Story 2**: Execute various SQL SELECT queries, verify syntax validation, verify results are displayed in table format
- **User Story 3**: Use natural language to describe queries, verify SQL is generated correctly, verify query executes and returns results

**Suggested MVP Scope**: User Story 1 only (Phase 1 + Phase 2) - provides core value of database connection and metadata viewing

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All TypeScript code MUST use strict type annotations (no `any` unless justified)
- All API responses MUST use camelCase naming convention
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Verify quickstart.md test scenarios after each phase
