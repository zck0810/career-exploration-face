<template>
  <div class="ChatGPT-container">
    <div class="home-view">
      <div class="chat-panel">
        <div class="session-panel">
          <div class="topTitle">
            <div class="title">职探AI助手 -- 问答示例</div>
            <div class="description">让AI帮你就业</div>
          </div>
          <hr>
          <div class="session-list">
            <div v-for="(item, index) in exampleTextList" :key="index" class="exampleTextListClass"
                 @click="printExampleText(item.exampleText,item.questionId)">
              <!--              <div class="exampleTitle">{{ item.exampleTitle }}</div>-->
              <div class="exampleText">{{ item.exampleText }}</div>
              <div class="overlay"></div> <!-- 遮罩层 -->
            </div>
          </div>
          <div class="more-functions">
            <div class="model-select">
              <el-button @click="selectChatGPTModel">ChatGPT</el-button>
              <el-button @click="selectPositionRecommendationModel">职位推荐</el-button>
              <el-button @click="selectQuestionAnsweringAssistantModel">问答助手(默认)</el-button>
            </div>
          </div>
        </div>
        <div class="message-panel">
          <div class="chatMessage">
            <div class="chatBox" id="chatBox">
              <el-row v-for="(item, index) in responseText" :key="index"
                      :class="[item.is_robot === 1 ? 'user' : 'robot']">
                <el-col :span="2" style="text-align: center">
                  <img
                    :src="item.is_robot === 1 ? require('@/assets/image/user.jpg') : require('@/assets/image/AILogo.jpg')"
                    style="width: 30px; height: 30px;">
                </el-col>
                <el-col :span="22">
                  <!--  is_robot === 1 用户输入-->
                  <div style="height: 100%;width: 100%;" v-if="item.is_robot === 1">{{ item.content }}</div>
                  <!--   is_robot === 0 ChatGPT回答-->
                  <div style="height: auto; width: 100%; white-space: pre-wrap;" v-else-if="item.is_robot === 0">
                    {{ item.content }}
                  </div>
                  <!--   is_robot === 2 职位推荐-->
                  <div style="height: 100%;width: 100%;" v-else-if="item.is_robot === 2">
                    <div v-if="item.content === '赞无职位推荐，请更换描述或需求'">
                      <span>赞无职位推荐，请更换描述或需求</span>
                    </div>
                    <div v-else>
                      <span>根据你的描述，为你推荐岗位如下</span><br>
                      <div style="height: 100%;width: 100%;margin-bottom: 5px" v-for="item in item.content">
                        <span style="margin-right: 50px;width: 500px;">岗位名称：{{ item.position }}</span>
                        <span><a :href="item.href" target="_blank">查看详情</a></span>
                      </div>
                    </div>
                  </div>
                  <!--   is_robot === 3 问答助手-->
                  <div v-else>
                    <div style="white-space: pre-wrap;">{{ item.content }}</div>
                    <br>
                    <div v-for="item in item.questionList"
                         style="width: fit-content; float: right;margin-left: 60px; padding: 10px;
                         border-radius: 5px; background-color: rgba(3,224,232,0.17);cursor: pointer;"
                         @click="selectGuidedQuestion(item)"
                         @mouseenter="handleMouseEnter"
                         @mouseleave="handleMouseLeave">
                      <span>{{ item.question }}</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="message-input">
            <textarea class="questionInput" v-model="inputValue" ref="inputBox" @keyup.enter="sendMessage"></textarea>
            <TextLoading class="sendIcon" v-if="isLoadingText === true"></TextLoading>
            <i v-else class="el-icon-s-promotion sendIcon" @click="sendMessage"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getRecommendData } from '@/api/recommend'
import TextLoading from '@/components/TextLoading/index'
import { getAnswer, getGuidedQuestion } from '@/api/questionAndAnswer'

