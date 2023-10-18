<template>
  <div class="jobSearch-container">
    <h1>职位查询页面</h1>
    <div style="margin-bottom:10px;width: 100%;height: 80%">
      <el-input v-model="name" placeholder="请输入职位信息" suffix-icon="el-icon-search" @keyup.enter.native="loadPost"
                style="width:500px ;margin-right:10px"></el-input>
      <el-button type="primary" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resultQuery">重置</el-button>
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
          <el-table-column prop="position" label="职位" width="300">
          </el-table-column>
          <el-table-column prop="city" label="城市" width="100">
          </el-table-column>
          <el-table-column prop="salary" label="薪资" width="120">
          </el-table-column>
          <el-table-column prop="experience" label="经验" width="80">
          </el-table-column>
          <el-table-column prop="education" label="学历" width="100">
          </el-table-column>
          <el-table-column prop="tags" label="标签" width="300">
          </el-table-column>
          <el-table-column prop="companyName" label="公司名" width="220">
          </el-table-column>
          <el-table-column prop="companyScale" label="公司规模" width="150">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="职位详情" width="150">
            <template slot-scope="scope">
              <span class="span-text" v-if="scope.row.href!== undefined && scope.row.href.length >=1">
                <a link :href="scope.row.href" target="_blank">职位详情链接</a></span>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>


  import {getPositionData} from "@/api/liepin";

  export default {
    name: 'jobSearch',
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
        getPositionData(data).then(res => {
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
    },
    mounted() {
      this.loadPost()
    }
  }


</script>

<style scoped>
  .jobSearch-container {
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
  a{
    text-decoration: none;
  }
</style>
