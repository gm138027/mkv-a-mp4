# MKV→MP4 在线转换工具

这是一个基于 [Next.js](https://nextjs.org) 的 MKV 到 MP4 在线转换工具，支持多语言界面，默认为西班牙语。

## 🚀 功能特性

- **文件转换**: MKV 转 MP4，保持视频和音频质量
- **字幕支持**: 自动处理软字幕转换
- **多语言**: 支持西班牙语、英语、日语、法语、德语
- **异步处理**: 后台转换，实时进度反馈
- **文件清理**: 自动清理临时文件，保护用户隐私

## 🛠️ 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes + Node.js
- **转换引擎**: FFmpeg
- **状态管理**: React useReducer
- **文件处理**: Node.js fs/promises

## 📦 快速开始

### 环境要求
- Node.js 18+
- FFmpeg (需要在系统PATH中)

### 安装依赖
```bash
npm install
```

### 环境配置
```bash
cp .env.example .env.local
# 编辑 .env.local 设置必要的环境变量
```

### 启动开发服务器
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🗂️ 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── upload/        # 文件上传
│   │   ├── status/        # 任务状态查询
│   │   ├── download/      # 文件下载
│   │   └── admin/         # 管理API
│   ├── components/        # React 组件
│   └── hooks/            # 自定义 Hooks
├── lib/                   # 核心库
│   ├── tasks/            # 任务管理系统
│   │   ├── cleanup.ts    # 文件清理
│   │   ├── conversion.ts # FFmpeg 转换
│   │   └── scheduler.ts  # 定时任务
│   └── config.ts         # 配置文件
└── storage/              # 文件存储 (临时)
    ├── uploads/          # 上传文件
    ├── outputs/          # 输出文件
    └── tasks/           # 任务记录
```

## 🧹 文件清理系统

为了保护用户隐私和管理存储空间，项目实现了自动文件清理系统：

- **自动清理**: 转换完成后自动清理临时文件
- **定时清理**: 定期清理过期文件（每30分钟）
- **后台运行**: 无需人工干预，全自动运行

详细说明请查看 [文件清理系统文档](docs/cleanup-system.md)

## 🧪 测试

```bash
# TypeScript 类型检查
npm run lint

# 代码格式化
npm run format
```

## 📚 文档

- [项目规范文档](docs/project-spec.md) - 完整的项目需求和设计文档
- [文件清理系统](docs/cleanup-system.md) - 清理系统详细说明

## 🚀 部署

### 环境变量配置
```bash
# 启用清理调度器
ENABLE_CLEANUP_SCHEDULER=true

# 生产环境
NODE_ENV=production
```

### 部署注意事项
1. 确保服务器安装了 FFmpeg
2. 配置适当的文件权限
3. 设置定时清理任务
4. 监控存储空间使用

## 🔒 安全和隐私

- 文件仅用于转换，不做持久存储
- 转换完成后自动删除临时文件
- 支持手动清理和定时清理
- 不收集用户个人信息

## 📄 许可证

本项目采用 MIT 许可证。
