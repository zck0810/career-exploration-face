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
            <div v-for="(item, index) in exampleTextList" :key="index" class="exampleTextListClass" @click="printExampleText(item.exampleText)">
              <div class="exampleTitle">{{ item.exampleTitle }}</div>
              <div class="exampleText">{{ item.exampleText }}</div>
              <div class="overlay"></div> <!-- 遮罩层 -->
            </div>
          </div>
          <div class="more-functions">
            <div class="model-select" @click="showOptions">
              <span>模型选择</span>
              <div class="dots-container">
                <div class="dot" ></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              <div v-if="showOptionsFlag" class="options">
                <div @click="selectModel('ChatGPT')">ChatGPT</div>
                <div @click="selectModel('职位推荐')">职位推荐</div>
                <div @click="selectModel('学习建议')">学习建议</div>
                <div @click="selectModel('职业规划')">职业规划</div>
              </div>
            </div>
          </div>
        </div>
        <div class="message-panel">
          <div class="chatMessage">
            <div class="chatBox" id="chatBox">
              <el-row v-for="(item, index) in responseText" :key="index" :class="[item.is_robot === 0 ? 'robot' : 'user']">
                <el-col :span="2">
                  <img :src="item.is_robot === 0 ? require('@/assets/image/aiLogo.jpg') : require('@/assets/image/user.jpg')" style="width: 30px; height: 30px;">
                </el-col>
                <el-col :span="22">{{ item.content }}</el-col>
              </el-row>
            </div>
          </div>
          <div class="message-input">
            <textarea  class="questionInput" v-model="inputValue" @keyup.enter="sendMessage"></textarea>
            <i class="el-icon-s-promotion sendIcon" @click="sendMessage"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  data(){
    return{
      responseText:[],
      answer: [],
      inputValue: '', // 用于存储输入框的值
      showOptionsFlag: false, // 控制选项显示与隐藏的标志
      exampleTextList:[{
        exampleTitle:'职位推荐',
        exampleText: '本人本科学历，做过vue+springboot的前后端分离项目，我想找一份前端开发工程师的职位，希望在北京、深圳，请给我推荐一些职位'
      },
        {
          exampleTitle:'学习建议',
          exampleText: '我现在是一名大一计算机专业学生，我现在接触过Java，python,c编程语言，我比较对Java感兴趣，帮我制定一个学习计划并给我一下学习建议'
        },
        {
          exampleTitle:'职业规划',
          exampleText: '我目前大三上，编程语言相对比较喜欢Java，我不知道以后能做什么，请帮我做一份职业规划'
        }]
    }
  },

  methods: {
    printExampleText(text) {
      console.log(text); // 打印示例文本的值
    },
    showOptions() {
      this.showOptionsFlag = !this.showOptionsFlag; // 点击时切换选项的显示与隐藏
    },
    selectModel(model) {
      console.log('选择了模型：', model); // 在这里可以处理选项的选择逻辑
    },
    async sendMessage () {
      if (this.inputValue.length < 1) {
        return Message({
          message: '不能发送空消息！',
          type: 'error'
        })
      }
      this.answer.push({
        role: 'user',
        content: this.inputValue
      })
      this.responseText.push({
        content: this.inputValue,
        is_robot: 1
      })
      const resp = await this.getChatGPTResponse()
      this.answer.push({
        role: 'system',
        content: resp
      })
      this.responseText.push(resp)
      // 清除数据框
      this.inputValue = ''
      const div = document.getElementById('chatBox')
      div.scrollTop = div.scrollHeight;
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
    }
   /*  gpt () {
      return {
        content: '老君曰：大道无形，生育天地；大道无情，运行日月；大道无名，长养万物；吾不知其名，强名曰道。夫道者：有清有浊，有动有静；天清地浊，天动地静；男清女浊，男动女静。降本流末，而生万物。清者浊之源，动者静之基。人能常清静，天地悉皆归。\n' +
          '\n' +
          '夫人神好清，而心扰之；人心好静，而欲牵之。常能遣其欲而心自静，澄其心而神自清。自然六欲不生，三毒消灭。所以不能者，为心未澄，欲未遣也。能遣之者，内观于心，心无其心；外观于形，形无其形；远观于物，物无其物。三者既悟，唯见于空。观空亦空，空无所空；所空既无，无无亦无；无无既无，湛然常寂；寂无所寂，欲岂能生？欲既不生，即是真静。真常应物，真常得性；常应常静，常清静矣。如此清静，渐入真道；既入真道，名谓得道，虽名得道，实无所得；为化众生，名谓得道；能悟之者，可传圣道。\n' +
          '\n' +
          '老君曰：上士无争，下士好争；上德不德，下德执德；执著之者，不名道德。众生所以不得真道者，为有妄心。既有妄心，即惊其神；既惊其神，即著万物；既著万物，即生贪求；既生贪求，即是烦恼；烦恼妄想，忧苦身心；便遭浊辱，流浪生死，常沉苦海，永失真道。真常之道，悟者自得。得悟道者，常清静矣。',
        is_robot: 0
      }
    }, */
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

      .session-panel{
        width: 300px;
        padding: 20px;
        position: relative;
        border-right: 1px solid rgba(black, 0.07);
        background-color: rgb(231, 248, 255);
        .topTitle{
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
        .session-list{
          .exampleTextListClass{
            position: relative; /* 设置相对定位，为遮罩层定位做准备 */
            margin: 20px 0;
            padding: 12px;
            border-radius: 10px;
            background-color: white;
            .exampleTitle{
              text-align: left;
              font-size: 20px;
              color: rgba(0, 0, 255, 0.55);
            }
            .exampleText{
              display: -webkit-box; /* 使用弹性盒子布局 */
              -webkit-line-clamp: 2; /* 最多显示两行文本 */
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
        .more-functions{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          .model-select{
            position: relative;
            background-color: rgba(128, 128, 128, 0.22);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-size: 20px;
            .dots-container {
              display: flex;
              margin-left: 150px;
              .dot {
                width: 6px;
                height: 6px;
                background-color: rgba(0, 0, 0, 0.8);
                border-radius: 50%;
                margin-right: 5px;
                cursor: pointer;
              }
            }
            .options {
              position: absolute;
              top: -140px;
              border-radius: 20px 20px 0 20px;
              width: 90%;
              background-color: rgba(19, 23, 18, 0.56);
              color: white;
              /* 其他样式... */
              /* 注意：需要根据实际需求来定义选项的样式 */
               div {
                padding: 5px;
                cursor: pointer;
              }
              div:hover {
                background-color: rgba(0, 216, 255, 0.51);
              }
            }

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

        .chatMessage{
          position: absolute;
          top: 0;
          width: 100%;
          max-height: calc(100vh - 140px);
          overflow-y: scroll;
          display: flex;
          justify-content: center;
          .chatBox{
            border-radius: 1px;
            width: 100%;
            height: auto;

            .robot{
              width: 100%;
              padding: 10px 130px;
              text-align: left;
              background-color: rgba(159, 164, 163, 0.13);
              box-shadow: 0 0 2px 2px rgba(128, 128, 128, 0.24);
            }
            .user{
              padding: 10px 130px;
              width: 100%;
              text-align: left;
            }
          }
        }

        .message-input{
          position: absolute;
          bottom: 20px;
          text-align: center;

          .questionInput{
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
          .sendIcon{
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











<!--<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <div v-if="message.role === 'user'" class="user-message">
          用户：{{ message.content }}
        </div>
        <div v-else class="assistant-message">
          助手：{{ message.content }}
        </div>
      </div>
    </div>
    <div class="input-container">
      <input v-model="userInput" class="input-field" @keyup.enter="sendMessage" placeholder="输入消息..." />
      <button @click="sendMessage" class="send-button">发送</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.messages {
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
}

.user-message {
  color: #333;
}

.assistant-message {
  color: #0066CC;
}

.input-container {
  display: flex;
  align-items: center;
}

.input-field {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
}

.send-button {
  padding: 8px 16px;
  background-color: #0066CC;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
</style>

<script>
export default {
  data() {
    return {
      messages: [],
      accessToken: '',
      userInput: ''
    };
  },

  methods: {
    getAccessToken() {
      const apiKey = 'BWWs2m5UZY5ntU5zTMijWInG'; // 替换成你的应用API Key
      const secretKey = 'doCGBpeWzp0q5h1orjYGx83iz8AfCEhm'; // 替换成你的应用Secret Key
      const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          this.accessToken = data.access_token;
        })
        .catch(error => {
          console.error('获取access_token失败', error);
        });
    },

    sendMessage() {
      const userMessage = {
        role: 'user',
        content: this.userInput
      };
      this.messages.push(userMessage);
      this.userInput = '';

      const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${this.accessToken}`;
      const payload = {
        messages: this.messages
      };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(data => {
          this.messages = data;
        })
        .catch(error => {
          console.error('发送消息失败', error);
        });
    }
  },

  mounted() {
    this.getAccessToken();
  }
}
</script>-->



<!--
<template>
  <div id="body-div" class="ChatGPT-container">
    <div class="welcome" v-show="dialogBox === '1'">
      欢迎使用AI助手
    </div>
    <div  class="chatContainer" v-show="dialogBox === '0'">
      <div class="chatContent">
        <ul>
          <li v-for="(item, index) in responseText" :key="index" :class="[item.is_robot === 0 ? 'left' : 'right']">
            <span>{{ item.content }}</span>
          </li>
        </ul>
      </div>
    </div>
    <el-input v-model="inputValue" placeholder="Please input" class="input-with-select" @keyup.enter.native="sendMsg">
      <template #append>
        <el-button @click="sendMsg" type="primary">发送
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'newChatgpt',
  data () {
    return {
      dialogBox: '1',
      inputValue: '',
      responseText: [],
      answer: [],
    }
  },
  // 发送消息
  methods: {
    gpt () {
      return {
        content: '老君曰：大道无形，生育天地；大道无情，运行日月；大道无名，长养万物；吾不知其名，强名曰道。夫道者：有清有浊，有动有静；天清地浊，天动地静；男清女浊，男动女静。降本流末，而生万物。清者浊之源，动者静之基。人能常清静，天地悉皆归。\n' +
          '\n' +
          '夫人神好清，而心扰之；人心好静，而欲牵之。常能遣其欲而心自静，澄其心而神自清。自然六欲不生，三毒消灭。所以不能者，为心未澄，欲未遣也。能遣之者，内观于心，心无其心；外观于形，形无其形；远观于物，物无其物。三者既悟，唯见于空。观空亦空，空无所空；所空既无，无无亦无；无无既无，湛然常寂；寂无所寂，欲岂能生？欲既不生，即是真静。真常应物，真常得性；常应常静，常清静矣。如此清静，渐入真道；既入真道，名谓得道，虽名得道，实无所得；为化众生，名谓得道；能悟之者，可传圣道。\n' +
          '\n' +
          '老君曰：上士无争，下士好争；上德不德，下德执德；执著之者，不名道德。众生所以不得真道者，为有妄心。既有妄心，即惊其神；既惊其神，即著万物；既著万物，即生贪求；既生贪求，即是烦恼；烦恼妄想，忧苦身心；便遭浊辱，流浪生死，常沉苦海，永失真道。真常之道，悟者自得。得悟道者，常清静矣。',
        is_robot: 0
      }
    },
    async sendMsg () {
      this.dialogBox = '0'
      if (this.inputValue.length < 1) {
        return Message({
          message: '不能发送空消息！',
          type: 'error'
        })
      }
      this.answer.push({
        role: 'user',
        content: this.inputValue
      })
      this.responseText.push({
        content: this.inputValue,
        is_robot: 1
      })
      const resp = this.gpt()
      this.answer.push({
        role: 'system',
        content: resp
      })
      this.responseText.push(resp)
      // 清除数据框
      this.inputValue = ''
      const div = document.getElementById('body-div')
      div.scrollTop = div.scrollHeight;
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
    }
  }
}

</script>

<style scoped>
.ChatGPT-container {
  text-align: center;
  max-height: calc(100vh - 54px);
  overflow-y: auto;
}
.chatContent {
  margin: 10px 20%;
  text-align: center;
  background-color: rgba(123, 124, 124, 0.23);
  border-radius: 10px;
  /*overflow-y: auto;*/
}
.chatContainer{
  height: calc(100vh - 140px);
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}
.welcome{
  line-height: calc(100vh - 500px);
  font-size: 40px;
  height: calc(100vh - 140px);
  max-height: calc(100vh - 140px);
}
ul {
  list-style: none;
  padding: 20px;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

li.left {
  margin-right: 20px;
  text-align: left;
}

li.left span {
  display: inline-block;
  border-radius: 0 15px 15px;
  background-color: rgba(66, 196, 240, 0.32);
  padding: 10px 15px;
}

li.right {
  margin-left: 20px;
  text-align: right;
}

li.right span {
  display: inline-block;
  border-radius: 15px 0 15px 15px;
  background-color: rgba(73, 154, 41, 0.25);
  padding: 10px 15px;
}

li + li {
  margin-top: 20px;
}

.ql-container.ql-snow {
  border: 0;
}

.ql-editor {
  padding: 0;
}
.input-with-select{
  border-radius: 10px;
  width: 60%;
}
</style>
-->