export default {
  components: { TextLoading },
  data () {
    return {
      isLoadingText: false,
      modelType: '问答助手',
      responseText: [],
      guidedQuestionListLength:1,
      answer: [],
      inputValue: '', // 用于存储输入框的值
      tempInputValue: '',
      tempQuestionId: 0,
      up_one_level_question_id: 0,
      showOptionsFlag: false, // 控制选项显示与隐藏的标志
      exampleTextList: [
        /*         {
                  exampleTitle: '职位推荐',
                  exampleText: '本人本科学历，做过vue+springboot的前后端分离项目，我想找一份前端开发工程师的职位，希望在北京、深圳，请给我推荐一些职位'
                },
                {
                  exampleTitle: '学习建议',
                  exampleText: '我现在是一名大一计算机专业学生，我现在接触过Java，python,c编程语言，我比较对Java感兴趣，帮我制定一个学习计划并给我一下学习建议'
                },
                {
                  exampleTitle: '职业规划',
                  exampleText: '我目前大三上，编程语言相对比较喜欢Java，我不知道以后能做什么，请帮我做一份职业规划'
                }, */
        {
          exampleText: '针对目前的计算机就业趋势，要想在四年后找到一份前后端开发相关，月薪大于1万的工作，当下应付出什么样的努力才可以稳定实现？'
        },
        {
          exampleText: '我是计算机科学与技术专业的大一新生，我想知道从事计算机能干哪些行业？'
        },
        {
          exampleText: '如何提高自己在计算机行业中的竞争力，提升编程的思维还是别的？'
        },]
    }
  },

  methods: {
    //text为一段描述文字
    printExampleText (text) {
      this.inputValue = text
      this.tempInputValue = text
      this.sendMessage()
    },
    async sendMessage () {
      this.isLoadingText = true
      if (this.inputValue.length < 1) {
        return Message({
          message: '请输入内容！',
          type: 'warning'
        })
      } else {
        if(this.guidedQuestionListLength<1 && this.modelType !== '职位推荐'){
          this.modelType = 'ChatGPT'
        }
        this.tempInputValue = this.inputValue
        this.inputValue = ''
        if (this.modelType === 'ChatGPT') {
          await this.ChatGPTAnswer()
        } else if (this.modelType === '职位推荐') {
          await this.positionRecommendation()
        } else {
          await this.questionAnsweringAssistant()
        }
      }

    },

    async ChatGPTAnswer () {
      this.answer.push({
        role: 'user',
        content: this.tempInputValue
      })
      this.responseText.push({
        content: this.tempInputValue,
        is_robot: 1
      })
      const resp = await this.getChatGPTResponse()
      // const resp = this.gpt()
      console.log(resp)
      this.answer.push({
        role: 'system',
        content: resp
      })
      this.isLoadingText = false
      this.responseText.push({
        content: resp.content,
        is_robot: resp.is_robot
      })
    }, //ChatGPT回答
    async positionRecommendation () {
      this.responseText.push({
        content: this.tempInputValue,
        is_robot: 1
      })
      const inputValue = this.tempInputValue
      getRecommendData(inputValue).then(res => {
        const {
          code,
          data
        } = res
        if (code === 20000) {
          if (data.length < 1) {
            this.isLoadingText = false
            this.responseText.push({
              content: '赞无职位推荐，请更换描述或需求',
              is_robot: 2
            })
          } else {
            this.isLoadingText = false
            this.responseText.push({
              content: data,
              is_robot: 2
            })
          }
        } else {
          alert('获取数据失败')
        }
      })
    },

    async getChatGPTResponse () {
      const url = 'https://api.openai.com/v1/completions'
      const data = {
        prompt: this.answer.map(message => message.content).join('\n'),
        max_tokens: 2048,
        temperature: 0.5,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model: 'text-davinci-003'
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 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' // 请替换为您的API-KEY
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('网络请求错误')
      }
      const json = await response.json()
      return {
        content: json.choices[0].text,
        is_robot: 0
      }
    }, // 调用ChatGPT接口响应数据
    gpt () {
      return {
        content: '\n1. 首先，建立正确的学习态度，把学习当作一项重要的工作，不断提升自己的知识水平。\n\n2. 根据自己的兴趣爱好，选择合适的课程，认真学习，深入理解。\n\n3. 熟悉Java语言的基础知识，学习Java的开发框架，如Spring、Struts等，提高自己的编程能力。\n\n4. 熟悉常；烦恼妄想，忧苦身心；便遭浊辱，流浪生死，常沉苦海，永失真道。真常之道，悟者自得。得悟道者，常清静矣。',
        is_robot: 0
      }
    }, // 模拟测试ChatGPT回答

    async questionAnsweringAssistant () {
      this.responseText.push({
        content: this.tempInputValue,
        is_robot: 1
      })
      const question = this.tempInputValue
      await getAnswer(question).then(async res => {
        console.log("res",res)
        const formattedAnswer = res.data[0].answer.replace(/\\n/g, '\n')
        const up_one_level_question_id = res.data[0].id
        let tempGuidedQuestionList = []
        await getGuidedQuestion(up_one_level_question_id).then(async res => {
          tempGuidedQuestionList = res.data
          this.guidedQuestionListLength = tempGuidedQuestionList.length
          console.log(this.guidedQuestionListLength)
        })
        setTimeout(() => {
          this.responseText.push({
            content: formattedAnswer,
            is_robot: 3,
            questionList: tempGuidedQuestionList
          })
          this.isLoadingText = false
        }, 5000);
      })


    },

    selectGuidedQuestion (item) {
      this.isLoadingText = true
      this.tempInputValue = item.question
      this.tempQuestionId = item.id
      this.questionAnsweringAssistant()
    },

    // 模型选择
    selectChatGPTModel () {
      this.modelType = 'ChatGPT'
    },
    selectPositionRecommendationModel () {
      this.modelType = '职位推荐'
    },
    selectQuestionAnsweringAssistantModel () {
      this.modelType = '问答助手'
    },
    handleMouseEnter (event) {
      // 处理鼠标进入事件
      event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'
    },
    handleMouseLeave (event) {
      // 处理鼠标离开事件
      event.currentTarget.style.backgroundColor = 'rgba(3,224,232,0.17)'
    }
  }
}
</script>

