# 说明

# 宪法

这是针对 ./w2/db_query 项目的:

- 前后端都使用 TypeScript 进行开发
- 前后端都要有严格的类型标注
- 所有后端生成的 JSON 数据，使用 camelCase 进行命名
- 不需要认证系统，任何用户都可以使用

## 基本思路
### specify
这是一个数据库查询工具，用户可以添加一个 db url，系统会连接到本地的 mysql 数据库，获取到数据库的 metadata，然后将数据库中的 table 和 view 的信息展示给用户，然后用户可以自己输入 sql 查询，也可以通过自然语言来生成 sql 查询

基本思想:

- 数据库连接字符串和数据库的 metadata 会存储到 sqlite 数据库中，我们可以根据 MySQL 的功能来查询系统中的表和视图的信息，然后用 LLM 来将这些信息转换成 json 格式，存储到 sqlite 数据库中，这个信息以后可以复用。
- 当用户使用 LLM 来生成 sql 查询时，我们可以把系统中的表和视图作为 context 传递给 LLM，然后 LLM 会根据 context 来生成 sql 查询。
- 任何输入的 sql 语句，都需要经过 sqlparser 解析，确保语法正确，并且仅包含 select 语句。如果语法不正确，需要给出错误信息。
    - 如果查询不包含 limit 子句，则默认添加 limit 1000 子句。
- 输出格式是 json，前端将其组织成表格，并显示出来。


### plan
后端使用 Node.js + Express.js + TypeScript + openai sdk 进行开发。
前端使用 React + TypeScript + Vite + Tailwind CSS + Shadcn/ui 进行开发。sql editor 使用 monaco editor 实现。

OpenAI API KEY 在变量环境 OPENAI_API_KEY 中。数据库连接和 metadata 信息存储在 sqlite 数据库中，数据库文件名是 db_query.db，存储在./w2/db_query/data 目录下。

后端 API 需要支持 cors，允许所有的 origin。大致 API 如下:

```bash
# 获取所有已存储的数据库
GET /api/v1/dbs
# 添加一个数据库
PUT /api/v1/dbs/{name}

{
  "url": "mysql://root:123456@localhost:3306/test"
}

# 获取一个数据库的 metadata
GET /api/v1/dbs/{name}

# 查询某个数据库的信息
POST /api/v1/dbs/{name}/query

{
  "sql": "SELECT * FROM users"
}

# 根据自然语言生成 sql
POST /api/v1/dbs/{name}/query/natural

{
  "prompt": "查询用户表的所有信息"
}
```

## e2e 测试


## 提交 PR
submit pr

## 配置 github 仓库自动化构建和部署
根据项目，帮我配置完善的 GitHub 仓库自动化设置