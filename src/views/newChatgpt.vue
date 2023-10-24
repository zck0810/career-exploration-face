<template>
  <div id="wenti-body-div" class="ChatGPT-container">
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
      answer: []
    }
  },
  // 发送消息
  methods: {
    gpt () {
      return {
        content: '你好',
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
      const resp =await this.getChatGPTResponse()
      this.answer.push({
        role: 'system',
        content: resp
      })
      this.responseText.push(resp)
      // 清除数据框
      this.inputValue = ''
      var div = document.getElementById('wenti-body-div');
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
  margin: 10px 10%;
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
  width: 80%;
}
</style>
