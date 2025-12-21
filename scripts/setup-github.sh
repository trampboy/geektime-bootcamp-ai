#!/bin/bash

# GitHub 仓库设置辅助脚本
# 用于验证和配置 GitHub 仓库

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印彩色信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# 函数：检查命令是否存在
check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 已安装"
        return 0
    else
        print_error "$1 未安装"
        return 1
    fi
}

# 函数：检查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        print_success "文件存在: $1"
        return 0
    else
        print_error "文件不存在: $1"
        return 1
    fi
}

# 函数：检查目录是否存在
check_directory() {
    if [ -d "$1" ]; then
        print_success "目录存在: $1"
        return 0
    else
        print_error "目录不存在: $1"
        return 1
    fi
}

echo ""
echo "=========================================="
echo "  GitHub 仓库设置验证脚本"
echo "=========================================="
echo ""

# 1. 检查必需的命令
print_info "步骤 1: 检查必需的命令..."
echo ""

COMMANDS=("git" "node" "npm")
MISSING_COMMANDS=0

for cmd in "${COMMANDS[@]}"; do
    if ! check_command $cmd; then
        MISSING_COMMANDS=$((MISSING_COMMANDS + 1))
    fi
done

if [ $MISSING_COMMANDS -gt 0 ]; then
    print_error "缺少 $MISSING_COMMANDS 个必需的命令"
    exit 1
fi

echo ""

# 2. 检查 Git 仓库
print_info "步骤 2: 检查 Git 仓库..."
echo ""

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "当前目录不是 Git 仓库"
    exit 1
fi

print_success "Git 仓库验证通过"

# 检查是否有远程仓库
if git remote -v | grep -q "origin"; then
    REMOTE_URL=$(git remote get-url origin)
    print_success "远程仓库: $REMOTE_URL"
else
    print_warning "未配置远程仓库"
fi

echo ""

# 3. 检查 GitHub 配置文件
print_info "步骤 3: 检查 GitHub 配置文件..."
echo ""

CONFIG_FILES=(
    ".github/workflows/ci.yml"
    ".github/workflows/codeql.yml"
    ".github/workflows/pr-checks.yml"
    ".github/workflows/release.yml"
    ".github/dependabot.yml"
    ".github/PULL_REQUEST_TEMPLATE.md"
    ".github/ISSUE_TEMPLATE/bug_report.yml"
    ".github/ISSUE_TEMPLATE/feature_request.yml"
)

MISSING_FILES=0

for file in "${CONFIG_FILES[@]}"; do
    if ! check_file "$file"; then
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    print_warning "缺少 $MISSING_FILES 个配置文件"
else
    print_success "所有配置文件都存在"
fi

echo ""

# 4. 检查项目结构
print_info "步骤 4: 检查项目结构..."
echo ""

REQUIRED_DIRS=(
    "w2/db_query/backend"
    "w2/db_query/frontend"
    "e2e"
)

MISSING_DIRS=0

for dir in "${REQUIRED_DIRS[@]}"; do
    if ! check_directory "$dir"; then
        MISSING_DIRS=$((MISSING_DIRS + 1))
    fi
done

if [ $MISSING_DIRS -gt 0 ]; then
    print_error "缺少 $MISSING_DIRS 个必需的目录"
else
    print_success "项目结构验证通过"
fi

echo ""

# 5. 检查依赖
print_info "步骤 5: 检查依赖..."
echo ""

# 检查根目录依赖
if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ]; then
        print_warning "根目录依赖未安装，运行: npm install"
    else
        print_success "根目录依赖已安装"
    fi
fi

# 检查 Backend 依赖
if [ -f "w2/db_query/backend/package.json" ]; then
    if [ ! -d "w2/db_query/backend/node_modules" ]; then
        print_warning "Backend 依赖未安装，运行: cd w2/db_query/backend && npm install"
    else
        print_success "Backend 依赖已安装"
    fi
fi

# 检查 Frontend 依赖
if [ -f "w2/db_query/frontend/package.json" ]; then
    if [ ! -d "w2/db_query/frontend/node_modules" ]; then
        print_warning "Frontend 依赖未安装，运行: cd w2/db_query/frontend && npm install"
    else
        print_success "Frontend 依赖已安装"
    fi
fi

echo ""

# 6. GitHub CLI 检查（可选）
print_info "步骤 6: 检查 GitHub CLI (可选)..."
echo ""

if check_command "gh"; then
    # 检查是否已登录
    if gh auth status &> /dev/null; then
        print_success "GitHub CLI 已登录"
        
        # 显示仓库信息
        if gh repo view &> /dev/null; then
            REPO_INFO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
            print_success "当前仓库: $REPO_INFO"
        fi
    else
        print_warning "GitHub CLI 未登录，运行: gh auth login"
    fi
else
    print_warning "GitHub CLI 未安装（可选）"
    print_info "安装方法: https://cli.github.com/"
fi

echo ""

# 7. 生成设置检查清单
print_info "步骤 7: GitHub 仓库设置检查清单..."
echo ""

print_info "请在 GitHub 仓库设置中确认以下项："
echo ""
echo "  □ Actions 已启用"
echo "  □ Issues 已启用"
echo "  □ PR 默认为 Squash merge"
echo "  □ 自动删除已合并的分支"
echo "  □ main 分支保护已配置"
echo "  □ Dependabot 已启用"
echo "  □ Secret scanning 已启用（如可用）"
echo "  □ CODECOV_TOKEN 已配置（如使用 Codecov）"
echo ""

print_info "详细设置说明请查看: .github/SETUP.md"
echo ""

# 8. 总结
echo "=========================================="
echo "  验证完成"
echo "=========================================="
echo ""

if [ $MISSING_COMMANDS -eq 0 ] && [ $MISSING_FILES -eq 0 ] && [ $MISSING_DIRS -eq 0 ]; then
    print_success "✓ 所有检查通过！"
    echo ""
    print_info "下一步："
    echo "  1. 查看 .github/SETUP.md 完成 GitHub 仓库设置"
    echo "  2. 配置必需的 Secrets (如 CODECOV_TOKEN)"
    echo "  3. 配置分支保护规则"
    echo "  4. 创建测试 PR 验证 CI 流程"
else
    print_warning "⚠ 发现一些问题，请查看上面的详细信息"
    echo ""
    print_info "解决方案："
    echo "  - 安装缺少的命令"
    echo "  - 重新运行自动化配置脚本"
    echo "  - 查看文档: .github/AUTOMATION_SUMMARY.md"
fi

echo ""
