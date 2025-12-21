# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - heading "Database Query Tool" [level=1] [ref=e6]
    - link "查询页面" [ref=e8] [cursor=pointer]:
      - /url: /query
  - generic [ref=e9]: Failed to fetch
  - generic [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - heading "Add Database" [level=2] [ref=e13]
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: Database Name
            - textbox "Database Name" [ref=e17]:
              - /placeholder: e.g., my-database
          - generic [ref=e18]:
            - generic [ref=e19]: Connection URL
            - textbox "Connection URL" [ref=e20]:
              - /placeholder: mysql://user:password@host:port/database
          - button "Add Database" [ref=e21] [cursor=pointer]
      - generic [ref=e22]: No databases added yet. Add a database to get started.
    - generic [ref=e25]: Select a database to view metadata
```