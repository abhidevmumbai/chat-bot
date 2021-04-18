import { StateTypes } from "../enums";
import { Data } from "../services";

export const InfoState = {
    'Welcome': {
        type: StateTypes.Question,
        text: () => "Welcome to Replicant! I'm a Thinking Machine on a recorded line. Before we begin I'd like to ask you a few questions. First, what is your name?",
        after: (state) => {
            Data.set('name', state.answer);
        }
    },
    'WhatColor': {
        type: StateTypes.Question,
        text: () => "What is your favourite colour?",
        after: (state) => {
            Data.set('colour', state.answer);
        }
    },
    'WhichLocation': {
        type: StateTypes.Question,
        text: () => "Which city/country are you from?",
        after: (state) => {
            Data.set('location', state.answer);
        }
    }
};