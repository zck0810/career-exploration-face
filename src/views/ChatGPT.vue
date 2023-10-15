<template>
  <div class="ChatGPT-container">
    <input
      class="input-box"
      v-model="inputValue"
      placeholder="输入描述"
      @keydown.enter.prevent="callCHATGPT"
    >
    <button
      @click="callCHATGPT"
      class="answer-box"
    >
      回答
    </button>
    <textarea
      id="chatgpt-response"
      v-model="responseText"
      placeholder="请耐心等待回答 Ai生成它很快，但是由于网络问题我们需要等待，通常内容越长等待越久 如果长时间没反应请刷新页面重试"
      rows="26"
      resize="none"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: 'ChatGPT',
  data () {
    return {
      inputValue: '',
      responseText: '',
      loading: false,
    }
  },
  methods: {
    async callCHATGPT () {
      this.responseText = '' // 清空响应文本框
      this.loading = true // 开始加载动画
      await this.printMessage(this.inputValue + '?\n')
      await this.printMessage('正在思考，请等待......')

      const response = await this.getChatGPTResponse()
      console.log(response)
      await this.printMessage(response)
      this.loading = false // 结束加载动画

    },
    async getChatGPTResponse () {
      const url = 'https://api.openai.com/v1/completions'
      const data = {
        prompt: this.inputValue,
        max_tokens: 2048,
        temperature: 0.5,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model: 'text-davinci-003',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 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', // 请替换为您的API-KEY
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('网络请求错误')
      }

      const json = await response.json()
      return json.choices[0].text
    },
    async printMessage (message) {
      this.responseText += message;
      return Promise.resolve();
    },

    // printMessage (message) {
    //   return new Promise((resolve) => {
    //     let index = 0
    //     const responseText = document.getElementById('chatgpt-response')
    //
    //     const interval = setInterval(() => {
    //       responseText.innerHTML += message[index]
    //       index++
    //
    //       if (index >= message.length) {
    //         clearInterval(interval)
    //         resolve()
    //       }
    //     }, 50)
    //   })
    // },
  },
}
</script>

<style scoped>
.ChatGPT-container {
  text-align: center;
  max-height: calc(100vh - 54px);
  overflow-y: auto;
}

#chatgpt-response {
  font-size: 20px;
  font-weight: bold;
  width: 90%;
  height: auto;
  background-color: rgba(128, 128, 128, 0.24);
  color: black;
  border: 2px solid #ccc;
  border-radius: 10px;
  overflow: auto;
}

.input-box {
  width: 70%;
  margin: 20px auto;
  background-color: rgba(128, 128, 128, 0.2);
  color: #333;
  border: 1px solid #ccc;
  border-radius: 12px;
  height: 50px;
  font-size: 18px;
}

.answer-box {
  background-color: rgba(0, 72, 255, 0.38);
  color: #f4f4f4;
  border-radius: 10px;
  height: 50px;
  width: 100px;
  margin-left: 10px;
  font-size: 20px
}
</style>
