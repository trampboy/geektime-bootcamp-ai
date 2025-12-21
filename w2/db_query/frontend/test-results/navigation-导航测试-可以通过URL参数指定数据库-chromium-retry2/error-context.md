# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "SQL 查询" [level=1] [ref=e6]
      - generic [ref=e7]:
        - combobox [ref=e8]:
          - option "选择数据库" [selected]
        - button "执行查询" [disabled] [ref=e9]
    - generic [ref=e10]: Failed to fetch
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - button "SQL 查询" [ref=e14] [cursor=pointer]
          - button "自然语言查询" [ref=e15] [cursor=pointer]
        - generic [ref=e16]:
          - heading "SQL 编辑器" [level=2] [ref=e17]
          - generic [ref=e18]:
            - code [ref=e21]:
              - generic [ref=e22]:
                - textbox "Editor content" [ref=e23]
                - textbox [ref=e24]
                - generic [ref=e29]: "1"
            - generic [ref=e36]: "提示: 按 Ctrl+Enter (Windows/Linux) 或 Cmd+Enter (Mac) 执行查询"
      - generic [ref=e37]:
        - heading "查询结果" [level=2] [ref=e38]
        - generic [ref=e39]:
          - generic [ref=e40]: 查询错误
          - generic [ref=e41]: Failed to fetch
  - generic [ref=e42]:
    - alert
    - alert
```