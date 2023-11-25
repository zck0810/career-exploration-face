<template>
  <div class="boxNav">
    <div class="yqList">
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
*{
  margin: 0;
  padding: 0;
}
  @font-face {
    font-family: electronicFont;
    src: url("@/img/DS-DIGIT.TTF")
  }
  .boxNav {
    height: 97%;
    width: 97%;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .clearfix{
    position: absolute;
    top: 2px;
    bottom: -10px;
    left: 1px;
    right: 1px;
    border-radius: 20px;
    background-color: rgba(15,55,95,0.18);
  }


  .yqList li {
    float: left;
    width: 20%;
    text-align: center;
    margin-top:30px;
    padding: 10px;
    margin-left: 2px;
  }

  .yq {
    width: 13vh;
    height: 13vh;
    margin: 10px auto 10px auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 35px;
    font-family: electronicFont,serif;
    color: #fff32b;
  }

  .yqList li span {
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
    animation: myFirst2 15s infinite linear;
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
    animation: myFirst 15s infinite linear;
  }


  @keyframes myFirst {
    to {
      transform: rotate(-360deg)
    }
  }

  @keyframes myFirst2 {
    to {
      transform: rotate(360deg)
    }
  }
</style>
