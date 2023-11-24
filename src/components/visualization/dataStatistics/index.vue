<template>
  <div class="boxnav">
    <div class="yqlist">
      <ul class="clearfix">
        <li>
          <div class="yq" id="yq">{{companyNumber}}</div>
          <span>公司总数</span>
        </li>
        <li>
          <div class="yq">{{positionNumber}}</div>
          <span>岗位总数</span>
        </li>
        <li>
          <div class="yq">{{HighPositionNumber}}</div>
          <span>万元以上岗位数量</span>
        </li>
        <li>
          <div class="yq">{{LowPositionNumber}}</div>
          <span>6-10K薪资岗位数量</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getCompanyTotal} from "@/api/searchcompany";
  import {getHighSalaryTotal, getLowSalaryTotal, getPositionTotal} from "@/api/liepin";

  export default {
    name: "index",
    data() {
      return{
        companyNumber:'',
        positionNumber:'',
        HighPositionNumber:'',
        LowPositionNumber:'',
      }
    },
    mounted() {
      this.getTotalCompanyNum()
      this.getTotalPositionNum()
      this.getHighSalaryNum()
      this.getLowSalaryNum()
    },
    methods:{
       getTotalCompanyNum(){
        getCompanyTotal().then(res => {
          this.companyNumber = res.data
        })
      },
       getTotalPositionNum(){
        getPositionTotal().then(res => {
          this.positionNumber = res.data
        })
      },
      getHighSalaryNum(){
        getHighSalaryTotal().then(res => {
          this.HighPositionNumber = res.data
        })
      },
      getLowSalaryNum(){
        getLowSalaryTotal().then(res => {
          this.LowPositionNumber = res.data
        })
      },
    }
  }
</script>

<style scoped>
  @font-face {
    font-family: electronicFont;
    src: url("@/img/DS-DIGIT.TTF")
  }
  .boxnav {
    padding:10px 10px 10px 0;
  }

  .clearfix:after,
  .clearfix:before {
    display: table;
    content: " "
  }

  .clearfix:after {
    clear: both
  }

  .yqlist li {
    float: left;
    width: 110px;
    text-align: center;
    margin-top:20px;
  }

  .yq {
    width: 100px;
    height: 100px;
    margin: 10px auto 10px auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 35px;
    font-family: electronicFont;
    color: #fff32b;
  }

  .yqlist li span {
    /*opacity: .6;*/
    font-size: 16px;
    color: #fff;
  }

  .yq:before {
    position: absolute;
    width: 100%;
    height: 100%;
    content: "";
    background: url("@/img/img1.png") center center;
    border-radius: 100px;
    background-size: 100% 100%;
    opacity: .6;
    left: 0;
    top: 0;
    animation: myfirst2 15s infinite linear;
  }

  .yq:after {
    position: absolute;
    width: 86%;
    background: url("@/img/img2.png") center center;
    border-radius: 100px;
    background-size: 100% 100%;
    opacity: .4;
    height: 86%;
    content: "";
    left: 7%;
    top: 7%;
    animation: myfirst 15s infinite linear;
  }


  @keyframes myfirst {
    to {
      transform: rotate(-360deg)
    }
  }

  @keyframes myfirst2 {
    to {
      transform: rotate(360deg)
    }
  }
</style>
