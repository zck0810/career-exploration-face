<template>
  <div class="companySearch-container">
    <h1>公司查询页面</h1>
    <div style="margin-bottom:10px;width: 100%;height: 80%">
      <el-input v-model="name" placeholder="请输入企业名称或核心人员" suffix-icon="el-icon-search" @keyup.enter.native="loadPost"
                style="width:500px ;margin-right:10px"></el-input>
      <el-button type="primary" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resultQuery">重置</el-button>
      <el-button type="warning" round @click="highSearch">高级公司搜索</el-button>

      <div class="content">
        <el-table :data="tableData"
                  :header-cell-style="{background:'#f2f5fc',color:'#555555'}"
                  border
                  height="590px"
                  style="overflow-y: auto;"
        >
          <el-table-column type="index" label="序号" width="80" header-align="center" align="center">
            <template slot-scope="scope">
              <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称" width="210" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="manageState" label="状态" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="legalRepresentative" label="代表人" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="registeredCapital" label="注册资金" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="contributedCapital" label="实缴资金" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="establishmentDate" label="创建日期" width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="province" label="省份" width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="city" label="市级" width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="county" label="地区" width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="telephone" label="电话" width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="mailbox" label="邮箱" width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="insuredNumber" label="参保人数" width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="enterpriseType" label="企业类型" width="190" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="registeredAddress" label="注册地址" width="220" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="latestAnnualReportAddress" label="最新地址" width="220" header-align="center"
                           align="center">
          </el-table-column>
          <el-table-column prop="website" label="公司网址" width="200" header-align="center"
                           align="center">
          </el-table-column>
