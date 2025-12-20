import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary">Project Alpha</h1>
          <p className="text-muted-foreground mt-2">Ticket 管理系统</p>
        </header>
        
        <main>
          <div className="bg-card rounded-lg shadow-md p-6 border">
            <h2 className="text-2xl font-semibold mb-4">欢迎使用 Project Alpha</h2>
            <p className="text-muted-foreground">
              这是一个基于标签的 Ticket 管理工具。前端使用 React + TypeScript + Tailwind CSS 构建。
            </p>
            <div className="mt-6 p-4 bg-muted rounded-md">
              <p className="font-medium">Phase 1 已完成：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>项目目录结构搭建</li>
                <li>数据库设计与初始化脚本</li>
                <li>后端基础配置</li>
                <li>前端基础配置</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
