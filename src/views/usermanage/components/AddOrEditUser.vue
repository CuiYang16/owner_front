<template>
  <div id="user-dialog">
    <el-dialog title="用户信息" :visible.sync="userDialogVisible" width="40%" @close="changeDialogVisible">
      <el-form ref="userDialog" :model="userForm" size="mini">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userDialogRow.userName" autocomplete="off" :readonly="userOption==='and'" />
        </el-form-item>
        <el-form-item v-if="userOption==='add'" label="密码" :label-width="formLabelWidth">
          <el-input v-model="userDialogRow.userPwd" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select v-model="userDialogRow.userSex" placeholder="请选择性别" :disabled="userOption==='and'">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="userDialogRow.userPhone" autocomplete="off" :readonly="userOption==='and'" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="userDialogRow.userEmail" autocomplete="off" :readonly="userOption==='and'" />
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="userDialogRow.userBirthday"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            :readonly="userOption==='and'"
          />
        </el-form-item>
        <el-form-item label="是否删除" :label-width="formLabelWidth">
          <el-switch
            v-model="userDialogRow.isDeleted"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            :disabled="userOption==='and'"
          />
        </el-form-item>
        <el-form-item label="是否锁定" :label-width="formLabelWidth">
          <el-switch
            v-model="userDialogRow.isLocked"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            :disabled="userOption==='and'"
          />
        </el-form-item>
        <el-form-item v-show="userOption==='and'" label="创建时间" :label-width="formLabelWidth">
          <el-input v-model="userDialogRow.createTime" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changeDialogVisible()">取 消</el-button>
        <el-button type="primary" size="mini" @click="changeDialogVisible()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddOrEditUser',
  props: {
    dialogVisible: {
      type: Boolean,
      required: false
    },
    userDialogRow: {
      type: Object,
      required: {}
    },
    userOption: {
      type: String,
      required: 'and'
    }
  },
  data() {
    return {
      userDialogVisible: this.dialogVisible,
      userForm: this.userDialogRow,
      formLabelWidth: '120px',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value1: '',
      value2: ''

    };
  },
  methods: {
    changeDialogVisible() {
      this.$refs.userDialog.clearValidate();
      this.$refs.userDialog.resetFields();
      if (this.userOption === 'add') {
        this.$emit('adduserconfirm', this.userForm);
      } else if (this.userOption === 'and') {
        this.$emit('changeDialogVisible');
      }
    }
  }
};
</script>

<style scoped>

</style>
