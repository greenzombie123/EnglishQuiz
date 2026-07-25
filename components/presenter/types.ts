export type UserWrong = {
    action: "wrong"
}
export type UserCorrect = {
    action: "correct"
}

export type NextSlide = {
    action: "nextSlide"
}

export type PreviousSlide = {
    action: "previousSlide"
}

export type LessonFinished = {
    action: "lessonFinished"
}

export type UserActed = UserCorrect | UserWrong | NextSlide | PreviousSlide 

export type UserActedKeyValue =
    UserCorrect[keyof UserCorrect] |
    UserWrong[keyof UserWrong] |
    NextSlide[keyof NextSlide] |
    PreviousSlide[keyof PreviousSlide] 