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

      const response = this.gpt()
      await this.printMessage(response.content)
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
    // async printMessage (message) {
    //   this.responseText += message;
    //   return Promise.resolve();
    // },

    printMessage (message) {
      return new Promise((resolve) => {
        let index = 0
        const responseText = document.getElementById('chatgpt-response')

        const interval = setInterval(() => {
          responseText.innerHTML += message[index]
          index++

          if (index >= message.length) {
            clearInterval(interval)
            resolve()
          }
        }, 50)
      })
    },

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















<!--<template>
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
</style>-->







































