<template>
    <div class="user-block">
        <el-card class="box-card" shadow="never">
            <div>
                <el-button size="small" type="primary" icon="el-icon-edit">添加用户</el-button>
            </div>

            <el-table
                    ref="userTable"
                    :data="tableData"
                    size="mini"
                    style="width: 100%;height: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        fixed
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        fixed
                        prop="userName"
                        label="用户名"
                        width="100">
                </el-table-column>
                <el-table-column
                        fixed
                        prop="userPhone"
                        label="联系方式"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="userSex"
                        label="性别"
                        width="80"
                        :formatter="formatBoolean">
                </el-table-column>
                <el-table-column
                        prop="userEmail"
                        label="邮箱"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="userBirthday"
                        label="生日"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="isDeleted"
                        label="是否删除"
                        width="120"
                >
                    <template slot-scope="scope">
                        <el-tag size="danger" v-if="scope.row.isDeleted">是</el-tag>
                        <el-tag v-if="!scope.row.isDeleted">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="isLocked"
                        label="是否锁定"
                        width="120"
                >
                    <template slot-scope="scope">
                        <el-tag size="danger" v-if="scope.row.isLocked">是</el-tag>
                        <el-tag v-if="!scope.row.isLocked">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        prop="userAvatar"
                        label="用户头像"
                        width="120">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        prop="createTime"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        prop="updateTime"
                        label="更新时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                        <el-tag type="danger" size="small">删除</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="user-page">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageInfo.pageNum"
                        :page-sizes="[10, 20, 30, 50,100]"
                        :page-size="pageInfo.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageInfo.size">
                </el-pagination>
            </div>
        </el-card>
        <div>
            <add-or-edit-user v-if="userDialogVisible" :dialogVisible="userDialogVisible" :userDialogRow="userDialogRow" @changeDialogVisible="changeDialogVisible" id="add-or-edit-user"></add-or-edit-user>
        </div>
    </div>
</template>

<script>

    import {getUsers} from "@/api/user/user";
    import AddOrEditUser from "./components/AddOrEditUser";
    export default {
        name: "userManage",
        components:{
            AddOrEditUser
        },
        data() {
            return {
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
                userDialogVisible:false,
                userDialogRow:{}
            }

        },

        methods: {
            getAllUser(pageNum, pageSize) {
                getUsers(pageNum, pageSize).then(res => {
                    this.tableData = res.data.data.pageInfo.list;
                    this.pageInfo=res.data.data.pageInfo;
                }).catch(error => {

                })
            },
            formatBoolean(row, column, cellValue) {

                var ret = ''  //你想在页面展示的值
                if (column.property == "userSex") {
                    if (cellValue) {
                        ret = "男"  //根据自己的需求设定
                    } else {
                        ret = "女"
                    }
                }
                return ret;
            },
            handleClick(row) {
                console.log(row);
                this.userDialogVisible=!this.userDialogVisible;
                this.userDialogRow=Object.assign({},row);
            },
            changeDialogVisible(){
                this.userDialogVisible=!this.userDialogVisible;
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
        },
        mounted() {
            this.getAllUser(1, 10);
        }
    }
</script>

<style scoped>
    .box-card {
        height: 100%;
    }

    .user-page {
        margin-top: 2vh;
    }
</style>