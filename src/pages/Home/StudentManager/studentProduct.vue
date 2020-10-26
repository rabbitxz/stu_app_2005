<template>
  <div class="product">
    <div class="search">
      <el-select
        v-model="searchValue"
        filterable
        clearable
        remote
        reserve-keyword
        @change="searchTextchange"
        @blur="searchblur"
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.sId"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
      <!-- 搜索按钮 -->
      <el-button
        type="primary"
        icon="el-icon-search"
        class="right_search"
        @click="searchButton"
      ></el-button>
      <el-button type="primary" class="right_add" @click="addStu" v-haspermission="'add'"
        >添加项目</el-button
      >
    </div>
    <div class="search-class">
      班级选择：
      <el-select
        v-model="classes"
        filterable
        placeholder="请选择"
        @change="classchange"
        @visible-change="classvisible"
      >
       <el-option value="all" label="全部"></el-option>
        <el-option
          v-for="(item,index) in classoption"
          :key="index"
          :label="item"
          :value="item"
        >
        </el-option>
       
      </el-select>
    </div>
    <!-- dialog窗口 用于添加和编辑的弹窗-->
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogVisible">
      <el-form :model="stuForm" :rules="stuRules" ref="addStuRuleForm">
        <el-form-item label="头像">
          <el-upload
            class="uploadAvatar"
            ref="uploadAvatar"
            action="http://chst.vip/students/uploadStuAvatar"
            list-type="picture-card"
            :on-success="uploadSuccess"
            :on-remove="removeAvatar"
            :limit="1"
            name="headimgurl"
            :multiple="false"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="stuForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目地址" prop="productUrl">
          <el-input v-model="stuForm.productUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="stuForm.class" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="stuForm.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="stuForm.city" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="degree">
          <el-input v-model="stuForm.degree" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="stuForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmClick('addStuRuleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <div class="exprot">
      <el-button icon="iconfont icon-excel" @click="exprotdata" class="btu1">导出excel数据</el-button>
    </div>
    <!-- 表格展示 -->
    <div class="table">
      <el-table
        :data="classList"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="headimgurl"
          label="头像"
          width="180"
          align="center"
        >
          <template scope="scope">
            <img :src="scope.row.headimgurl" alt="" width="70" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="class" label="班级" width="180" align="center">
        </el-table-column>
        <el-table-column prop="productUrl" label="项目名称" align="center">
        </el-table-column>
        <el-table-column prop="" label="操作" align="center">
          <template scope="{row}">
            <el-button
              type="primary"
              icon="el-icon-view"
              @click="$router.push({ path: '/StudentManager/studentProfile' })"
              >查看</el-button
            >
            <el-button type="primary" icon="el-icon-edit" @click="edit(row)" v-haspermission="'edit'"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" @click="delstu(row)" v-haspermission="'delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
      hide-on-single-page
        background
        :page-size="dataCount"
        @current-change="changePage"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const api = require("@/api");
