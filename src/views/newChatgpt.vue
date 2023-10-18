<style>
.chatContent {
  height: 735px;
  overflow-x: hidden;
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
}

li.left span {
  display: inline-block;
  border-radius: 0 15px 15px;
  background-color: rgba(66, 196, 240, 0.1);
  padding: 10px 15px;
}

li.right {
  margin-left: 20px;
  text-align: right;
}

li.right span {
  display: inline-block;
  border-radius: 15px 0 15px 15px;
  background-color: rgba(73, 154, 41, 0.1);
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
</style>

<template>
  <div class="sendBox">
    <div class="chatContent" ref="chatBox">
      <ul>
        <li v-for="(item, index) in responseText" :key="index" :class="[item.is_robot === 0 ? 'left' : 'right']">
          <span>{{ item.content }}</span>
        </li>
      </ul>
    </div>
    <el-input v-model="inputValue" placeholder="Please input" class="input-with-select">
      <template #append>
        <el-button @click="sendmsg" type="primary">发送
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
      inputValue: '',
      responseText: [],
      answer: []
    }
  },
  // 发送消息
  methods: {
    gpt () {
      return {
        content: 'nihao',
        is_robot: 0
      }
    },
    async sendmsg () {
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
