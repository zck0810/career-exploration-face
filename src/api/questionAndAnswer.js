import request from '@/utils/request'

export function getAnswer(question){
  return request({
    url:'/question-and-answer/getAnswer',
    method:'get',
    params:{question: question}
  })
}

export function getGuidedQuestion(up_one_level_question_id){
  return request({
    url:'/question-and-answer/getGuidedQuestion',
    method:'get',
    params:{up_one_level_question_id: up_one_level_question_id}
  })
}


