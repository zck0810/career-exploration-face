<template>
  <div class="jobSearch-container">
    <div style="margin-bottom:10px;width: 100%;height: 80%">
      <el-input v-model="name" placeholder="请输入职位信息" suffix-icon="el-icon-search" @keyup.enter.native="loadPost"
                style="width:500px ;margin:20px;border:1px solid skyblue;border-radius: 2px"></el-input>
      <el-button type="primary" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resultQuery">重置</el-button>
      <div class="mid">
        <el-select v-model="select1.value" filterable placeholder="职位类型">
          <el-option
            v-for="item in select1.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="select2.value" filterable placeholder="工作经验">
          <el-option
            v-for="item in select2.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="select3.value" filterable placeholder="薪资待遇">
          <el-option
            v-for="item in select3.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="select4.value" filterable placeholder="学历要求">
          <el-option
            v-for="item in select4.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="select5.value" filterable placeholder="热门城市">
          <el-option
            v-for="item in select5.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="filterAll" type="warning">筛选</el-button>
      </div>
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
          <el-table-column prop="position" label="职位" width="300" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="city" label="城市" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="salary" label="薪资" width="120" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="experience" label="经验" width="80" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="education" label="学历" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="tags" label="标签" width="300" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="companyName" label="公司名" width="220" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="companyScale" label="公司规模" width="150" header-align="center" align="center">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="职位详情" width="150" header-align="center" align="center">
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


  import {getPositionData,getJobInformation} from "@/api/liepin";

  export default {
    name: 'jobSearch',
    data() {
      return {
        name: '',
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        isHighSearch: true,
        select1: {
          value: '',
          options: [
            {label: '', value: ''},
            {label: 'java', value: 'java'},
            {label: 'python', value: 'python'},
            {label: 'PHP', value: 'PHP'},
            {label: 'Ruby', value: 'Ruby'},
            {label: 'Node.JS', value: 'Node.JS'},
            {label: '.NET', value: '.NET'},
            {label: 'ASP', value: 'ASP'},
            {label: 'C', value: 'C'},
            {label: 'Delphi', value: 'Delphi'},
            {label: 'Go', value: 'Go'},
            {label: 'Docker', value: 'Docker'},
            {label: 'Hadoop', value: 'Hadoop'},
            {label: 'Spark', value: 'Spark'},
            {label: 'HBase', value: 'HBase'},
            {label: '数据挖掘', value: '数据挖掘'},
            {label: '自然语言处理', value: '自然语言处理'},
            {label: '推荐系统', value: '推荐系统'},
            {label: '搜索引擎', value: '搜索引擎'},
            {label: '全栈工程师', value: '全栈工程师'},
            {label: 'HTML5', value: 'HTML5'},
            {label: 'Web前端', value: 'Web前端'},
            {label: 'Flash', value: 'Flash'},
            {label: 'Javascript', value: 'Javascript'},
          ]
        },
        select2: {
          value: '',
          options: [
            {label: '', value: ''},
            {label: '经验不限', value: '经验不限'},
            {label: '1年以下', value: '1年以下'},
            {label: '1-3年', value: '1-3年'},
            {label: '3-5年', value: '3-5年'},
            {label: '5-10年', value: '5-10年'},
            {label: '10年以上', value: '10年以上'}
          ]
        },
        select3: {
          value: '',
          options: [
            {label: '', value: ''},
            {label: '薪资面议', value: '薪资面议'},
            {label: '3-5K', value: '3-5K'},
            {label: '5-10K', value: '5-10K'},
            {label: '10-20K', value: '5-20K'},
            {label: '20-40K', value: '20-40K'},
            {label: '40-60K', value: '40-60K'},
            {label: '60K以上', value: '60K以上'},
          ]
        },
        select4: {
          value: '',
          options: [
            {label: '', value: ''},
            {label: '中专/中技', value: '中专/中技'},
            {label: '高中', value: '高中'},
            {label: '大专', value: '大专'},
            {label: '本科', value: '本科'},
            {label: '硕士', value: '硕士'},
            {label: '博士', value: '博士'}

          ]
        },
        select5: {
          value: '',
          options: [
            {label: '', value: ''},
            {label: '北京', value: '北京'},
            {label: '上海', value: '上海'},
            {label: '深圳', value: '深圳'},
            {label: '杭州', value: '杭州'},
            {label: '成都', value: '成都'},
            {label: '武汉', value: '武汉'},
            {label: '广州', value: '广州'},
            {label: '南京', value: '南京'},
            {label: '西安', value: '西安'}

          ]
        },
      }
    },
    methods: {
      filterAll(){
        if(this.select1.value===null&&this.select2.value===null&&this.select3.value===null&&this.select4.value===null&&this.select5.value===null){
          this.loadPost()
        }else{
          this.filterJob()
        }
      },
    async  filterJob(){
        const data={
          pageNum: 1,
          pageSize: 10,
          select1:this.select1.value,
          select2:this.select2.value,
          select3:this.select3.value,
          select4:this.select4.value,
          select5:this.select5.value,
        }
        console.log(data)
        getJobInformation(data).then(res => {
          console.log(res);
          if(res.code===20000){
            this.tableData = res.data
            this.total = res.total
          }
          else{
            this.$message({
              message: '提交失败',
              type: 'falied'
            })
          }
        })
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
        if (!this.isHighSearch) {
        this.loadPost()
      }else {
          this.filterJob()
        }
      },
      handleCurrentChange(val) {
        this.pageNum = val
        if (!this.isHighSearch) {
          this.loadPost()
        }else {
          this.filterJob()
        }
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

  a {
    text-decoration: none
  }

</style>

<style>
  .el-select{
      margin-right:20px ;
  }
  .el-select-dropdown__wrap {
    max-height: 260px;
  }
</style>
