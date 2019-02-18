<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区-->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- table表格的绘制 -->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.mg_state"
              @change="changeState(info.row.id,info.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <!-- 修改用户按钮 -->
            <el-button
              type="primary"
              size="mini"
              class="el-icon-edit"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              size="mini"
              class="el-icon-delete"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" class="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[2,5,10,15]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>

      <!-- 添加用户的Dialog弹框区 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户Dialog对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  data() {
    // 自定义校验器
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      }
      // 校验通过，继续执行
      callback()
    }
    return {
      userInfos: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 2,
        total: 0
      },
      // 添加用户相关
      // Dialog弹框是否显示 true 显示  false 隐藏
      addDialogVisible: false,
      // form表单数据部分
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // form表单校验规则制作
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户相关
      editDialogVisible: false,
      // 编辑用户表单数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [{ required: true, message: '邮箱必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 编辑用户
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.editForm = res.data
    },
    // 编辑用户---收集数据入库---编辑用户对话框确定按钮功能
    async editUser() {
      this.$refs.editFormRef.validate(async valid => {
        // 校验成功的处理
        if (valid) {
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 修改用户信息完毕（关闭dialog对话框，修改成功提示，更新列表数据
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },

    // 删除用户
    delUser(id) {
      this.$confirm('确定删除该会员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {})
    },
    // 添加用户相关
    // 收集用户信息，存储到后端api的数据库中
    addUser() {
      // 进行客户端 form表单校验
      this.$refs.addFormRef.validate(async valid => {
        // 校验成功的处理
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          // 提交不成功的处理
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 点击确定按钮后 关闭对话框-- 提示成功信息-- 即使把新添用户数据刷新出来
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 关闭dialog对话框后的回调函数
    addDialogClose() {
      // 重置form表单
      this.$refs.addFormRef.resetFields()
    },
    // 修改用户状态
    async changeState(id, state) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户状态失败')
      }
      this.$message({
        message: '修改状态成功',
        type: 'success',
        duration: 1500
      })
    },
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得的用户数据赋予给userInfos成员
      this.userInfos = res.data.users
      // 丰富记录总条数变量
      this.queryParams.total = res.data.total
    },
    // 数据分页相关
    // 每页信息条数变化后回调函数处理
    handleSizeChange(val) {
      // val：代表变化后的每页信息显示条数
      this.queryParams.pagesize = val
      // 根据变化后的显示条数，重新获得 数据
      this.getUserInfos()
    },
    // 当前页码变化后的回调处理
    handleCurrentChange(val) {
      // val代表变化后的页码
      this.queryParams.pagenum = val
      // 根据变化后的页码重新获得数据
      this.getUserInfos()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
