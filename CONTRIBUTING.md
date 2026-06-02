# 贡献指南

感谢您考虑为 OIDC 联合登录 SDK 做贡献！

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发指南](#开发指南)
- [提交规范](#提交规范)
- [代码规范](#代码规范)
- [测试规范](#测试规范)

## 行为准则

本项目采用贡献者公约作为行为准则。参与此项目即表示您同意遵守其条款。请阅读 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 了解详情。

## 如何贡献

### 报告 Bug

如果您发现了 bug，请通过 [GitHub Issues](https://github.com/your-repo/oidc/issues) 提交报告。

提交 Bug 报告时，请包含：

1. **清晰的标题** - 简要描述问题
2. **详细描述** - 包含预期行为和实际行为
3. **复现步骤** - 提供详细的复现步骤
4. **环境信息** - 浏览器、操作系统、SDK 版本等
5. **截图** - 如果适用，添加截图帮助解释问题
6. **代码示例** - 提供最小化的代码示例

### 建议新功能

我们欢迎新功能建议！请通过 [GitHub Issues](https://github.com/your-repo/oidc/issues) 提交。

建议新功能时，请包含：

1. **功能描述** - 详细描述您希望添加的功能
2. **使用场景** - 说明该功能的使用场景
3. **预期效果** - 描述功能实现后的预期效果
4. **替代方案** - 描述您考虑过的替代方案

### 提交代码

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 开发指南

### 环境准备

```bash
# 克隆仓库
git clone https://github.com/your-repo/oidc.git

# 进入项目目录
cd oidc

# 安装依赖（如果需要）
npm install
```

### 项目结构

```
Scm.Oidc.Js/
├── oidc/              # 源码目录
│   ├── index.js      # 主入口
│   ├── core.js       # 核心模块
│   ├── auth.js       # 认证模块
│   ├── network.js    # 网络模块
│   ├── ui.js         # UI模块
│   ├── dom.js        # DOM工具
│   ├── crypto.js     # 加密工具
│   └── task.js       # 任务管理
├── oidc.js           # 未压缩版本
├── oidc.min.js       # 压缩版本
├── oidc.css          # 样式文件
└── oidc.vue.js       # Vue集成
```

### 开发流程

1. **创建分支**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **编写代码**
   - 遵循代码规范
   - 添加必要的注释
   - 编写单元测试

3. **测试**
   ```bash
   # 运行测试
   npm test
   
   # 在浏览器中测试
   open index.html
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature
   ```

5. **创建 Pull Request**
   - 填写 PR 模板
   - 关联相关 Issue
   - 等待代码审查

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (type)

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
# 新功能
git commit -m "feat: add Vue 3 support"

# 修复 bug
git commit -m "fix: resolve dialog drag issue"

# 文档更新
git commit -m "docs: update API documentation"

# 重构
git commit -m "refactor: optimize network module"
```

## 代码规范

### JavaScript 规范

- 使用 4 个空格缩进
- 使用单引号字符串
- 函数和变量使用驼峰命名
- 常量使用大写字母和下划线
- 添加必要的注释

### 注释规范

```javascript
/**
 * 函数说明
 * @param {String} param1 参数1说明
 * @param {Object} param2 参数2说明
 * @returns {Boolean} 返回值说明
 */
function functionName(param1, param2) {
    // 实现
}
```

### 文件头部注释

```javascript
/**
 * 模块名称
 * 模块简短描述
 * 
 * @module oidc/module-name
 */
```

## 测试规范

### 单元测试

- 每个模块都应有对应的测试文件
- 测试文件命名：`*.test.js`
- 测试覆盖率应达到 80% 以上

### 测试示例

```javascript
describe('Core Module', function() {
    it('should initialize with correct config', function() {
        oidc.core.initConfig('test-key', { mode: 'web' });
        assert.equal(oidc.core.getMode(), 'web');
    });
});
```

### 浏览器测试

- 在主流浏览器中测试（Chrome, Firefox, Safari, Edge）
- 测试不同设备（桌面、平板、手机）
- 测试不同网络环境

## 发布流程

1. 更新版本号
2. 更新 CHANGELOG.md
3. 构建生产版本
4. 创建 Git 标签
5. 发布到 npm（如果需要）

## 获取帮助

- 📖 查看 [文档](README.md)
- 💬 加入 [讨论区](https://github.com/your-repo/oidc/discussions)
- 📧 发送邮件至 support@oidc.org.cn

## 许可证

通过贡献代码，您同意您的代码将根据项目的 MIT 许可证进行许可。

---

再次感谢您的贡献！🎉