<style lang="scss" scoped>
.ChatGPT-container {
  text-align: center;
  max-height: calc(100vh - 54px);
  overflow-y: auto;

  .home-view {
    width: 100vw;
    display: flex;
    justify-content: center;

    .chat-panel {
      display: flex;
      background-color: white;
      box-shadow: 0 0 20px 20px rgba(black, 0.05);

      .session-panel {
        width: 300px;
        padding: 20px;
        position: relative;
        border-right: 1px solid rgba(black, 0.07);
        background-color: rgb(231, 248, 255);

        .topTitle {
          text-align: left;
          /* 标题 */
          .title {
            margin-top: 5px;
            font-size: 24px;
            font-weight: bold;
          }

          /* 描述*/
          .description {
            color: rgba(black, 0.7);
            font-size: 14px;
            margin-top: 10px;
          }
        }

        .session-list {
          max-height: calc(100vh - 220px);
          overflow-y: scroll;

          .exampleTextListClass {
            position: relative; /* 设置相对定位，为遮罩层定位做准备 */
            margin: 20px 0;
            padding: 12px;
            border-radius: 10px;
            background-color: white;

            .exampleTitle {
              text-align: left;
              font-size: 20px;
              color: rgba(0, 0, 255, 0.55);
            }

            .exampleText {
              display: -webkit-box; /* 使用弹性盒子布局 */
              -webkit-line-clamp: 5; /* 最多显示两行文本 */
              -webkit-box-orient: vertical; /* 垂直方向排列 */
              overflow: hidden; /* 隐藏超出部分 */
              text-overflow: ellipsis; /* 使用省略号表示超出部分 */
              text-align: left; /* 左对齐 */
              font-size: 14px; /* 字体大小 */
              color: rgba(0, 0, 0, 0.58);
            }

            .overlay {
              position: absolute; /* 绝对定位 */
              top: 0;
              left: 0;
              border-radius: 10px;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.25); /* 半透明黑色背景 */
              display: none; /* 默认隐藏 */
            }
          }

          .exampleTextListClass:hover .overlay {
            display: block; /* 鼠标悬停时显示遮罩层 */
            cursor: pointer; /* 鼠标样式变为小手 */
          }
        }

        .more-functions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;

          .model-select {
            position: relative;
            background-color: rgba(128, 128, 128, 0.22);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
            font-size: 20px;
            overflow: hidden;
          }
        }
      }

      .message-panel {
        background-color: rgba(158, 161, 161, 0.11);
        width: calc(100vw - 344px);
        height: calc(100vh - 55px);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .chatMessage {
          position: absolute;
          top: 0;
          width: 100%;
          max-height: calc(100vh - 140px);
          overflow-y: scroll;
          display: flex;
          justify-content: center;

          .chatBox {
            border-radius: 1px;
            width: 100%;
            height: auto;

            .robot {
              width: 100%;
              padding: 10px 130px;
              text-align: left;
              background-color: rgba(159, 164, 163, 0.13);
              box-shadow: 0 0 2px 2px rgba(128, 128, 128, 0.24);
            }

            .user {
              padding: 10px 130px;
              width: 100%;
              text-align: left;
            }
          }
        }

        .message-input {
          position: absolute;
          bottom: 20px;
          text-align: center;

          .questionInput {
            resize: none; /* 防止用户调整文本区域大小 */
            display: flex;
            justify-content: right;
            position: relative;
            width: 800px;
            max-height: 200px;
            height: 50px;
            line-height: normal; /* 可以根据需要调整行间距 */
            font-size: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px 10px rgba(128, 128, 128, 0.24);
          }

          .sendIcon {
            position: absolute;
            right: 10px;
            bottom: 10px;
            font-size: 35px; /* 设置为30像素 */
          }
        }
      }
    }
  }
}

::-webkit-scrollbar {
  --bar-width: 5px;
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-clip: content-box;
  border: 1px solid transparent;
}

</style>
