<template>
  <div class="user-block">
    <el-card ref="boxCard" class="box-card" shadow="never">
      <div class="action-bar">
        <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="addUserClick">添加用户</el-button>
      </div>

      <el-table
        ref="userTable"
        v-loading="userLoading"
        :data="tableData"
        size="mini"
        :height="tableHeight"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed
          type="selection"
          width="55"
        />
        <el-table-column
          fixed
          prop="userName"
          label="用户名"
          width="100"
        />
        <el-table-column
          fixed
          prop="userPhone"
          label="联系方式"
          width="100"
        />
        <el-table-column
          prop="userSex"
          label="性别"
          width="80"
          :formatter="formatBoolean"
        />
        <el-table-column
          prop="userEmail"
          label="邮箱"
          width="120"
        />
        <el-table-column
          prop="userBirthday"
          label="生日"
          width="100"
        />
        <el-table-column
          prop="isDeleted"
          label="是否删除"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isDeleted" size="danger">是</el-tag>
            <el-tag v-if="!scope.row.isDeleted">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="isLocked"
          label="是否锁定"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isLocked" size="danger">是</el-tag>
            <el-tag v-if="!scope.row.isLocked">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="userAvatar"
          label="用户头像"
          width="120"
        />
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="创建时间"
          width="150"
        />
        <el-table-column
          show-overflow-tooltip
          prop="updateTime"
          label="更新时间"
          width="150"
        />
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-tag type="danger" size="small" @click="delUser(scope.row)">删除</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="8">
          <div class="batch-del">
            <el-button type="danger" size="small">批量删除</el-button>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="user-page">
            <el-pagination
              background
              :current-page="pageInfo.pageNum"
              :page-sizes="[10, 20, 30, 50,100]"
              :page-size="pageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageInfo.size"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>

    </el-card>
    <div>
      <add-or-edit-user
        v-if="userDialogVisible"
        id="add-or-edit-user"
        :dialog-visible="userDialogVisible"
        :user-dialog-row="userDialogRow"
        :user-option="userOption"
        @changeDialogVisible="changeDialogVisible"
        @adduserconfirm="addUserConfirm"
      />
    </div>
  </div>
</template>

<script>

import { getUsers, addUsers, deleteUserById } from '@/api/user/user';
import AddOrEditUser from './components/AddOrEditUser';

export default {
  name: 'UserManage',
  components: {
    AddOrEditUser
  },
  data() {
    return {
      tableHeight: '73vh',
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        isFirstPage: false,
        isLastPage: false,
        size: 0,
        pages: 1
      },
      tableData: [],
      userDialogVisible: false,
      userDialogRow: {},
      userOption: '',
      userLoading: false
    };
  },
  mounted() {
    this.getAllUser(1, 10);
  },

  methods: {
    getAllUser(pageNum, pageSize) {
      getUsers(pageNum, pageSize).then(res => {
        this.tableData = res.data.data.pageInfo.list;
        this.pageInfo = res.data.data.pageInfo;
        this.userLoading = false;
      }).catch(error => {
        console.log(error);
      });
    },
    formatBoolean(row, column, cellValue) {
      var ret = ''; // 你想在页面展示的值
      if (column.property === 'userSex') {
        if (cellValue === 1) {
          ret = '男'; // 根据自己的需求设定
        } else {
          ret = '女';
        }
      }
      return ret;
    },
    handleClick(row) {
      this.userOption = 'and';
      this.userDialogVisible = !this.userDialogVisible;
      this.userDialogRow = Object.assign({}, row);
    },
    addUserClick() {
      this.userLoading = true;
      this.userOption = 'add';
      this.userDialogVisible = !this.userDialogVisible;
      this.userDialogRow = {};
    },
    addUserConfirm(userInfo) {
      addUsers(userInfo).then(res => {
        this.$message({
          message: '添加用户成功！',
          type: 'success'
        });
        this.getAllUser(1, this.pageInfo.pageSize);
      }
      ).catch(error => {
        console.log(error);
      });
    },
    delUser(row) {
      this.$confirm('确认删除此用户' + row.userName + ', 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delUesrConfirm(row.userId);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    delUesrConfirm(userId) {
      deleteUserById({ userId: userId }).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getAllUser(this.pageInfo.pageNum, this.pageInfo.pageSize);
      }).catch(error => {
        console.log(error);
      });
    },
    changeDialogVisible() {
      this.userLoading = false;
      this.userDialogVisible = !this.userDialogVisible;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.getAllUser(this.pageInfo.pageNum, val);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getAllUser(val, this.pageInfo.pageSize);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.userTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.userTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style scoped>
    .box-card {
        height: 100%;
    }
   .batch-del{
    margin-top: 1vh;
   }
    .user-page {
        margin-top: 1vh;
        float: right;
    }
    .action-bar{
        float: right;
        padding-bottom: 1vh;
    }
</style>