<!--          <el-table-column show-overflow-tooltip label="公司网址" width="200" header-align="center" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <span class="span-text" v-if="scope.row.website!=='-'&& scope.row.website.length >=2">-->
<!--                <a link :href="scope.row.websi te" target="_blank">公司详情链接</a>-->
<!--              </span>-->
<!--              <span v-else>-->
<!--                暂无网址-->
<!--              </span>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <!--            分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <el-dialog
          title="高级搜索"
          :visible.sync="centerDialogVisible"
          width="50%"
          center>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="关键词">
              <el-input v-model="form.key" placeholder="请输入企业名称或企业代表人"></el-input>
            </el-form-item>
            <el-form-item label="全部地区">
              <el-select v-model="form.region" placeholder="请选择区域">
                <el-option label="北京市" value="北京"></el-option>
                <el-option label="天津市" value="天津"></el-option>
                <el-option label="河北省" value="河北"></el-option>
                <el-option label="山西省" value="山西"></el-option>
                <el-option label="内蒙古自治区" value="内蒙古"></el-option>
                <el-option label="辽宁省" value="辽宁"></el-option>
                <el-option label="吉林省" value="吉林"></el-option>
                <el-option label="黑龙江省" value="黑龙江"></el-option>
                <el-option label="上海市" value="上海"></el-option>
                <el-option label="江苏省" value="江苏"></el-option>
                <el-option label="浙江省" value="浙江"></el-option>
                <el-option label="安徽省" value="安徽"></el-option>
                <el-option label="福建省" value="福建"></el-option>
                <el-option label="江西省" value="江西"></el-option>
                <el-option label="山东省" value="山东"></el-option>
                <el-option label="河南省" value="河南"></el-option>
                <el-option label="湖北省" value="湖北"></el-option>
                <el-option label="湖南省" value="湖南"></el-option>
                <el-option label="广东省" value="广东"></el-option>
                <el-option label="广西壮族自治区" value="广西"></el-option>
                <el-option label="海南省" value="海南"></el-option>
                <el-option label="重庆市" value="重庆"></el-option>
                <el-option label="四川省" value="四川"></el-option>
                <el-option label="贵州省" value="贵州"></el-option>
                <el-option label="云南省" value="云南"></el-option>
                <el-option label="西藏自治区" value="西藏"></el-option>
                <el-option label="陕西省" value="陕西"></el-option>
                <el-option label="甘肃省" value="甘肃"></el-option>
                <el-option label="青海省" value="青海"></el-option>
                <el-option label="宁夏回族自治区" value="宁夏"></el-option>
                <el-option label="新疆维吾尔自治区" value="新疆"></el-option>
                <el-option label="台湾省" value="台湾"></el-option>
                <el-option label="香港特别行政区" value="香港"></el-option>
                <el-option label="澳门特别行政区" value="澳门"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成立年限">
              <el-radio-group v-model="form.year">
                <el-radio label="1-3年"></el-radio>
                <el-radio label="3-5年"></el-radio>
                <el-radio label="5-10年"></el-radio>
                <el-radio label="10年以上"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="注册资本">
              <el-radio-group v-model="form.pay">
                <el-radio label="1-100万"></el-radio>
                <el-radio label="100-500万"></el-radio>
                <el-radio label="500-1000万"></el-radio>
                <el-radio label="1000-5000万"></el-radio>
                <el-radio label="5000万以上"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="参保人数">
              <el-radio-group  v-model="form.number">
                <el-radio label="0-49人"></el-radio>
                <el-radio label="50-99人"></el-radio>
                <el-radio label="100-499人"></el-radio>
                <el-radio label="500人以上"></el-radio>
              </el-radio-group >
            </el-form-item>
            <el-form-item label="更多筛选">
              <el-checkbox-group  v-model="form.condition">
                <el-checkbox label="联系电话"></el-checkbox>
                <el-checkbox label="联系邮箱"></el-checkbox>
                <el-checkbox label="网址信息"></el-checkbox>
                <el-checkbox label="失信信息"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="findAll">查询结果</el-button>
  </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import {getCompanyData, getHighCompanyInformation} from "@/api/searchcompany";

  export default {
    name: 'companySearch',
    data() {
      return {
        name: '',
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        centerDialogVisible:false,
        isHighSearch:false,
        form: {
          key: '',
          region: '',
          year:'',
          pay: '',
          number:'',
          condition:[]
        },
      };
    },
    methods: {
      findAll(){
        if(this.form.key===''&&this.form.region===''&&this.form.year===''&&this.form.pay===''&&this.form.number===''&&this.form.condition===[]){
          this.loadPost()
        }else{
          this.selectResult()
        }
      },
      resultQuery() {
        this.name = ''
      },
      loadPost() {
        const data = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.name,
        }
        console.log(data)
        getCompanyData(data).then(res => {
          console.log(res)
          if (res.code === 20000) {
            this.tableData = res.data
            this.total = res.total
          } else {
            alert('获取数据失败')
          }

        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        if(!this.isHighSearch){
          this.loadPost()
        }else {
          this.doSelect()
        }
      },
      handleCurrentChange(val) {
        this.pageNum = val
        if(!this.isHighSearch){
          this.loadPost()
        }else {
          this.doSelect()
        }
      },
      selectResult(){
        console.log(this.form.condition)
        this.isHighSearch=true
        //防止填写错误也提交成功
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.doSelect()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      doSelect(){
        const data = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          form: this.form
        }
        getHighCompanyInformation(data).then(res => {
          console.log(res);
          if(res.code===20000){
            this.tableData = res.data
            this.total = res.total
            this.centerDialogVisible=false
          }
          else{
            this.$message({
              message: '提交失败',
              type: 'falied'
            })
          }
        })
      },
      highSearch() {
         //显示表单
        this.centerDialogVisible = true
        this.$nextTick(() => {
          //调用
          this.resetForm()
        })
      },
      // 重置表单
      resetForm() {
        // this.$refs父组件调用子组件的方法
        this.$refs.form.resetFields();
      },
    },

    mounted() {
      this.loadPost()
    }
  }

</script>

<style scoped>
  .companySearch-container {
    text-align: center;
    max-height: calc(100vh - 54px);
    overflow-y: auto;
  }

  .content {
    width: 96%;
    text-align: center;
    height: 100%;
    margin: 10px auto;
  }

  a {
    text-decoration: none;
  }

</style>

<style>
   /*30个省滚动*/
  .el-scrollbar__wrap {
    overflow: scroll;
    height: auto;
    max-height: 200px;
  }
</style>


