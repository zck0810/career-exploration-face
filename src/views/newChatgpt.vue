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
              <el-button @click="selectChatGPTModel"
                         :class="buttonColorChange === 'ChatGPT' ? 'becomeSkyblue' : 'becomeWhite'">ChatGPT
              </el-button>
              <el-button @click="selectPositionRecommendationModel"
                         :class="buttonColorChange === '职位推荐' ? 'becomeSkyblue' : 'becomeWhite'">职位推荐
              </el-button>
              <el-button @click="selectQuestionAnsweringAssistantModel"
                         :class="buttonColorChange === '问答助手' ? 'becomeSkyblue' : 'becomeWhite'">问答助手(默认)
              </el-button>
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
                      <span>赞无职位推荐，提示：输入带有关键词（比如想要找的职位、岗位所在城市、薪资，学历、会什么技术等）的描述推荐会更准确哦！</span>
                    </div>
                    <div v-else>
                      <span>根据你的描述，为你推荐岗位如下</span><br>
                      <el-row style="height: 100%;width: 100%;margin-bottom: 5px" v-for="item in item.content">
                        <el-col :span="10" >岗位名称：{{ item.position }}</el-col>
                        <el-col :span="8" >所在城市：{{ item.city }}</el-col>
                        <el-col :span="6" ><a :href="item.href" target="_blank">查看详情</a></el-col>
                      </el-row>
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
  import {Message} from 'element-ui'
  import {getRecommendData} from '@/api/recommend'
  import TextLoading from '@/components/TextLoading/index'
  import {getAnswer, getGuidedQuestion} from '@/api/questionAndAnswer'
  import {getPositionRecommendationData} from '@/api/liepin'

  export default {
    components: {TextLoading},
    data() {
      return {
        buttonColorChange: '职位推荐',
        isLoadingText: false,
        modelType: '职位推荐',
        responseText: [],
        guidedQuestionListLength: 1,
        answer: [],
        inputValue: '', // 用于存储输入框的值
        tempInputValue: '',
        tempQuestionId: 0,
        up_one_level_question_id: 0,
        showOptionsFlag: false, // 控制选项显示与隐藏的标志
        tempCityList: ['北京',
          '上海',
          '深圳',
          '杭州',
          '广州',
          '成都',
          '南京',
          '武汉',
          '苏州',
          '西安',
          '天津',
          '大连',
          '合肥',
          '长沙',
          '重庆',
          '厦门',
          '太原',
          '南宁',
          '无锡',
          '石家',
          '福州',
          '哈尔',
          '南昌',
          '宁波',
          '沈阳',
          '海口',
          '济南',
          '东莞',
          '青岛',
          '长春',
          '佛山',
          '常州',
          '珠海',
          '柳州',
          '芜湖',
          '保定',
          '廊坊',
          '桂林',
          '宁德',
          '三亚',
          '嘉兴',
          '徐州',
          '南通',
          '泉州',
          '唐山',
          '郑州',
          '温州',
          '惠州',
          '赣州',
          '晋中',
          '烟台',
          '金华',
          '潍坊',
          '株洲',
          '湖州',
          '中山',
          '绍兴',
          '雄安',
          '绵阳',
          '秦皇',
          '扬州',
          '淄博',
          '镇江',
          '沧州',
          '上饶',
          '滁州',
          '盐城',
          '邯郸',
          '澄迈',
          '长治',
          '运城',
          '钦州',
          '临沂',
          '大庆',
          '湘潭',
          '临汾',
          '台州',
          '晋城',
          '邢台',
          '大同',
          '北海',
          '泰州',
          '池州',
          '九江',
          '贵阳',
          '蚌埠',
          '梧州',
          '昆明',
          '阜阳',
          '淮安',
          '连云',
          '东营',
          '宜宾',
          '张家',
          '吕梁',
          '聊城',
          '忻州',
          '宿迁',
          '阳泉',
          '济宁',
          '衡阳',
          '莆田',
          '朔州',
          '汕头',
          '宣城',
          '吉安',
          '马鞍',
          '安庆',
          '牡丹',
          '兰州',
          '文昌',
          '万宁',
          '衡水',
          '齐齐',
          '贵港',
          '儋州',
          '陵水',
          '眉山',
          '宜春',
          '新余',
          '佳木',
          '承德',
          '菏泽',
          '常德',
          '琼海',
          '滨州',
          '郴州',
          '泸州',
          '漳州',
          '吉林',
          '岳阳',
          '崇左',
          '安徽',
          '资阳',
          '威海',
          '宿州',
          '龙岩',
          '德阳',
          '玉林',
          '湛江',
          '泰安',
          '淮南',
          '娄底',
          '乌鲁',
          '百色',
          '枣庄',
          '绥化',
          '抚州',
          '乐山',
          '防城',
          '德州',
          '营口',
          '梅州',
          '铜陵',
          '亳州',
          '来宾',
          '清远',
          '益阳',
          '萍乡',
          '肇庆',
          '揭阳',
          '自贡',
          '河池',
          '贺州',
          '邵阳',
          '临高',
          '丽水',
          '鞍山',
          '保亭',
          '延边',
          '遂宁',
          '景德',
          '六安',
          '鹰潭',
          '新乡',
          '永州',
          '雅安',
          '四川',
          '鄂尔',
          '日照',
          '洛阳',
          '西宁',
          '南充',
          '乐东',
          '昌江',
          '通化',
          '云浮',
          '海南',
          '定安',
          '湘西',
          '南阳',
          '银川',
          '广东',
          '黄山',
          '福建',
          '伊春',
          '衢州',
          '江门',
          '许昌',
          '湖南',
          '鸡西',
          '浙江',
          '河北',
          '咸阳',
          '舟山',
          '琼中',
          '锦州',
          '广元',
          '茂名',
          '江苏',
          '白沙',
          '襄阳',
          '达州',
          '酒泉',
          '东方',
          '济源',
          '信阳',
          '大理',
          '南平',
          '抚顺',
          '焦作',
          '呼和',
          '盘锦',
          '阳江',
          '鹤岗',
          '安阳',
          '铜仁',
          '咸宁',
          '天水',
          '攀枝',
          '葫芦',
          '五指',
          '平顶',
          '曲靖',
          '阿坝',
          '黄冈',
          '内江',
          '怀化',
          '仙桃',
          '朝阳',
          '淮北',
          '恩施',
          '黑河',
          '双鸭',
          '宝鸡',
          '广安',
          '辽源',
          '三明',
          '黑龙',
          '丹东',
          '白城',
          '杨凌',
          '红河',
          '辽阳',
          '三门',
          '十堰',
          '孝感',
          '荆州',
          '四平',
          '荆门',
          '驻马',
          '南山区',
          '海淀区',
          '高新区',
          '浦东新区',
          '天河区',
          '朝阳区',
          '高新区',
          '洪山区',
          '工业园区',
          '滨江区',
          '雨花台区',
          '余杭区',
          '福田区',
          '西湖区',
          '甘井子区',
          '江夏区',
          '武侯区',
          '黄埔区',
          '江宁区',
          '雁塔区',
          '龙岗区',
          '海珠区',
          '岳麓区',
          '徐汇区',
          '闵行区',
          '西青区',
          '番禺区',
          '高新区',
          '渝北区',
          '建邺区',
          '宝安区',
          '滨海新区',
          '杨浦区',
          '虎丘区',
          '吴中区',
          '武昌区',
          '浦口区',
          '郫都区',
          '沙河口区',
          '蜀山区',
          '长宁区',
          '越秀区',
          '双流区',
          '静安区',
          '黄浦区',
          '上城区',
          '龙华区',
          '萧山区',
          '锦江区',
          '相城区',
          '小店区',
          '昆山',
          '东丽区',
          '包河区',
          '西城区',
          '拱墅区',
          '鼓楼区',
          '白云区',
          '秦淮区',
          '思明区',
          '大兴区',
          '丰台区',
          '新吴区',
          '东城区',
          '昌平区',
          '玄武区',
          '青秀区',
          '普陀区',
          '嘉定区',
          '罗湖区',
          '南开区',
          '良庆区',
          '通州区',
          '成华区',
          '金牛区',
          '长安区',
          '江汉区',
          '未央区',
          '南岗区',
          '河西区',
          '东西湖区',
          '栖霞区',
          '经开区',
          '吴江区',
          '青羊区',
          '裕华区',
          '鄞州区',
          '龙华区',
          '长沙县',
          '钱塘区',
          '虹口区',
          '鼓楼区',
          '香洲区',
          '开福区',
          '蔡甸区',
          '顺德区',
          '荔湾区',
          '集美区',
          '江岸区',
          '坪山区',
          '松北区',
          '石景山区',
          '武清区',
          '渝中区',
          '南沙区',
          '和平区',
          '浑南区',
          '红谷滩区',
          '姑苏区',
          '江北区',
          '中山区',
          '高新区',
          '顺义区',
          '美兰区',
          '松江区',
          '桥西区',
          '长安区',
          '雨花区',
          '松山湖',
          '湖里区',
          '临平区',
          '锡山区',
          '沙坪坝区',
          '青浦区',
          '宝山区',
          '芙蓉区',
          '碑林区',
          '常熟',
          '闽侯县',
          '高新区',
          '汉阳区',
          '太仓',
          '滨湖区',
          '天心区',
          '西乡塘区',
          '经开区',
          '花都区',
          '台江区',
          '武进区',
          '光明区',
          '金州区',
          '南岸区',
          '南海区',
          '肥西县',
          '铁西区',
          '万柏林区',
          '广阳区',
          '青山湖区',
          '蕉城区',
          '香坊区',
          '张家港',
          '硚口区',
          '新站区',
          '九龙坡区',
          '仓山区',
          '秀英区',
          '津南区',
          '历城区',
          '新城区',
          '河东区',
          '莲湖区',
          '崂山区',
          '崇川区',
          '慈溪',
          '新北区',
          '庐阳区',
          '莲池区',
          '柳南区',
          '江南区',
          '迎泽区',
          '榆次区',
          '盐田区',
          '北辰区',
          '历下区',
          '南湖区',
          '沈河区',
          '市中区',
          '翔安区',
          '高新区',
          '黄岛区',
          '增城区',
          '六合区',
          '和平区',
          '道里区',
          '新华区',
          '红桥区',
          '弋江区',
          '南关区',
          '鸠江区',
          '城阳区',
          '海曙区',
          '北碚区',
          '南昌县',
          '惠山区',
          '青山区',
          '西岗区',
          '江阴',
          '杏花岭区',
          '钟楼区',
          '禅城区',
          '富阳区',
          '容城县',
          '龙泉驿区',
          '鹿泉区',
          '温江区',
          '七星区',
          '晋安区',
          '市南区',
          '黄陂区',
          '章贡区',
          '惠城区',
          '郑东新区',
          '吉阳区',
          '奉贤区',
          '梁溪区',
          '净月区',
          '市北区',
          '金坛区',
          '河北区',
          '琼山区',
          '朝阳区',
          '鱼峰区',
          '江北区',
          '望城区',
          '南城区',
          '东湖区',
          '竞秀区',
          '邗江区',
          '崖州区',
          '巴南区',
          '丰泽区',
          '崇州',
          '三河',
          '吴兴区',
          '马尾区',
          '晋江',
          '北仑区',
          '路南区',
          '晋源区',
          '道外区',
          '路北区',
          '新建区',
          '大渡口区',
          '新都区',
          '溧水区',
          '同安区',
          '平房区',
          '信州区',
          '义乌',
          '余姚',
          '临桂区',
          '鼓楼区',
          '瑶海区',
          '临安区',
          '皇姑区',
          '尖草坪区',
          '婺城区',
          '西湖区',
          '嘉善县',
          '如皋',
          '龙湾区',
          '金山区',
          '旅顺口区',
          '绿园区',
          '金水区',
          '天宁区',
          '房山区',
          '政务区',
          '钦南区',
          '芝罘区',
          '灞桥区',
          '海宁',
          '宜兴',
          '城中区',
          '越城区',
          '兴宁区',
          '东城区',
          '盐湖区',
          '镇海区',
          '静海区',
          '固安县',
          '海沧区',
          '高新区',
          '铜山区',
          '平湖',
          '青云谱区',
          '横琴新区',
          '海港区',
          '亭湖区',
          '宁乡',
          '大东区',
          '乐清',
          '槐荫区',
          '鹿城区',
          '海门区',
          '柳北区',
          '宿豫区',
          '天元区',
          '清江浦区',
          '李沧区',
          '怀柔区',
          '肥东县',
          '沈北新区',
          '莱山区',
          '江津区',
          '龙凤区',
          '涪陵区',
          '张店区',
          '璧山区',
          '石峰区',
          '天涯区',
          '宝坻区',
          '从化区',
          '潞州区',
          '万秀区',
          '惠阳区',
          '瓯海区',
          '海安',
          '汉南区',
          '鲤城区',
          '涪城区',
          '奎文区',
          '福山区',
          '门头沟区',
          '京口区',
          '斗门区',
          '长乐区',
          '叙州区',
          '平城区',
          '汽开区',
          '经开区',
          '高淳区',
          '即墨区',
          '椒江区',
          '来安县',
          '贾汪区',
          '东昌府区',
          '万州区',
          '濂溪区',
          '迁安',
          '忻府区',
          '长丰县',
          '桐乡',
          '海城区',
          '任城区',
          '彭州',
          '高陵区',
          '双城区',
          '东营区',
          '南明区',
          '诸暨',
          '江都区',
          '滨湖区',
          '渝水区',
          '新洲区',
          '运河区',
          '永川区',
          '通州区',
          '长兴县',
          '上虞区',
          '兰山区',
          '柯桥区',
          '经开区',
          '盐都区',
          '云龙区',
          '南谯区',
          '蚌山区',
          '浏阳',
          '奉化区',
          '于洪区',
          '武陵区',
          '寮步镇',
          '天桥区',
          '海棠区',
          '东安区',
          '海州区',
          '丹徒区',
          '信都区',
          '秀洲区',
          '南浔区',
          '新津区',
          '安吉县',
          '宽城区',
          '安次区',
          '岳塘区',
          '高碑店',
          '桥西区',
          '观山湖区',
          '岳阳楼区',
          '扶绥县',
          '泉山区',
          '海陵区',
          '万江区',
          '武鸣区',
          '平谷区',
          '邕宁区',
          '宁海县',
          '厚街镇',
          '贵池区',
          '正定县',
          '塘厦镇',
          '繁昌区',
          '镜湖区',
          '常平镇',
          '谯城区',
          '迎江区',
          '大邑县',
          '汾阳',
          '润州区',
          '金湾区',
          '丛台区',
          '莞城区',
          '港口区',
          '长安镇',
          '邯山区',
          '洛江区',
          '尧都区',
          '清徐县',
          '二七区',
          '安宁区',
          '西山区',
          '介休',
          '娄星区',
          '青白江区',
          '泰兴',
          '阿城区',
          '琅琊区',
          '城区',
          '武义县',
          '凤岗镇',
          '溧阳',
          '胶州',
          '金东区',
          '上党区',
          '灵山县',
          '浔阳区',
          '双桥区',
          '和县',
          '象山区',
          '雨山区',
          '朔城区',
          '丹阳',
          '长清区',
          '合川区',
          '铁山港区',
          '吉州区',
          '海盐县',
          '清溪镇',
          '长洲区',
          '高明区',
          '新华区',
          '离石区',
          '桐庐县',
          '翠屏区',
          '颍州区',
          '金城江区',
          '二道区',
          '富锦',
          '右江区',
          '宁国',
          '简阳',
          '郊区',
          '呼兰区',
          '宣州区',
          '都江堰',
          '庄河',
          '岱岳区',
          '桥东区',
          '管城区',
          '沂南县',
          '环翠区',
          '临海',
          '丹棱县',
          '北林区',
          '澄海区',
          '密云区',
          '游仙区',
          '巢湖',
          '桃城区',
          '曹妃甸区',
          '德城区',
          '寒亭区',
          '栾城区',
          '永康',
          '自流井区',
          '康巴什区',
          '旌阳区',
          '涧西区',
          '城西区',
          '通川区',
          '肃州区',
          '博望区',
          '大岭山',
          '宁河区',
          '湾沚区',
          '大朗镇',
          '东乡区',
          '花山区',
          '清城区',
          '铜官区',
          '临川区',
          '英德',
          '云阳县',
          '金凤区',
          '宜秀区',
          '揭东区',
          '爱民区',
          '三水区',
          '榕城区',
          '瑞安',
          '船山区',
          '南川区',
          '樟木头',
          '红旗区',
          '襄垣县',
          '月湖区',
          '苏家屯区',
          '蓬溪县',
          '沙田镇',
          '鄠邑区',
          '句容',
          '银海区',
          '福清',
          '南宫',
          '大足区',
          '扬中',
          '如东县',
          '龙港',
          '阎良区',
          '石碣镇',
          '前进区',
          '云冈区',
          '襄都区',
          '九台区',
          '向阳区',
          '颍泉区',
          '铁锋区',
          '徐水区',
          '萨尔图区',
          '古交',
          '龙沙区',
          '南安',
          '虎门镇',
          '樟树',
          '平果市',
          '茂南区',
          '桂平',
          '高安',
          '港北区',
          '双清区',
          '呈贡区',
          '延吉',
          '官渡区',
          '寿县',
          '湘潭县',
          '翼城县',
          '城关区',
          '怀安县',
          '盘龙区',
          '雨湖区',
          '新昌县',
          '牡丹区',
          '綦江区',
          '广信区',
          '涟水县',
          '姜堰区',
          '站前区',
          '八步区',
          '冷水滩区',
          '平桂区',
          '铜梁区',
          '罗庄区',
          '荷塘区',
          '安达',
          '长寿区',
          '莲都区',
          '温岭',
          '江州区',
          '靖江',
          '彭山区',
          '禹会区',
          '东阳',
          '祁县',
          '高港区',
          '信丰县',
          '汝城县',
          '乐亭县',
          '平度',
          '金平区',
          '博兴县',
          '南康区',
          '延庆区',
          '广陵区',
          '高平',
          '龙湖区',
          '五通桥区',
          '浮梁县',
          '龙马潭区',
          '赣县区',
          '市中区',
          '玉田县',
          '永福县',
          '恩平',
          '洛龙区',
          '寿光',
          '柯城区',
          '白塔区',
          '柴桑区',
          '高邮',
          '台安县',
          '灵川县',
          '昌邑',
          '普陀区',
          '桃源县',
          '五台县',
          '秀峰区',
          '西工区',
          '海阳',
          '藁城区',
          '临潼区',
          '临猗县',
          '钦北区',
          '安义县',
          '定襄县',
          '围场县',
          '荔浦市',
          '周至县',
          '平陆县',
          '丰都县',
          '都昌县',
          '遵化',
          '象山县',
          '岢岚县',
          '珠山区',
          '辛集',
          '永济',
          '新兴县',
          '阳朔县',
          '兴庆区',
          '繁峙县',
          '望花区',
          '武乡县',
          '驿城区',
          '兴宾区',
          '雁山区',
          '陕州区',
          '伊美区',
          '进贤县',
          '鹤城区',
          '沁县',
          '城子河区',
          '梅江区',
          '永嘉县',
          '赣榆区',
          '桥头镇',
          '怀宁县',
          '工农区',
          '济阳区',
          '阳明区',
          '桐城',
          '岑溪',
          '北流',
          '平潭县',
          '潜山',
          '太和县',
          '麻城',
          '蒙山县',
          '苍南县',
          '博白县',
          '启东',
          '吉水县',
          '界首',
          '黄山区',
          '任丘',
          '陆川县',
          '石排镇',
          '张湾区',
          '铁东区',
          '蓟州区',
          '北关区',
          '颍上县',
          '依安县',
          '兖州区',
          '巨鹿县',
          '奉节县',
          '颍东区',
          '富拉尔基区',
          '金乡县',
          '石龙镇',
          '新城区',
          '云州区',
          '建华区',
          '闽清县',
          '隆尧县',
          '茶山镇',
          '通城县',
          '丰城',
          '泾阳县',
          '宜丰县',
          '魏都区',
          '复兴区',
          '清苑区',
          '五常',
          '让胡路区',
          '大厂县',
          '防城区',
          '长汀县',
          '惠安县',
          '德清县',
          '抚宁区',
          '武安',
          '东港区',
          '城区',
          '台儿庄区',
          '博山区',
          '田东县',
          '沙市区',
          '麻涌镇',
          '大理',
          '五华区',
          '市中区',
          '西林县',
          '掇刀区',
          '港南区',
          '永清县',
          '安新县',
          '资阳区',
          '嵊州',
          '荔城区',
          '云岩区',
          '邵东市',
          '金安区',
          '宾县',
          '广德',
          '埇桥区',
          '金堂县',
          '田家庵区',
          '东台',
          '潼南区',
          '普兰店区',
          '阳曲县',
          '泗县',
          '雄县',
          '泰山区',
          '谢家集区',
          '韶山',
          '郓城县',
          '白云区',
          '皋兰县',
          '嘉陵区',
          '友谊县',
          '名山区',
          '肥城',
          '廉江',
          '大丰区',
          '安源区',
          '淮安区',
          '赤坎区',
          '荣昌区',
          '玉山县',
          '河东区',
          '上林县',
          '瓦房店',
          '太谷区',
          '麻章区',
          '兴城',
          '鄱阳县',
          '涟源',
          '左权县',
          '潮阳区',
          '盱眙县',
          '仁寿县',
          '固镇县',
          '雁江区',
          '孝南区',
          '睢宁县',
          '醴陵',
          '于都县',
          '北湖区',
          '东坑镇',
          '新市区',
          '丰南区',
          '濠江区',
          '青神县',
          '水磨沟区',
          '北城区',
          '长海县',
          '宝应县',
          '江阳区',
          '新乐',
          '龙子湖区',
          '苏仙区',
          '中堂镇',
          '沙依巴克区',
          '开平区',
          '麦积区',
          '兴安县',
          '纳溪区',
          '四会',
          '东胜区',
          '叠彩区',
          '台山',
          '高要区',
          '雁峰区',
          '伊金霍洛',
          '齐河县'], //城市列表
        positionList: [
          '前端开发',
          'c语言开发工程师',
          'C语言开发工程师',
          'Java开发工程师',
          'Java开发',
          'java开发工程师',
          'java开发',
          '算法工程师',
          'C\\+\\+开发',
          'c\\+\\+开发',
          'PHP开发工程师',
          'Python开发工程师',
          'Python开发',
          'python开发',
          '运维工程师',
          '全栈开发工程师',
          '.NET开发工程师',
          '测试工程师',
          '数据挖掘',
          '大数据开发工程师',
          '产品经理',
          'C#开发工程师',
          '自然语言处理（NPL）',
          '嵌入式开发工程师',
          'Go开发工程师',
          '市场经理',
          '大数据架构师',
          'c开发工程师',
          '架构师',
          'golang开发工程师',
          'hadoop方向大数据高级开发工程师',
          '云原生架构师',
          'NLP算法专家',
          '推荐算法',
          'linux c开发工程师',
          '数据库开发工程师'],  //岗位列表
        technologyList: [
          'Python',
          'JavaScript',
          'C\\+\\+',
          'c\\+\\+',
          'C#',
          'PHP',
          '双休',
          'Ruby',
          'Swift',
          'Objective-C',
          'Kotlin',
          'Go',
          'Rust',
          'HTML',
          'html',
          'CSS',
          'css',
          'React',
          'Angular',
          'Vue.js',
          'vue',
          'Node.js',
          'Spring Framework',
          'Spring Boot',
          'Springboot',
          'SpringBoot',
          'springboot',
          'Django',
          'Flask',
          'Laravel',
          'ASP.NET',
          'Express.js',
          'Ruby on Rails',
          'Hibernate',
          'MySQL',
          'Oracle',
          'MongoDB',
          'SQL Server',
          'Firebase',
          'Redis',
          'Elasticsearch',
          'Apache Kafka',
          'Docker',
          'docker',
          'Kubernetes',
          'Git',
          'git',
          'Jenkins',
          'AWS (Amazon Web Services)',
          'Azure',
          'Google Cloud Platform (GCP)',
          'Heroku',
          'Nginx',
          'Apache Tomcat',
          'Apache Hadoop',
          'Spark',
          'Machine Learning',
          'Artificial Intelligence',
          'Data Science',
          'Flutter',
          'React Native',
          'Ionic',
          'Xamarin',
          'Vue Native',
          'TensorFlow',
          'PyTorch',
          'NLP',
          'Computer Vision',
          'Blockchain',
          'Unity',
          'Unreal Engine',
          'Augmented Reality (AR)',
          'Virtual Reality (VR)',
          'Network Administration',
          'GraphQL',
          'Microservices',
          'Serverless Architecture',
          'Object-Oriented Programming (OOP)',
          'Functional Programming',
          'Test-Driven Development (TDD)',
          'DevOps',
          'Agile Methodology',
          'Scrum',
          'Kanban',
          'GitLab',
          'JIRA',
          'Confluence',
          'Amazon S3',
          'Amazon EC2',
          'Amazon RDS',
          'Amazon DynamoDB',
          'Microsoft SQL',
          'SQLite',
          'NoSQL',
          'GraphQL',
          'JSON',
          'XML'],
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
          },
          {
            exampleText: '有没有考研的必要？'
          }, {
            exampleText: '针对目前计算机行情，是否考虑转行业？'
          },
          {
            exampleText: '最新的ChatGPT,已经实现只要一段语句就能实现一款应用,是否会加剧程序员之间的竞争,要如何应对这些情况?'
          },]
      }
    },

    methods: {
      printExampleText(text) {
        this.inputValue = text
        this.tempInputValue = text
        this.sendMessage()
      },
      async sendMessage() {
        this.isLoadingText = true
        if (this.inputValue.length < 1) {
          return Message({
            message: '请输入内容！',
            type: 'warning'
          })
        } else {
          if (this.guidedQuestionListLength < 1 && this.modelType !== '职位推荐') {
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

      async ChatGPTAnswer() {
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
      async positionRecommendation() {
        this.responseText.push({
          content: this.tempInputValue,
          is_robot: 1
        })
        const inputValue = this.tempInputValue

        //获取职位关键字-----------------------------------------------------------------------------------
        const positions = []
        const positionPatterns = this.positionList.map(position => new RegExp(position))
        positionPatterns.forEach(positionPattern => {
          if (positionPattern.test(inputValue)) {
            positions.push(positionPattern.exec(inputValue)[0])
          }
        })
        // 输出结果
        console.log('positions', positions)

        //获取城市关键字-----------------------------------------------------------------------------------
        const cities = []
        // 将tempCityList中的城市转换为正则表达式模式
        const cityPatterns = this.tempCityList.map(city => new RegExp(city))
        // 遍历tempCityList中的城市模式，检查是否在inputValue中出现
        cityPatterns.forEach(cityPattern => {
          if (cityPattern.test(inputValue)) {
            // 匹配到城市，将城市添加到cities数组
            cities.push(cityPattern.exec(inputValue)[0])
          }
        })
        console.log('cities', cities)

        //获取薪资关键字-----------------------------------------------------------------------------------
        // 正则表达式模式
        const pattern = /(\d+)([千K万]?)/g
        // 进行匹配
        const matches = inputValue.matchAll(pattern)
        // 转换结果为以K为单位
        const salaries = [...matches].map(match => {
          const [, number, unit] = match;
          let salary = 0;
          // 将字符串转换为数字
          const numericNumber = parseFloat(number);
          if (!isNaN(numericNumber)) {  // 检查是否成功转换为数字
            if (unit === '千' || unit === 'K') {
              salary = parseFloat((numericNumber).toFixed(2)); // 保留两位小数
            } else if (unit === '万') {
              salary = parseFloat((numericNumber * 10).toFixed(2)); // 保留两位小数
            } else {
              salary = parseFloat((numericNumber / 1000).toFixed(2)); // 保留两位小数
            }
          }
          return salary;
        });
        console.log('salaries', salaries)

        //获取学历关键字-----------------------------------------------------------------------------------
        const educationPatterns = [/本科/, /硕士/, /博士/, /大专/] // 请根据实际情况添加学历模式
        let education = null
        // 遍历educationPatterns中的学历模式，检查是否在inputValue中出现
        for (const educationPattern of educationPatterns) {
          if (educationPattern.test(inputValue)) {
            // 匹配到学历，将学历赋值给education并退出循环
            education = educationPattern.exec(inputValue)[0]
            break
          }
        }
        console.log('education', education)

        //获取经验关键字-----------------------------------------------------------------------------------
        const experiencePatterns = [/应届/, /实习/]
        let experience = null
        for (const experiencePattern of experiencePatterns) {
          if (experiencePattern.test(inputValue)) {
            experience = experiencePattern.exec(inputValue)[0]
            break
          }
        }
        console.log('experience', experience)

        //获取技术栈关键字-----------------------------------------------------------------------------------
        const technologies = []
        const technologyPatterns = this.technologyList.map(technology => new RegExp(technology))
        technologyPatterns.forEach(technologyPattern => {
          if (technologyPattern.test(inputValue)) {
            technologies.push(technologyPattern.exec(inputValue)[0])
          }
        })
        console.log('technologies', technologies)

        const data = {
          positions: positions,
          cities: cities,
          salaries: salaries,
          education: education,
          experience: experience,
          technologies: technologies
        }
        if(positions.length === 0 && cities.length === 0 && salaries.length === 0 &&
          technologies.length === 0 && education === null && experience ===null){
          this.isLoadingText = false
          this.responseText.push({
            content: '赞无职位推荐，请更换描述或需求',
            is_robot: 2
          })
        }else {
          getPositionRecommendationData(data).then(res => {
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
                const truncatedData = data.slice(0, 30);
                this.responseText.push({
                  content: truncatedData,
                  is_robot: 2
                });
              }
            } else {
              alert('获取数据失败')
            }
          })
        }

      },

      async getChatGPTResponse() {
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
          return {
            content: 'API已过期',
            is_robot: 0
          }
        }
        const json = await response.json()
        return {
          content: json.choices[0].text,
          is_robot: 0
        }
      }, // 调用ChatGPT接口响应数据
      gpt() {
        return {
          content: 'API已过期',
          is_robot: 0
        }
      }, // 模拟测试ChatGPT回答

      async questionAnsweringAssistant() {
        this.responseText.push({
          content: this.tempInputValue,
          is_robot: 1
        })
        const question = this.tempInputValue
        await getAnswer(question).then(async res => {
          console.log('res', res)
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
          }, 1000)
        })

      },

      selectGuidedQuestion(item) {
        this.isLoadingText = true
        this.tempInputValue = item.question
        this.tempQuestionId = item.id
        this.questionAnsweringAssistant()
      },

      // 模型选择
      selectChatGPTModel() {
        this.buttonColorChange = 'ChatGPT'
        this.modelType = 'ChatGPT'
      },
      selectPositionRecommendationModel() {
        this.buttonColorChange = '职位推荐'
        this.modelType = '职位推荐'
      },
      selectQuestionAnsweringAssistantModel() {
        this.buttonColorChange = '问答助手'
        this.modelType = '问答助手'
      },
      handleMouseEnter(event) {
        // 处理鼠标进入事件
        event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'
      },
      handleMouseLeave(event) {
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

  .becomeSkyblue {
    background-color: skyblue;
  }
</style>













