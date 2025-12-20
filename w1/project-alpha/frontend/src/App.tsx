import React, { useEffect } from 'react'
import Layout from './components/layout/Layout'
import { useTicketStore } from './store/ticket.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

function App() {
  const { fetchTickets, tickets, loading } = useTicketStore()

  useEffect(() => {
    fetchTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">欢迎使用 Project Alpha</h2>
          <p className="text-muted-foreground mt-2">
            这是一个基于标签的 Ticket 管理工具。前端使用 React + TypeScript + Tailwind CSS 构建。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>项目进度</CardTitle>
            <CardDescription>当前开发阶段完成情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Phase 1 ✅ 已完成：</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                  <li>项目目录结构搭建</li>
                  <li>数据库设计与初始化脚本</li>
                  <li>后端基础配置</li>
                  <li>前端基础配置</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Phase 2 ✅ 已完成：</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                  <li>后端 API 开发</li>
                  <li>Service 层实现</li>
                  <li>Controller 层实现</li>
                  <li>路由配置</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Phase 3 ✅ 已完成：</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                  <li>前端基础架构</li>
                  <li>API 服务层</li>
                  <li>状态管理</li>
                  <li>布局组件</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据统计</CardTitle>
            <CardDescription>当前系统中的 Ticket 数量</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">加载中...</p>
            ) : (
              <p className="text-2xl font-bold">{tickets.length} 个 Tickets</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default App
