import React from 'react';
import ReactDOM from 'react-dom';

class QuizOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        if (!this.props.isSubmitted) {
            this.props.handleQuizOption(this.props.id, this.props.explanation);
        }
    }

    handleMouseEnter = () => {
        this.setState({ hover: true });
    }

    handleMouseLeave = () => {
        this.setState({ hover: false });
    }
    
    render() {
        const { hover } = this.state;
        const {id, prompt, explanation, correctId, handleQuizOption, isSelected, isSubmitted, selectedId} = this.props;
        const isCorrectResponse = id === correctId;
        const correctGreen = '#DBF5ED';
        const wrongRed = '#FFE0E0';
        const selectedBlue = '#E5F1FF';

        const backgroundColor = (!selectedId && hover ) ? selectedBlue : isSubmitted ? (isCorrectResponse ? correctGreen : (selectedId === id ? wrongRed : 'white')) 
                                    : isSelected ? selectedBlue : 'white';

        const borderGrey = '#DBDBDB';

        return (
            <button type="button" onClick={this.handleClick} 
                    style={{
                            backgroundColor: backgroundColor,
                            width: '90%',
                            textAlign: 'left',
                            margin: '5px',
                            borderColor: borderGrey,
                            padding: '1% 1%',
                            borderRadius: '4px',
                            borderStyle: 'solid'
                        }}
                    onMouseEnter={() => this.handleMouseEnter()} 
                    onMouseLeave={() => this.handleMouseLeave()}
                    className={hover ? 'hover' : null}>
                {prompt}
            </button>
        )
    }
}

function CheckAnswerButton({isSubmitted, handleCheckAnswer, selectedId, correctId}) {
    function handleClick(e) {
        e.preventDefault();
        if (!isSubmitted && selectedId) {
            handleCheckAnswer(selectedId, correctId)
        }
    }
    const checkAnswerYellow = '#F5A623';
    return (
        <button style={{
                            backgroundColor: checkAnswerYellow,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '150px',
                            height: '50px'
                        }}
                onClick={handleClick} >Check Answer</button>
    );
}

function QuizFooter({selectedId, correctId, explanation, handleCheckAnswer, isSubmitted}) {
    let isCorrect = selectedId === correctId;
    let correctGreen = '#30AB84';
    let wrongRed = '#C73D3D';
    return (
        <div style={{
                        color: isCorrect ? correctGreen : wrongRed,
                        paddingLeft: '5%',
                        paddingBottom: '5%',
                        paddingRight: '5%',
                        margin: '5px'
                    }}>
            {isSubmitted ? explanation : <CheckAnswerButton isSubmitted={isSubmitted} handleCheckAnswer={handleCheckAnswer} selectedId={selectedId} correctId={correctId}/> }
        </div>
    );
}

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.handleQuizOption = this.handleQuizOption.bind(this);
        this.handleCheckAnswer = this.handleCheckAnswer.bind(this);
        this.state = {explanation: '', isSubmitted: false, selectedId: null};
    }

    handleQuizOption(id, explanation) {
        this.setState({
            selectedId: id,
            explanation: explanation
        });
    }

    handleCheckAnswer(selectedId, correctId) {
        this.setState({
            isSubmitted: true,
            explanation: this.props.config.choices.find(obj => obj.id === this.state.selectedId).explanation,
            isCorrect: selectedId === correctId
        })
    }

    render() {
        let quizConfig = this.props.config;
        let question = quizConfig.question;
        let header = quizConfig.header;
        return (
            <div style={{backgroundColor: '#FAFAFA'}}>
                <div style={{paddingTop: '5%', paddingLeft:'5%', color: '#F5A623', margin: '5px'}}>{header}</div>
                <div style={{paddingLeft:'5%', color: 'black', margin: '5px'}}><b>{question}</b></div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding:'5px'}}>
                    {quizConfig.choices.map((choice) => (<QuizOption id={choice.id} 
                                                                     prompt={choice.prompt} 
                                                                     explanation={choice.explanation} 
                                                                     handleQuizOption={this.handleQuizOption}
                                                                     key={choice.id} 
                                                                     isSelected={this.state.selectedId === choice.id}
                                                                     isSubmitted={this.state.isSubmitted}
                                                                     selectedId={this.state.selectedId}
                                                                     correctId={quizConfig.correctId}/>))}
                </div>
                <QuizFooter handleCheckAnswer={this.handleCheckAnswer} explanation={this.state.explanation} selectedId={this.state.selectedId} correctId={quizConfig.correctId} isSubmitted={this.state.isSubmitted} />
            </div>
        );								
    }
}
const quizConfig = JSON.parse(document.currentScript.getAttribute('quizconfig'));
const documentName = document.currentScript.getAttribute('documentname');
const quiz = <Quiz config={quizConfig} />
ReactDOM.render(
    quiz,
    document.getElementById(documentName)
);