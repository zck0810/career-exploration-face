<template>
  <div class="companySearch-container">
    <h1>公司查询页面</h1>
    <div style="margin-bottom:10px;width: 100%;height: 80%">
      <el-input v-model="name" placeholder="请输入企业名称或核心人员" suffix-icon="el-icon-search" @keyup.enter.native="loadPost"
                style="width:500px ;margin-right:10px"></el-input>
      <el-button type="primary" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resultQuery">重置</el-button>
      <el-button type="warning" round @click="highSearch">高级搜索</el-button>

      <div class="content">
        <el-table :data="tableData"
                  :header-cell-style="{background:'#f2f5fc',color:'#555555'}"
                  border
                  height="590px"
                  style="overflow-y: auto;"
        >
          <el-table-column type="index" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称" width="210">
          </el-table-column>
          <el-table-column prop="manageState" label="状态" width="100">
          </el-table-column>
          <el-table-column prop="legalRepresentative" label="代表人" width="100">
          </el-table-column>
          <el-table-column prop="registeredCapital" label="注册资金" width="80">
          </el-table-column>
          <el-table-column prop="contributedCapital" label="实缴资金" width="100">
          </el-table-column>
          <el-table-column prop="establishmentDate" label="创建日期" width="180">
          </el-table-column>
          <el-table-column prop="province" label="省份" width="180">
          </el-table-column>
          <el-table-column prop="city" label="市级" width="180">
          </el-table-column>
          <el-table-column prop="county" label="地区" width="180">
          </el-table-column>
          <el-table-column prop="telephone" label="电话" width="180">
          </el-table-column>
          <el-table-column prop="mailbox" label="邮箱" width="180">
          </el-table-column>
          <el-table-column prop="insuredNumber" label="参保人数" width="180">
          </el-table-column>
          <el-table-column prop="enterpriseType" label="企业类型" width="180">
          </el-table-column>
          <el-table-column prop="registeredAddress" label="注册地址" width="180">
          </el-table-column>
          <el-table-column prop="latestAnnualReportAddress" label="最新地址" width="180">
          </el-table-column>
          <el-table-column prop="website" label="网站" width="180">
          </el-table-column>
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
        </el-table></div>
    </div>
  </div>
</template>

<script>
  import {getCompanyData} from "@/api/searchcompany";

  export default {
    name: 'companySearch',
    data() {
      return {
        name: '',
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },
    methods: {
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
        this.loadPost()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.loadPost()
      },
      highSearch() {

      }

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
</style>