import { getClassList, delstu, searchStu, classsearch } from "@/api";
// 引入表格插件
import qee from "qf-export-excel"
export default {
  data() {
    return {
      params:{
        class:"",
        count:5
      },
      total:0,//数据的条数
    dataCount:5,//每页的数据条数
    dataPage:"",//页数
      dialogInfo: {
        title: "增加学员信息",
        requestName: "",
        editSuccessMsg: "增加成功",
        editerrorMsg: "增加失败"
      },
      showAvatar: true,
      dialogVisible: false,
      stuRules: {
        name: [{ required: true, message: "请输入名字", trigger: "blur" }],
        class: [{ required: true, message: "请输入班级", trigger: "blur" }],
        degree: [{ required: true, message: "请输入学历", trigger: "blur" }],
        city: [{ required: true, message: "请输入城市", trigger: "blur" }],
        productUrl: [
          { required: true, message: "请输入项目地址", trigger: "blur" }
        ],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ]
      },
      stuForm: {
        name: "",
        productUrl: "",
        headimgurl: "",
        class: "",
        age: "",
        city: "",
        degree: "",
        description: ""
      },
      classList: [],
      loading: true,
      options: [],
      classoption: [],
      searchValue: [],
      list: [],
      blursearch: "",
      classes: ""
    };
  },
  methods: {
    //分页的数据触发
    changePage(page){
      this.dataPage=page
      this.GET_CLASSLIST(this.params)
    },
    // 导出表格数据
    exprotdata(){
      // 定义表头
      let titleList=[
        {
          title:"姓名",
          key:"name"
        },
        {
          title:"班级",
          key:"class"
        },
        {
          title:"项目名称",
          key:"productUrl"
        },
      ]
      let dataSource=this.classList
      qee(titleList,dataSource,"数据表格")
    },
    //编辑学院信息
    edit(row) {
      // 1.弹出dialog
      this.dialogVisible = true;
      this.dialogInfo.title = "更改学员信息";
      // 2.数据回显
      this.stuForm = { ...row };
      // 3.更改提交
      this.dialogInfo.requestName = "updatestu";
      this.dialogInfo.editSuccessMsg = "修改成功";
      this.dialogInfo.editerrorMsg = "修改失败";
    },
    // 删除学员信息
    delstu(row) {
      if (row && row.sId) {
        // 让用户确认删除信息
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //调用删除请求
            delstu(row.sId)
              .then(res => {
                if (res.data && res.data.state) {
                  //删除成功
                  this.$message.success("删除成功");
                  this.GET_CLASSLIST();
                } else {
                  this.$message.error("删除出错");
                }
              })
              .catch(err => {
                this.$message.error("删除失败");
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.error("没有传入row对象");
        return;
      }
    },
    //图片上传成功，添加字段
    uploadSuccess(r) {
      this.stuForm.headimgurl = r.headimgurl;
      console.log(r);
    },
    //删除图片
    removeAvatar(r) {
      this.stuForm.headimgurl = "";
      console.log(r);
    },
    confirmClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //本地验证表单成功
          //关闭dialog
          this.dialogVisible = false;

          // 增加字段
          console.log(this.dialogInfo.title);
          api[this.dialogInfo.requestName](this.stuForm)
            .then(res => {
              if (res.data && res.data.state) {
                this.GET_CLASSLIST();
                this.$message.success(this.dialogInfo.editSuccessMsg);
                //清空stuForm对象里面的字段
                if (this.stuForm["_id"]) delete this.stuForm["_id"];
                Object.keys(this.stuForm).forEach(
                  key => (this.stuForm[key] = "")
                );
                //清空里面头像图片，组件的方法
                this.$refs.uploadAvatar.clearFiles();
              } else {
                this.$message.error(this.dialogInfo.editerrorMsg);
              }
            })
            .catch(err => {
              this.$message.error("网络错误，请重重新请求");
            });
        } else {
          this.$message.error("请完善表单字段");
        }
      });
    },
    // 增加学院信息
    addStu() {
      this.dialogInfo.title = "增加学员信息";
      this.dialogVisible = true;
      this.dialogInfo.requestName = "addstuDetail";
      this.dialogInfo.editSuccessMsg = "添加成功";
      this.dialogInfo.editerrorMsg = "添加失败，请完善字段";
    },
    // 获得班级信息
    GET_CLASSLIST(params) {
       this.loading = true;
       params=this.params;
       params.count=this.dataCount;
       params.page=this.dataPage
      getClassList(params)
        .then(res => {
          if (res && res.data.data) {
            this.loading = false;
            this.classList = res.data.data;
            this.total=res.data.total
          } else {
            this.loading = false;
            this.$message.error("数据获取失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    remoteMethod(query) {
      //键盘弹起的时候获取输入值 赋值第三方变量进行输入框内容存储
      this.blursearch = query;
      let key = query;
      searchStu(key)
        .then(res => {
          if (res.data && res.data.state) {
            this.options = res.data.data;
          } else {
            this.$message.warning("搜索失败");
          }
        })
        .catch(err => {
          this.$message.error("搜索失败");
        });
    },
    searchTextchange(searchText) {
      this.loading = true;
      let key = searchText;
      //  再次调用搜索接口
      searchStu(key)
        .then(res => {
          if (res.data && res.data.state) {
            //更改表格数据对象
            this.classList = res.data.data;
            this.loading = false;
          } else {
            this.$message.warning("搜索失败");
          }
        })
        .catch(err => {
          this.$message.error("搜索失败");
        });
    },
    // 失去焦点
    searchblur() {
      //失去焦点时将当前输入框的值赋给输入框（因为失去焦点会自己清空输入框）
      this.searchValue = this.blursearch;
    },
    //  搜索按钮
    searchButton() {
      this.loading = true;
      let key = this.searchValue;
      //  再次调用搜索接口
      searchStu(key)
        .then(res => {
          if (res.data && res.data.state) {
            //更改表格数据对象
            this.classList = res.data.data;
            this.loading = false;
          } else {
            this.$message.warning("搜索失败");
          }
        })
        .catch(err => {
          this.$message.error("搜索失败");
        });
    },
    // 班级搜索框展开/收起触发事件
    classvisible(isvisible){
      if(!isvisible) return
      // 收起时，调用接口获取信息
      classsearch()
      .then(res=>{
        if(res.data && res.data.state){
          this.classoption=res.data.data
        }
      })
    },
    // 获取 改变班级信息
    classchange(query) {
      let count=this.dataCount
      this.params=query==="all"?{count}:{class:query,count}
      this.GET_CLASSLIST(this.params)
    }
  },
  mounted() {
    this.GET_CLASSLIST();
  }
};
</script>
<style scoped>
.table {
  margin-top: 40px;
}
.el-button {
  width: 65px;
  height: 25px;
  padding: 0;
}
.right_search {
  margin: 0 0 0 10px;
  width: 60px;
  height: 40px;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.right_add {
  width: 98px;
  height: 40px;
}
.search_class {
  height: 40px;
}
.uploadAvatar {
  text-align: left;
}
.el-upload-list__item.is-success,
.el-upload--picture-card {
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
}
.el-dialog__header {
  padding: 0 !important;
  line-height: 60px;
}
.btu1{
  width:120px;
  height: 30px;
 float:right;
 margin-right:40px;
}
.page{
  margin-top:20px;
  text-align: center;
}
</style>