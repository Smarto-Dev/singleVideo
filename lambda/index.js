const Alexa = require('ask-sdk-core');
const util = require('./util');
const constants = require('./constants'); // utility functions
const HELP_MESSAGE = 'This plays video, . Just open the skill to see the video.';
const ERROR_MESSAGE = 'Sorry, an error occurred in the skill. Please check the logs.';
const STOP_MESSAGE = 'Goodbye!';
// NOTE: set the video url location below

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' 
        || request.intent.name === 'confirmationIntent'
        || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.arguments.length > 0
            && handlerInput.requestEnvelope.request.arguments[0] === 'VIDEOENDED');
    },
    handle(handlerInput) {
        
        if (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'){
            let speechText = `Would you like listen to that video again?`;
            return handlerInput.responseBuilder
                .speak(speechText)
                .withShouldSessionEnd(false)
                .getResponse();
        }
        else{
            try {
                const attributes = handlerInput.attributesManager.getSessionAttributes();
                let speechText = `OKAY! HERE IS YOUR EVENING CEREMONY!`;
                console.log(`~~~~~~~ ERROR: four`);
                if (util.supportsAPL(handlerInput)) {
                    handlerInput.responseBuilder.addDirective({
                        type: 'Alexa.Presentation.APL.RenderDocument',
                        version: '1.6',
                        document: constants.APL.videoAPL
                    });
                    return handlerInput.responseBuilder.speak(speechText)
                    // .withShouldEndSession(false)
                    .getResponse();
                }
                return handlerInput.responseBuilder
                    .speak('Unsupported device').getResponse();
            } catch (error) {
                console.error(error);
                return handlerInput.responseBuilder
                    .speak('something went wrong in Video Intent').getResponse();
            }
        }
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(HELP_MESSAGE)
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            (request.intent.name === 'AMAZON.CancelIntent' ||
                request.intent.name === 'AMAZON.StopIntent' ||
                    request.intent.name === 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(STOP_MESSAGE)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.stack}`);

        return handlerInput.responseBuilder
            .speak(ERROR_MESSAGE)
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        ExitHandler,
        SessionEndedRequestHandler,
    )
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('cookbook/videoapp-directive/v1')
    .lambda();