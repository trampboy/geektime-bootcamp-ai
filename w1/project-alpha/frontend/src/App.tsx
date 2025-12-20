import React, { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import { useTicketStore } from './store/ticket.store'
import TicketList from './components/ticket/TicketList'
import TicketForm from './components/ticket/TicketForm'
import SearchBar from './components/search/SearchBar'
import FilterBar from './components/search/FilterBar'
import { Button } from './components/ui/button'
import { Plus } from 'lucide-react'
import { Ticket } from './types'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/useToast'
import { ConfirmDialog } from './components/ui/confirm-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog'

function App() {
  const { tickets, loading, filters, setFilters, fetchTickets, deleteTicket } = useTicketStore()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
  const [deletingTicket, setDeletingTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    fetchTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    toast({
      title: '创建成功',
      description: 'Ticket 已成功创建',
    })
  }

  const handleEditSuccess = () => {
    setEditingTicket(null)
    toast({
      title: '更新成功',
      description: 'Ticket 已成功更新',
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deletingTicket) return

    try {
      await deleteTicket(deletingTicket.id)
      toast({
        title: '删除成功',
        description: 'Ticket 已成功删除',
      })
      setDeletingTicket(null)
    } catch (error: any) {
      toast({
        title: '删除失败',
        description: error.message || '删除 Ticket 时发生错误',
        variant: 'destructive',
      })
    }
  }

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search })
  }

  const handleStatusChange = (status: 'pending' | 'completed' | 'all') => {
    setFilters({ ...filters, status })
  }

  return (
    <>
      <Layout>
        <div className="space-y-6">
          {/* 头部操作栏 */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
              <p className="text-muted-foreground mt-1">
                管理你的任务和待办事项
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新建 Ticket
            </Button>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={filters.search || ''}
                onChange={handleSearchChange}
              />
            </div>
            <FilterBar
              status={filters.status || 'all'}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Ticket 列表 */}
          <TicketList
            tickets={tickets}
            loading={loading}
            onEdit={setEditingTicket}
            onDelete={setDeletingTicket}
          />
        </div>
      </Layout>

      {/* 创建 Ticket 对话框 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建新 Ticket</DialogTitle>
            <DialogDescription>创建一个新的 Ticket 来管理你的任务</DialogDescription>
          </DialogHeader>
          <TicketForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* 编辑 Ticket 对话框 */}
      {editingTicket && (
        <Dialog open={!!editingTicket} onOpenChange={(open) => !open && setEditingTicket(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>编辑 Ticket</DialogTitle>
              <DialogDescription>更新 Ticket 信息</DialogDescription>
            </DialogHeader>
            <TicketForm
              ticket={editingTicket}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingTicket(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* 删除确认对话框 */}
      <ConfirmDialog
        open={!!deletingTicket}
        onOpenChange={(open) => !open && setDeletingTicket(null)}
        title="确认删除"
        description={`确定要删除 Ticket "${deletingTicket?.title}" 吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />

      {/* Toast 通知 */}
      <Toaster />
    </>
  )
}

export default App
