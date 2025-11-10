```ts 

    type User = Student | Teacher

    type Student = {
        id:string, //uuid
        name:string,
        type:"student",
        teacherId:string
        lessons:LessonInfo[] 
    }

     type LessonInfo = {
        teacherId:string,
        name:string,
        lessonId:number,
        isCompleted:boolean
    }

    type TeacherLessonInfo = {
        teacherId:string,
        name:string,
        lessonId:number,
    }

    type Teacher = {
        id:string, // uuid
        name:string,
        type:"teacher",
        lessons:TeacherLessonInfo[],
        students:string[] //studentId
    }

    // PostgreSQL 

    type Teacher = {
        id:string, // uuid
        name:string,
        type:"teacher",
        lessonInfo:TeacherLessonInfo[],
        lessons:Lesson[]
    }

   

    type Lesson = {
        teacherId:string, //uuid
        id:number,
        name:string,
        slides:Slide[]
    }

    type QuestionSlide = {
        id:number,
        type:"question",
        question:string,
        correctAnswer:string,
        wrongAnswer1:string,
        wrongAnswer2:string,
        wrongAnswer3:string,
    }

    type VocabSlide = {
        id:number,
        type:"vocab",
        targetWord:string,
        definition:string
    }

    type Slide = VocabSlide || QuestionSlide


    // Start of Lesson
    type GetLessonFunc = (url:string):Slide[] 

    const startLesson = ()=>{
        // get reference for lesson component
        // call getLesson to get slides
        // pass slides to component
        // render slides
    }

    const slideState:SlideState = ()=>{
        const slide:Slides = []
        const currentSlideIndex:number | "Finished" = 0

        const changeSlide = (nextIndex:number)=>{}
        const setSlides = (slide:Slides)=>{}
        const getCurrentSlide = ():Slide=>{}

        return {
            changeSlide,
            setSlides,
            getCurrentSlide
        }
    }() 


    class Lesson extends HTMLElement{

        currentSlide:HTMLSlideElement

        construction(){
            super()
            this.slideState = slideState
        }

        connectedCallback(){}
        disconnectedCallback(){} 


        // Lesson methods

        //Check if the answer is correct
        checkAnswer(){}

        // Sets the slides from the database to the slidestate
        setSlides(slides:Slides){}

        changeCurrentSlide(slide:Slide){}
        // setCurrentSlide, getSlideType, createSlide // also creates end slide
        render(){}

       
        // eventHandlers

        handleNextSlide(button:HTMLButtonElement){
            // this.slideState.changeSlide(1)
            // const nextSlide = this.slideState.getCurrentSlide()
            // changeCurrentSlide(nextSlide)
            // render()
        }

        handleCorrectAnswer(button:MultiAnswerButton){
            // changeButton color
            // play sound
            // wait
            // change state
            // update UI
        }
        handleWrongAnswer(){}
        handleMultiButtonClicked(button:MultiAnswerButton){
            // getAnswer
            // checkAnswer
            // if corrent dispatch correntAnswer
            // if wrong dispatch wrongAnswer
        }
    }

    class EndSlide extends HTMLElement{

        construction(){
            super()
        }

        setData(){}
        render(){}
        // send post request /lesson/teacherid/lessonid
        handleNextButtonClicked(){}
    }

    class VocabSlide extends HTMLElement{

        construction(){
            super()
        }

        setData(){}
        render(){}
        handleNextButtonClicked(){}
    }

    class QuestionSlide extends HTMLElement{

        construction(){
            super()
        }

        setData(){}
        changeToRed(){}
        changeToGreen(){}
        playCorrectAnswer(){}
        playWrongAnswer(){}
        handleMultiChoiceButtonClicked(){}
    }

    class MultiChoiceButton extends HTMLElement{
        construction(){
            super()
        }

        setData(){}
        changeToRed(){}
        changeToBlue(){}
        playCorrectAnswer(){}
        playWrongAnswer(){}
        handleClick(){}
    }

    //

    class Lesson{
        slides; 
        constructor(){super()}
        changeSlide(){}
        render(){}
        handleClick(){}
    }

    class Lesson{
        this.slider = slider
        render(){}
        handleClick(){}
    }

    class Sliders{
        slides;
        changeSlides(){}
    }

```

```sql
CREATE TYPE slide AS (
    id integer
    type text CHECK type = 'question' OR text = 'vocab'
    targetWord text CHECK type = 'vocab'
    definition text CHECK type = 'vocab'
    question text CHECK type = 'question'
    correctAnswer text
    wrongAnswer1 text
    wrongAnswer2 text
    wrongAnswer3 text
)

# INSERT 
# UPDATE 
```

Student Lessons Page -> Lesson Page

1. Link    /lesson?teacher=fhufefe&lessonId=12
2. Link + Cookies  /lesson    {teacher="fwwef", lessonId=12}

